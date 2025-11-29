# 🔗 Frontend - Backend Entegrasyonu

## 📁 Oluşturulan Dosyalar

```
src/services/api/
├── apiClient.js              # Merkezi API client (axios)
├── walletService.js          # Cüzdan işlemleri
├── transactionService.js     # Transaction işlemleri
├── gasService.js             # Gas fee tahminleri
├── networkService.js         # Network durumu
├── priceService.js           # Token fiyatları
├── index.js                  # Tüm servisleri export eder
└── KULLANIM_KILAVUZU.js      # Detaylı kullanım örnekleri
```

## 🚀 Hızlı Başlangıç

### 1. Environment Variables

`.env` dosyası oluştur (kök dizinde):

```bash
cp .env.example .env
```

Düzenle:
```env
VITE_GEMINI_API_KEY=your_key
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
```

### 2. Backend'i Başlat

```bash
cd backend
npm install
npm run migrate
npm run dev
```

Backend `http://localhost:3000` adresinde çalışacak.

### 3. API'leri Kullan

#### Örnek 1: Balance Getirme (Dashboard)

**ÖNCE** (Mock data):
```javascript
const portfolioData = {
  totalBalance: 45678.92,
  percentageChange: 5.67
};
```

**SONRA** (Gerçek API):
```javascript
import { getWalletBalance } from '../services/api';

const [portfolioData, setPortfolioData] = useState(null);

useEffect(() => {
  async function fetchBalance() {
    try {
      const data = await getWalletBalance(userAddress, 'ethereum');
      setPortfolioData({
        totalBalance: data.usdValue,
        balance: data.balance,
        tokens: data.tokens
      });
    } catch (error) {
      console.error(error);
    }
  }
  fetchBalance();
}, [userAddress]);
```

#### Örnek 2: Transaction Gönderme

```javascript
import { sendTransaction } from '../services/api';

const handleSend = async () => {
  try {
    const result = await sendTransaction({
      from: '0x...',
      to: '0x...',
      amount: 1.5,
      token: 'ETH',
      network: 'ethereum',
      feeSpeed: 'standard',
      password: userPassword
    });
    
    alert('Başarılı! TX: ' + result.txHash);
  } catch (error) {
    alert('Hata: ' + error.error?.message);
  }
};
```

#### Örnek 3: Gas Fee Tahmini

```javascript
import { getGasEstimate } from '../services/api';

useEffect(() => {
  async function fetchGas() {
    const fees = await getGasEstimate('ethereum', 'transfer');
    console.log('Slow:', fees.slow.cost);
    console.log('Standard:', fees.standard.cost);
    console.log('Fast:', fees.fast.cost);
  }
  fetchGas();
}, []);
```

## 📄 Değiştirilmesi Gereken Sayfalar

### 1. User Dashboard (`src/pages/user-dashboard/index.jsx`)

**Mock veri satırları (13-63):**
```javascript
// ❌ Bunları sil
const portfolioData = { ... };
const networks = [ ... ];
const transactions = [ ... ];
```

**Yerine koy:**
```javascript
// ✅ API çağrıları
import { getWalletBalance, getTransactionHistory, getNetworkStatus } from '../../services/api';

const [portfolioData, setPortfolioData] = useState(null);
const [networks, setNetworks] = useState([]);
const [transactions, setTransactions] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadData() {
    try {
      const address = localStorage.getItem('walletAddress');
      
      // Balance
      const balanceData = await getWalletBalance(address, selectedNetwork);
      setPortfolioData({
        totalBalance: balanceData.usdValue,
        balance: balanceData.balance,
        lastUpdated: new Date().toLocaleString()
      });
      
      // Networks
      const networkData = await getNetworkStatus();
      setNetworks(networkData.networks);
      
      // Transactions
      const txData = await getTransactionHistory(address, { limit: 5 });
      setTransactions(txData.transactions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  loadData();
}, [selectedNetwork]);
```

### 2. Send Transfer (`src/pages/send-transfer/index.jsx`)

**Mock veri satırları (30-80):**
```javascript
// ❌ Bunları sil
const tokens = [ ... ];
const networks = [ ... ];
```

