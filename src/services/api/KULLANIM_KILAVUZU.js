/**
 * API KULLANIM KILAVUZU
 * 
 * Bu dosya, backend API'lerini frontend'de nasıl kullanacağını gösterir.
 * Mock verilerin yerine gerçek API çağrıları nasıl yapılır örneklerle açıklanmıştır.
 */

// ============================================
// 1. KURULUM
// ============================================

// .env dosyasına ekle:
// VITE_API_BASE_URL=http://localhost:3000/api

// ============================================
// 2. IMPORT ETM E
// ============================================

import { 
  getWalletBalance,
  getTransactionHistory,
  sendTransaction,
  getGasEstimate,
  getNetworkStatus,
  getTokenPrices
} from '../services/api';

// veya

import api from '../services/api';
// api.wallet.getWalletBalance()
// api.transaction.sendTransaction()
// vb.

// ============================================
// 3. USER DASHBOARD - Balance Getirme
// ============================================

// ÖNCE: Mock data
/*
const portfolioData = {
  totalBalance: 45678.92,
  percentageChange: 5.67,
};
*/

// SONRA: API ile
const [portfolioData, setPortfolioData] = useState(null);
const [loading, setLoading] = useState(true);
const userAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'; // LocalStorage'dan al

useEffect(() => {
  async function fetchBalance() {
    try {
      setLoading(true);
      const data = await getWalletBalance(userAddress, 'ethereum');
      
      setPortfolioData({
        totalBalance: data.usdValue,
        balance: data.balance,
        tokens: data.tokens,
        lastUpdated: new Date().toLocaleString()
      });
    } catch (error) {
      console.error('Balance fetch error:', error);
    } finally {
      setLoading(false);
    }
  }
  
  fetchBalance();
}, [userAddress]);

// ============================================
// 4. TRANSACTION GEÇMİŞİ
// ============================================

// ÖNCE: Mock data
/*
const transactions = [
  { id: 1, type: 'receive', amount: '500 USDT', ... }
];
*/

// SONRA: API ile
const [transactions, setTransactions] = useState([]);

useEffect(() => {
  async function fetchTransactions() {
    try {
      const data = await getTransactionHistory(userAddress, {
        network: 'ethereum',
        limit: 10,
        offset: 0
      });
      
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Transaction fetch error:', error);
    }
  }
  
  fetchTransactions();
}, [userAddress]);

// ============================================
// 5. SEND TRANSFER - Transaction Gönderme
// ============================================

// Form submit handler
const handleSendTransaction = async (e) => {
  e.preventDefault();
  
  try {
    setLoading(true);
    
    const result = await sendTransaction({
      from: userAddress,
      to: recipient,
      amount: amount,
      token: selectedToken.symbol,
      network: selectedNetwork,
      feeSpeed: selectedSpeed, // 'slow', 'standard', 'fast'
      password: password, // Kullanıcıdan al
      memo: memo || ''
    });
    
    // Başarılı!
    console.log('Transaction sent:', result.txHash);
    alert('Transaction başarıyla gönderildi!');
    
    // Transaction detay sayfasına yönlendir
    navigate(`/transaction/${result.txHash}`);
    
  } catch (error) {
    console.error('Send error:', error);
    alert('Transaction gönderilemedi: ' + error.error?.message);
  } finally {
    setLoading(false);
  }
};

// ============================================
// 6. GAS FEE TAHMİNİ
// ============================================

// ÖNCE: Mock data
/*
const feeOptions = [
  { speed: 'slow', time: '~5 mins', cost: '0.0012 ETH' }
];
*/

// SONRA: API ile
const [feeOptions, setFeeOptions] = useState(null);

useEffect(() => {
  async function fetchGasFees() {
    try {
      const data = await getGasEstimate(selectedNetwork, 'transfer');
      
      setFeeOptions({
        slow: {
          time: `~${Math.round(data.slow.estimatedTime / 60)} mins`,
          cost: `${data.slow.cost} ETH`,
          costUSD: data.slow.costUSD
        },
        standard: {
          time: `~${Math.round(data.standard.estimatedTime / 60)} mins`,
          cost: `${data.standard.cost} ETH`,
          costUSD: data.standard.costUSD
        },
        fast: {
          time: `~${Math.round(data.fast.estimatedTime / 60)} mins`,
          cost: `${data.fast.cost} ETH`,
          costUSD: data.fast.costUSD
        }
      });
    } catch (error) {
      console.error('Gas fee fetch error:', error);
    }
  }
  
  // Network değiştiğinde yeniden hesapla
  fetchGasFees();
}, [selectedNetwork]);

// ============================================
// 7. NETWORK STATUS
// ============================================

