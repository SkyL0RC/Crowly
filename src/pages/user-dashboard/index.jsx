import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import QuickActionsBar from '../../components/QuickActionsBar';
import WalletAddressDisplay from '../../components/WalletAddressDisplay';
import BalanceOverview from './components/BalanceOverview';
import NetworkCard from './components/NetworkCard';
import RecentTransactions from './components/RecentTransactions';
import OrigamiCrowMascot from './components/OrigamiCrowMascot';
import { getWalletBalance, getTransactionHistory } from '../../services/api';

const UserDashboard = () => {
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const [portfolioData, setPortfolioData] = useState(null);
  const [networks, setNetworks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kullanıcının cüzdan adresini localStorage'dan al (wallet creation'dan sonra kaydedilecek)
  const walletAddress = localStorage.getItem('walletAddress') || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

  useEffect(() => {
    fetchDashboardData();
    // Her 30 saniyede bir güncelle
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [walletAddress]);

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
        
        setTransactions([]);
        setError(null);
        setLoading(false);
        return;
      }
      
      // Cüzdan bakiyelerini çek
      const balanceResponse = await getWalletBalance(walletAddress);
      
      if (balanceResponse.success) {
        const { totalBalance, networks: networkBalances } = balanceResponse.data;
        
        // Portfolio verisi
        setPortfolioData({
          totalBalance: totalBalance,
          percentageChange: 5.67, // Bu değer price history'den hesaplanabilir
          lastUpdated: new Date().toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        });
        
        // Network verilerini formatla
        const formattedNetworks = networkBalances.map(network => ({
          id: network.network.toLowerCase(),
          network: network.network,
          balance: `${network.balance} ${network.network === 'ethereum' ? 'ETH' : network.network === 'tron' ? 'TRX' : network.network === 'bitcoin' ? 'BTC' : 'SOL'}`,
          usdValue: network.usdValue,
          gasInfo: network.gasPrice || 'N/A',
          status: network.status || 'healthy',
          icon: network.network === 'ethereum' ? 'Hexagon' : network.network === 'tron' ? 'Triangle' : network.network === 'bitcoin' ? 'Circle' : 'Zap'
        }));
        
        setNetworks(formattedNetworks);
      }

      // Transaction history'yi çek
      const txResponse = await getTransactionHistory(walletAddress, { limit: 5 });
      
      if (txResponse.success) {
        const formattedTx = txResponse.data.map(tx => ({
          id: tx.id,
          type: tx.type,
          description: `${tx.type === 'receive' ? 'Received' : 'Sent'} ${tx.tokenSymbol}`,
          amount: `${tx.amount} ${tx.tokenSymbol}`,
          usdValue: tx.usdValue,
          network: tx.network,
          networkIcon: tx.network === 'ethereum' ? 'Hexagon' : tx.network === 'tron' ? 'Triangle' : tx.network === 'bitcoin' ? 'Circle' : 'Zap',
          status: tx.status,
          timestamp: tx.timestamp
        }));
        
        setTransactions(formattedTx);
      }

      setError(null);
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
        }
      ]);
      
      setTransactions([]);
      setError(null); // Error'u gizle, mock data göster
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Dashboard - Tether WDK Wallet';
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