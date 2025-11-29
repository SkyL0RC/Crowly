import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/Header';
import QuickActionsBar from '../../components/QuickActionsBar';
import NetworkSelector from './components/NetworkSelector';
import QRCodeDisplay from './components/QRCodeDisplay';
import ShareOptions from './components/ShareOptions';
import IncomingTransactions from './components/IncomingTransaction';
import AddressHistory from './components/AddressHistory';
import OrigimiCrowGuidance from './components/OrigamiCrowGuidance';
import { getTransactionHistory } from '../../services/api';

const Receive = () => {
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [incomingTx, setIncomingTx] = useState([]);

  // Cuzdan adresini localStorage'dan al
  const storedAddress = localStorage.getItem('walletAddress') || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

  // Her network için farklı adres formatı (gerçek uygulamada backend'den gelecek)
  const networkAddresses = {
    ethereum: storedAddress,
    tron: `T${storedAddress.slice(2, 35)}`, // Basitleştirilmiş dönüşüm
    bitcoin: `bc1q${storedAddress.slice(2, 42)}`,
    solana: storedAddress.slice(0, 44)
  };

  useEffect(() => {
    setWalletAddress(networkAddresses[selectedNetwork]);
    fetchIncomingTransactions();
  }, [selectedNetwork]);

  const fetchIncomingTransactions = async () => {
    try {
      setLoading(true);
      const response = await getTransactionHistory(storedAddress, {
        type: 'receive',
        network: selectedNetwork,
        limit: 10
      });
      
      if (response.success) {
        setIncomingTx(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch incoming transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNetworkChange = (networkId) => {
    setSelectedNetwork(networkId);
  };

  return (
    <>
      <Helmet>
        <title>Receive Cryptocurrency - Crowly</title>
        <meta 
          name="description" 
          content="Receive cryptocurrency across multiple blockchain networks with secure address generation and QR codes. Support for Ethereum, TRON, Bitcoin, and Solana networks." 
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="main-content">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-accent bg-opacity-20">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Receive Cryptocurrency</h1>
              </div>
              <p className="text-muted-foreground">
                Generate network-specific addresses and QR codes to receive cryptocurrency deposits
              </p>
            </div>

            <div className="mb-6">
              <QuickActionsBar />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-3">
                <NetworkSelector 
                  selectedNetwork={selectedNetwork}
                  onNetworkChange={handleNetworkChange}
                />
              </div>

              <div className="lg:col-span-2">
                <QRCodeDisplay 
                  address={walletAddress}
                  network={selectedNetwork}
                />
              </div>

              <div className="space-y-6">
                <ShareOptions 
                  address={walletAddress}
                  network={selectedNetwork}
                />
                <OrigimiCrowGuidance />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IncomingTransactions network={selectedNetwork} />
              <AddressHistory network={selectedNetwork} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Receive;