const [networks, setNetworks] = useState([]);

useEffect(() => {
  async function fetchNetworkStatus() {
    try {
      const data = await getNetworkStatus();
      
      setNetworks(data.networks.map(network => ({
        id: network.id,
        name: network.name,
        status: network.status, // 'healthy', 'congested', 'down'
        gasPrice: network.gasPrice,
        blockHeight: network.blockHeight
      })));
    } catch (error) {
      console.error('Network status fetch error:', error);
    }
  }
  
  fetchNetworkStatus();
  
  // Her 30 saniyede bir güncelle
  const interval = setInterval(fetchNetworkStatus, 30000);
  return () => clearInterval(interval);
}, []);

// ============================================
// 8. TOKEN FİYATLARI
// ============================================

const [prices, setPrices] = useState({});

useEffect(() => {
  async function fetchPrices() {
    try {
      const data = await getTokenPrices(['ETH', 'BTC', 'BNB', 'TRX', 'USDT']);
      
      setPrices(data.prices);
      // data.prices.ETH.usd
      // data.prices.ETH.change24h
    } catch (error) {
      console.error('Price fetch error:', error);
    }
  }
  
  fetchPrices();
  
  // Her 1 dakikada bir güncelle
  const interval = setInterval(fetchPrices, 60000);
  return () => clearInterval(interval);
}, []);

// ============================================
// 9. WALLET OLUŞTURMA
// ============================================

import { createWallet } from '../services/api';

const handleCreateWallet = async () => {
  try {
    const wallet = await createWallet({
      method: 'generate', // veya 'import'
      network: 'ethereum',
      password: userPassword,
      // seedPhrase: '...' // sadece import için
    });
    
    // Cüzdan oluşturuldu!
    console.log('Wallet address:', wallet.address);
    console.log('Seed phrase:', wallet.seedPhrase); // Sadece generate'de
    
    // LocalStorage'a kaydet
    localStorage.setItem('walletAddress', wallet.address);
    localStorage.setItem('selectedNetwork', 'ethereum');
    
    // Dashboard'a yönlendir
    navigate('/user-dashboard');
    
  } catch (error) {
    console.error('Wallet creation error:', error);
    alert('Cüzdan oluşturulamadı: ' + error.error?.message);
  }
};

// ============================================
// 10. ERROR HANDLING
// ============================================

// API çağrılarında hata yakalama
try {
  const result = await sendTransaction(data);
  // Başarılı
} catch (error) {
  // error.error.message - Hata mesajı
  // error.error.code - Hata kodu
  
  if (error.error?.code === 'VALIDATION_ERROR') {
    // Validation hatası
    alert('Form hatası: ' + error.error.message);
  } else if (error.error?.code === 'INSUFFICIENT_FUNDS') {
    // Yetersiz bakiye
    alert('Yetersiz bakiye!');
  } else {
    // Genel hata
    alert('Bir hata oluştu: ' + error.error?.message);
  }
}

// ============================================
// 11. LOADING STATE ÖRNEK COMPONENT
// ============================================

function DashboardExample() {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function loadBalance() {
      try {
        setLoading(true);
        setError(null);
        
        const address = localStorage.getItem('walletAddress');
        const data = await getWalletBalance(address, 'ethereum');
        
        setBalance(data);
      } catch (err) {
        setError(err.error?.message || 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }
    
    loadBalance();
  }, []);
  
  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;
  if (!balance) return <div>Veri bulunamadı</div>;
  
  return (
    <div>
      <h2>Bakiye: ${balance.usdValue}</h2>
      <p>{balance.balance} ETH</p>
    </div>
  );
}

// ============================================
// 12. HANGİ SAYFALARDA NE DEĞİŞECEK?
// ============================================

/*

📄 /src/pages/user-dashboard/index.jsx
   - portfolioData → getWalletBalance() ile değiştir
   - networks → getNetworkStatus() ile değiştir
   - transactions → getTransactionHistory() ile değiştir

📄 /src/pages/send-transfer/index.jsx
   - tokens → getWalletBalance() ile değiştir
   - feeOptions → getGasEstimate() ile değiştir
   - handleSubmit → sendTransaction() ile değiştir

📄 /src/pages/receive/index.jsx
   - networkAddresses → localStorage'dan oku
   - transactions → getTransactionHistory() ile değiştir

📄 /src/pages/walet-creation/index.jsx
   - handleCreateWallet → createWallet() ile değiştir

*/

// ============================================
// 13. ENVIRONMENT VARIABLES
// ============================================

/*
.env dosyasına ekle:

VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000

Production'da:
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_WS_URL=wss://api.yourdomain.com
*/
