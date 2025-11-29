import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import QuickActionsBar from '../../components/QuickActionsBar';
import WalletAddressDisplay from '../../components/WalletAddressDisplay';
import BalanceOverview from './components/BalanceOverview';
import NetworkCard from './components/NetworkCard';
import RecentTransactions from './components/RecentTransactions';
import OrigamiCrowMascot from './components/OrigamiCrowMascot';
import Icon from '../../components/AppIcon';
import { getWalletBalance, getTransactionHistory } from '../../services/api';
import { useNetwork } from '../../contexts/NetworkContext';

const UserDashboard = () => {
  const location = useLocation();
  const { networkMode, isTestnet, getRpcUrl } = useNetwork();
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const [portfolioData, setPortfolioData] = useState(null);
  const [networks, setNetworks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Kullanıcının cüzdan adresini localStorage'dan al (wallet creation'dan sonra kaydedilecek)
  const walletAddress = localStorage.getItem('walletAddress') || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

  // Check for notification from navigation state
  useEffect(() => {
    if (location.state?.notification) {
      setNotification(location.state.notification);
      
      // Refresh dashboard data to show new transaction
      fetchDashboardData();
      
      // Clear notification after 10 seconds
      setTimeout(() => {
        setNotification(null);
      }, 10000);
      
      // Clear the navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    fetchDashboardData();
    // Her 30 saniyede bir güncelle
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [walletAddress, networkMode]); // networkMode değiştiğinde de yenile

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Wallet yoksa mock data göster
      if (!walletAddress || walletAddress === '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb') {
        // Mock data
        setPortfolioData({
          totalBalance: 0,
          percentageChange: 0,
          lastUpdated: new Date().toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        });
        
        setNetworks([
          {
            id: 'ethereum',
            network: 'Ethereum',
            balance: '0.00 ETH',
            usdValue: 0,
            gasInfo: '25 Gwei',
            status: 'healthy',
            icon: 'Hexagon'
          },
          {
            id: 'tron',
            network: 'TRON',
            balance: '0.00 TRX',
            usdValue: 0,
            gasInfo: '420 TRX',
            status: 'healthy',
            icon: 'Triangle'
          },
          {
            id: 'bitcoin',
            network: 'Bitcoin',
            balance: '0.00 BTC',
            usdValue: 0,
            gasInfo: '15 sat/vB',
            status: 'healthy',
            icon: 'Circle'
          }
        ]);
        
        // Load transactions from localStorage
        const savedTxs1 = JSON.parse(localStorage.getItem('transactions') || '[]');
        console.log('📋 Loading transactions from localStorage:', savedTxs1.length, 'total');
        const formattedTxs1 = savedTxs1.slice(0, 5).map(tx => ({
          id: tx.txHash,
          type: 'send',
          description: `Sent ${tx.amount} ETH`,
          amount: `${tx.amount} ETH`,
          usdValue: parseFloat(tx.amount) * 2000,
          network: tx.network,
          networkIcon: 'Hexagon',
          status: tx.status,
          timestamp: new Date(tx.timestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          txHash: tx.txHash,
        }));
        console.log('📋 Formatted transactions:', formattedTxs1.length);
        setTransactions(formattedTxs1);
        setError(null);
        setLoading(false);
        return;
      }
      
      // Ethereum bakiye sorgula (Network mode'a göre RPC)
      try {
        const rpcUrl = getRpcUrl('ethereum'); // Network mode'a göre RPC URL al
        console.log(`Fetching balance from ${isTestnet ? 'Sepolia' : 'Mainnet'}:`, rpcUrl);
        
        const response = await fetch(rpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getBalance',
            params: [walletAddress, 'latest'],
            id: 1
          })
        });
        
        if (!response.ok) {
          throw new Error(`RPC request failed: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error.message || 'RPC error');
        }
        
        const balanceWei = data.result ? parseInt(data.result, 16) : 0;
        const balanceEth = balanceWei / 1e18;
        
        console.log(`Balance: ${balanceEth} ETH on ${isTestnet ? 'Sepolia' : 'Mainnet'}`);
        
        setPortfolioData({
          totalBalance: balanceEth * 2000, // Mock ETH price
          percentageChange: 0,
          lastUpdated: new Date().toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        });
        
        setNetworks([
          {
            id: 'ethereum',
            network: `Ethereum ${isTestnet ? 'Sepolia' : 'Mainnet'}`,
            balance: `${balanceEth.toFixed(6)} ETH`,
            usdValue: balanceEth * 2000,
            gasInfo: '25 Gwei',
            status: 'healthy',
            icon: 'Hexagon'
          },
          {
            id: 'tron',
            network: 'TRON',
            balance: '0.00 TRX',
            usdValue: 0,
            gasInfo: '420 TRX',
            status: 'healthy',
            icon: 'Triangle'
          },
          {
            id: 'bitcoin',
            network: 'Bitcoin',
            balance: '0.00 BTC',
            usdValue: 0,
            gasInfo: '15 sat/vB',
            status: 'healthy',
            icon: 'Circle'
          },
          {
            id: 'solana',
            network: 'Solana',
            balance: '0.00 SOL',
            usdValue: 0,
            gasInfo: '0.00025 SOL',
            status: 'healthy',
            icon: 'Zap'
          }
        ]);
        
        // Load transactions from localStorage
        const savedTxs2 = JSON.parse(localStorage.getItem('transactions') || '[]');
        const formattedTxs2 = savedTxs2.slice(0, 5).map(tx => ({
          id: tx.txHash,
          type: 'send',
          description: `Sent ${tx.amount} ETH`,
          amount: `${tx.amount} ETH`,
          usdValue: parseFloat(tx.amount) * 2000,
          network: tx.network,
          networkIcon: 'Hexagon',
          status: tx.status,
          timestamp: new Date(tx.timestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          txHash: tx.txHash,
        }));
        setTransactions(formattedTxs2);
        setError(null);
      } catch (rpcError) {
        console.error('RPC Error:', rpcError);
        // RPC hatası varsa mock data göster
        setPortfolioData({
          totalBalance: 0,
          percentageChange: 0,
          lastUpdated: new Date().toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        });
        
        setNetworks([
          {
            id: 'ethereum',
            network: 'Ethereum',
            balance: '0.00 ETH',
            usdValue: 0,
            gasInfo: '25 Gwei',
            status: 'healthy',
            icon: 'Hexagon'
          },
          {
            id: 'tron',
            network: 'TRON',
            balance: '0.00 TRX',
            usdValue: 0,
            gasInfo: '420 TRX',
            status: 'healthy',
            icon: 'Triangle'
          },
          {
            id: 'bitcoin',
            network: 'Bitcoin',
            balance: '0.00 BTC',
            usdValue: 0,
            gasInfo: '15 sat/vB',
            status: 'healthy',
            icon: 'Circle'
          },
          {
            id: 'solana',
            network: 'Solana',
            balance: '0.00 SOL',
            usdValue: 0,
            gasInfo: '0.00025 SOL',
            status: 'healthy',
            icon: 'Zap'
          }
        ]);
        
        setTransactions([]);
        setError(null);
      }
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      // Hata durumunda da mock data göster
      setPortfolioData({
        totalBalance: 0,
        percentageChange: 0,
        lastUpdated: new Date().toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      });
      
      setNetworks([
        {
          id: 'ethereum',
          network: 'Ethereum',
          balance: '0.00 ETH',
          usdValue: 0,
          gasInfo: '25 Gwei',
          status: 'healthy',
          icon: 'Hexagon'
        },
        {
          id: 'tron',
          network: 'TRON',
          balance: '0.00 TRX',
          usdValue: 0,
          gasInfo: '420 TRX',
          status: 'healthy',
          icon: 'Triangle'
        },
        {
          id: 'bitcoin',
          network: 'Bitcoin',
          balance: '0.00 BTC',
          usdValue: 0,
          gasInfo: '15 sat/vB',
          status: 'healthy',
          icon: 'Circle'
        },
        {
          id: 'solana',
          network: 'Solana',
          balance: '0.00 SOL',
          usdValue: 0,
          gasInfo: '0.00025 SOL',
          status: 'healthy',
          icon: 'Zap'
        }
      ]);
      
      setTransactions([]);
      setError(null); // Error'u gizle, mock data göster
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Dashboard - Crowly';
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="main-content flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Success Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 max-w-md animate-slide-in-right">
          <div className="bg-surface border border-success rounded-xl shadow-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-success bg-opacity-10">
                <Icon name="CheckCircle2" size={24} className="text-success" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">Transaction Successful!</h4>
                <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                {notification.explorerUrl && (
                  <a 
                    href={notification.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                  >
                    View on Explorer
                    <Icon name="ExternalLink" size={12} />
                  </a>
                )}
              </div>
              <button 
                onClick={() => setNotification(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
      
      <main className="main-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-4 p-4 bg-error bg-opacity-10 border border-error rounded-lg">
              <p className="text-error">{error}</p>
              <button 
                onClick={fetchDashboardData}
                className="mt-2 text-sm text-accent hover:underline"
              >
                Retry
              </button>
            </div>
          )}
          
          <div className="space-y-6">
            <BalanceOverview 
              totalBalance={portfolioData?.totalBalance}
              percentageChange={portfolioData?.percentageChange}
              lastUpdated={portfolioData?.lastUpdated}
            />

            <QuickActionsBar />

            <WalletAddressDisplay 
              address={walletAddress}
              network={selectedNetwork}
              showQR={true}
            />

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Multi-Chain Networks</h2>
              {networks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {networks.map((network) => (
                    <NetworkCard
                      key={network?.id}
                      network={network?.network}
                      balance={network?.balance}
                      usdValue={network?.usdValue}
                      gasInfo={network?.gasInfo}
                      status={network?.status}
                      icon={network?.icon}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No network data available</p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecentTransactions transactions={transactions} />
              </div>
              <div>
                <OrigamiCrowMascot />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;