**Yerine koy:**
```javascript
// ✅ API çağrıları
import { getWalletBalance, sendTransaction, getGasEstimate } from '../../services/api';

const [tokens, setTokens] = useState([]);
const [feeEstimate, setFeeEstimate] = useState(null);

useEffect(() => {
  async function loadTokens() {
    const address = localStorage.getItem('walletAddress');
    const data = await getWalletBalance(address, selectedNetwork);
    setTokens(data.tokens);
  }
  loadTokens();
}, [selectedNetwork]);

useEffect(() => {
  async function loadGasFees() {
    const fees = await getGasEstimate(selectedNetwork, 'transfer');
    setFeeEstimate(fees);
  }
  loadGasFees();
}, [selectedNetwork]);

// Transaction gönderme
const handleSubmit = async () => {
  try {
    const result = await sendTransaction({
      from: userAddress,
      to: recipient,
      amount: parseFloat(amount),
      token: selectedToken.symbol,
      network: selectedNetwork,
      feeSpeed: selectedSpeed,
      password: password // Input'tan al
    });
    
    navigate(`/transaction/${result.txHash}`);
  } catch (error) {
    alert('Hata: ' + error.error?.message);
  }
};
```

### 3. Receive Page (`src/pages/receive/index.jsx`)

**Mock veri satırı (14):**
```javascript
// ❌ Bunu sil
const networkAddresses = { ... };
```

**Yerine koy:**
```javascript
// ✅ LocalStorage'dan oku
const [address, setAddress] = useState('');

useEffect(() => {
  const addr = localStorage.getItem('walletAddress');
  setAddress(addr);
}, []);
```

### 4. Wallet Creation (`src/pages/walet-creation/index.jsx`)

**Mock veri yerine:**
```javascript
import { createWallet, importWallet } from '../../services/api';

const handleCreateWallet = async () => {
  try {
    const wallet = await createWallet({
      method: 'generate',
      network: selectedNetwork,
      password: password
    });
    
    // Seed phrase'i göster (bir kere!)
    console.log('SEED PHRASE:', wallet.seedPhrase);
    alert('Seed phrase\'inizi kaydedin: ' + wallet.seedPhrase);
    
    // LocalStorage'a kaydet
    localStorage.setItem('walletAddress', wallet.address);
    localStorage.setItem('selectedNetwork', selectedNetwork);
    
    navigate('/user-dashboard');
  } catch (error) {
    alert('Hata: ' + error.error?.message);
  }
};
```

## 🔍 Debug İpuçları

### API Çağrısı Test Et

```javascript
// Console'da test et
import { getWalletBalance } from './services/api';

getWalletBalance('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', 'ethereum')
  .then(data => console.log('✓ Success:', data))
  .catch(err => console.error('✗ Error:', err));
```

### Backend Çalışıyor mu?

```bash
# Terminal'de test et
curl http://localhost:3000/health

# Veya tarayıcıda aç
http://localhost:3000/health
```

### CORS Hatası?

Backend `.env` dosyasında:
```env
CORS_ORIGIN=http://localhost:4028
```

### Network Error?

1. Backend çalışıyor mu kontrol et
2. `.env` dosyasında `VITE_API_BASE_URL` doğru mu?
3. Browser console'da error loglarına bak

## 📚 Detaylı Dokümantasyon

- `KULLANIM_KILAVUZU.js` - Her API için detaylı örnekler
- `backend/README.md` - Backend kurulum kılavuzu
- `backend/COMPLETED.md` - Backend özeti

## ✅ Checklist

Backend hazırsa:

- [ ] `.env` dosyası oluşturuldu ve dolduruldu
- [ ] Backend çalışıyor (`npm run dev`)
- [ ] Frontend çalışıyor (`npm start`)
- [ ] Mock veriler temizlendi
- [ ] API servisleri import edildi
- [ ] useEffect'ler eklendi
- [ ] Error handling eklendi
- [ ] Loading state'leri eklendi

## 🎯 Sonraki Adımlar

1. ✅ Backend'i başlat
2. ✅ `.env` dosyasını düzenle
3. ✅ Mock verileri API çağrılarıyla değiştir
4. ✅ Test et
5. ✅ Production'a deploy et

Sorular için `KULLANIM_KILAVUZU.js` dosyasına bak!
