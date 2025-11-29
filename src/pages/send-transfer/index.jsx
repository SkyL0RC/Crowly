import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/Header';
import QuickActionsBar from '../../components/QuickActionsBar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import TokenSelector from './components/TokenSelector';
import NetworkSelector from './components/NetworkSelector';
import RecipientInput from './components/RecipientInput';
import AmountInput from './components/AmountInput';
import FeeEstimation from './components/FeeEstimation';
import TransactionPreview from './components/TransactionPreview';
import MascotGuidance from './components/MascotGuidance';
import ConfirmationModal from './components/ConfirmationModal';
import { sendTransaction, getGasEstimate } from '../../services/api';
import { getWalletBalance } from '../../services/api';

const SendTransfer = () => {
  const navigate = useNavigate();
  const [selectedToken, setSelectedToken] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedSpeed, setSelectedSpeed] = useState('standard');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [feeOptions, setFeeOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const walletAddress = localStorage.getItem('walletAddress') || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

  useEffect(() => {
    fetchWalletData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, selectedNetwork]);

  useEffect(() => {
    if (selectedNetwork) {
      fetchGasEstimate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNetwork, amount]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      
      // Mock data - wallet yoksa veya backend çalışmıyorsa
      if (!walletAddress || walletAddress === '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb') {
        const mockTokens = [
          {
            id: 'eth',
            symbol: 'ETH',
            name: 'Ethereum',
            balance: '0.00',
            usdValue: 0,
            price: 2000,
            icon: 'Hexagon',
            iconAlt: 'Ethereum cryptocurrency coin'
          },
          {
            id: 'usdt',
            symbol: 'USDT',
            name: 'Tether USD',
            balance: '0.00',
            usdValue: 0,
            price: 1,
            icon: 'DollarSign',
            iconAlt: 'USDT stablecoin'
          }
        ];
        
        setTokens(mockTokens);
        if (!selectedToken) {
          setSelectedToken(mockTokens[0]);
        }
        setLoading(false);
        return;
      }
      
      const response = await getWalletBalance(walletAddress);
      
      if (response.success) {
        const formattedTokens = response.data.networks
          .filter(n => n.network.toLowerCase() === selectedNetwork)
          .flatMap(n => n.tokens.map(token => ({
            id: token.symbol.toLowerCase(),
            symbol: token.symbol,
            name: token.name,
            balance: token.balance,
            usdValue: token.usdValue,
            price: token.price,
            icon: getTokenIcon(token.symbol),
            iconAlt: `${token.name} cryptocurrency coin`
          })));
        
        setTokens(formattedTokens);
        if (formattedTokens.length > 0 && !selectedToken) {
          setSelectedToken(formattedTokens[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
      // Hata durumunda mock data
      const mockTokens = [
        {
          id: 'eth',
          symbol: 'ETH',
          name: 'Ethereum',
          balance: '0.00',
          usdValue: 0,
          price: 2000,
          icon: 'Hexagon',
          iconAlt: 'Ethereum cryptocurrency coin'
        }
      ];
      setTokens(mockTokens);
      if (!selectedToken) {
        setSelectedToken(mockTokens[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchGasEstimate = async () => {
    if (!amount || parseFloat(amount) === 0) {
      // Mock gas fees
      setFeeOptions({
        [selectedNetwork]: {
          slow: { 
            fee: '20 Gwei', 
            usdFee: 1.5,
            time: '~3 min' 
          },
          standard: { 
            fee: '25 Gwei', 
            usdFee: 2.0,
            time: '~1 min' 
          },
          fast: { 
            fee: '30 Gwei', 
            usdFee: 2.5,
            time: '~30 sec' 
          }
        }
      });
      return;
    }
    
    try {
      const response = await getGasEstimate(selectedNetwork, {
        to: recipient || '0x0000000000000000000000000000000000000000',
        value: amount,
        token: selectedToken?.symbol
      });
      
      if (response.success) {
        setFeeOptions({
          [selectedNetwork]: {
            slow: { 
              fee: response.data.slow.gasPrice, 
              usdFee: response.data.slow.estimatedCost,
              time: response.data.slow.estimatedTime 
            },
            standard: { 
              fee: response.data.standard.gasPrice, 
              usdFee: response.data.standard.estimatedCost,
              time: response.data.standard.estimatedTime 
            },
            fast: { 
              fee: response.data.fast.gasPrice, 
              usdFee: response.data.fast.estimatedCost,
              time: response.data.fast.estimatedTime 
            }
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch gas estimate:', error);
      // Hata durumunda mock gas fees
      setFeeOptions({
        [selectedNetwork]: {
          slow: { 
            fee: '20 Gwei', 
            usdFee: 1.5,
            time: '~3 min' 
          },
          standard: { 
            fee: '25 Gwei', 
            usdFee: 2.0,
            time: '~1 min' 
          },
          fast: { 
            fee: '30 Gwei', 
            usdFee: 2.5,
            time: '~30 sec' 
          }
        }
      });
    }
  };

  const getTokenIcon = (symbol) => {
    const icons = {
      'USDT': 'https://images.unsplash.com/photo-1651055693398-0d66969cf759',
      'ETH': 'https://img.rocket.new/generatedImages/rocket_gen_img_139bc3e59-1764158508302.png',
      'TRX': 'https://images.unsplash.com/photo-1642261366979-704a073bef4b',
      'BTC': 'https://images.unsplash.com/photo-1629877522005-f0405c013d78',
      'SOL': 'https://images.unsplash.com/photo-1649609732631-0c7b63d4ef52'
    };
    return icons[symbol] || 'https://via.placeholder.com/40';
  };

  const networks = [
    {
      id: 'ethereum',
      name: 'Ethereum',
      icon: 'Hexagon',
      feeLabel: 'Gas Fee',
      currentFee: feeOptions?.[selectedNetwork]?.[selectedSpeed]?.fee || '25 Gwei'
    },
    {
      id: 'tron',
      name: 'TRON',
      icon: 'Triangle',
      feeLabel: 'Bandwidth',
      currentFee: feeOptions?.[selectedNetwork]?.[selectedSpeed]?.fee || '420 TRX'
    },
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      icon: 'Circle',
      feeLabel: 'Transaction Fee',
      currentFee: feeOptions?.[selectedNetwork]?.[selectedSpeed]?.fee || '15 sat/vB'
    },
    {
      id: 'solana',
      name: 'Solana',
      icon: 'Zap',
      feeLabel: 'Transaction Fee',
      currentFee: feeOptions?.[selectedNetwork]?.[selectedSpeed]?.fee || '0.00025 SOL'
    }
  ];

  const recentRecipients = [
  {
    id: 1,
    name: 'Alice Johnson',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
  },
  {
    id: 2,
    name: 'Bob Smith',
    address: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72'
  },
  {
    id: 3,
    name: 'Carol Williams',
    address: '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c'
  }];




  const validateAddress = (address) => {
    if (!address) return 'Recipient address is required';
    if (address?.length < 20) return 'Invalid address format';
    return '';
  };

  const validateAmount = (amt) => {
    if (!amt || parseFloat(amt) === 0) return 'Amount is required';
    if (parseFloat(amt) < 0) return 'Amount must be positive';
    if (selectedToken && parseFloat(amt) > parseFloat(selectedToken?.balance?.replace(/,/g, ''))) {
      return 'Insufficient balance';
    }
    return '';
  };

  const handleMaxClick = () => {
    if (selectedToken) {
      setAmount(selectedToken?.balance?.replace(/,/g, ''));
      setErrors({ ...errors, amount: '' });
    }
  };

  const handleScanQR = () => {
    setShowQRScanner(true);
    setTimeout(() => {
      setRecipient('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
      setShowQRScanner(false);
      setErrors({ ...errors, recipient: '' });
    }, 1500);
  };

  const handleSelectRecent = (address) => {
    setRecipient(address);
    setErrors({ ...errors, recipient: '' });
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    const newErrors = {};
    const recipientError = validateAddress(recipient);
    const amountError = validateAmount(amount);

    if (recipientError) newErrors.recipient = recipientError;
    if (amountError) newErrors.amount = amountError;

    setErrors(newErrors);

    if (Object.keys(newErrors)?.length === 0) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmTransaction = async () => {
    try {
      setSending(true);
      
      const response = await sendTransaction({
        from: walletAddress,
        to: recipient,
        amount: amount,
        tokenSymbol: selectedToken?.symbol,
        network: selectedNetwork,
        gasOption: selectedSpeed
      });
      
      if (response.success) {
        setShowConfirmation(false);
        
        setTimeout(() => {
          navigate('/user-dashboard', {
            state: {
              notification: {
                type: 'success',
                message: `Successfully sent ${amount} ${selectedToken?.symbol} to ${recipient?.slice(0, 10)}...${recipient?.slice(-8)}`,
                txHash: response.data.transactionHash
              }
            }
          });
        }, 500);
      } else {
        throw new Error(response.error || 'Transaction failed');
      }
    } catch (error) {
      console.error('Transaction error:', error);
      setErrors({ ...errors, transaction: error.message || 'Failed to send transaction' });
      setShowConfirmation(false);
    } finally {
      setSending(false);
    }
  };

  const calculateUsdValue = () => {
    if (!amount || !selectedToken) return 0;
    return parseFloat(amount) * selectedToken?.price;
  };

  const getCurrentFee = () => {
    return feeOptions?.[selectedNetwork]?.[selectedSpeed];
  };

  const calculateTotal = () => {
    if (!amount || !selectedToken) return '0.00';
    const amountNum = parseFloat(amount);
    const feeNum = parseFloat(getCurrentFee()?.fee?.split(' ')?.[0]);
    return (amountNum + feeNum)?.toFixed(8);
  };

  const getEstimatedTime = () => {
    const times = {
      slow: '~5-10 minutes',
      standard: '~2-5 minutes',
      fast: '~30 seconds'
    };
    return times?.[selectedSpeed];
  };

  if (loading || !selectedToken) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader2" size={32} className="animate-spin text-accent" />
        <span className="ml-3 text-muted-foreground">Loading wallet data...</span>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Send Transfer - Tether WDK Wallet</title>
        <meta name="description" content="Send cryptocurrency securely across multiple blockchain networks with optimized fees" />
      </Helmet>
      <Header />
      <main className="main-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={() => navigate('/user-dashboard')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">

              <Icon name="ArrowLeft" size={20} />
              <span className="text-sm">Back to Dashboard</span>
            </button>
            <h1 className="text-3xl font-bold text-foreground mb-2">Send Transfer</h1>
            <p className="text-muted-foreground">
              Send cryptocurrency securely across multiple blockchain networks
            </p>
          </div>

          <div className="mb-6">
            <QuickActionsBar />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-card">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Transaction Details</h2>
                  
                  <div className="space-y-6">
                    <TokenSelector
                      selectedToken={selectedToken}
                      onTokenSelect={setSelectedToken}
                      tokens={tokens} />


                    <NetworkSelector
                      selectedNetwork={selectedNetwork}
                      onNetworkSelect={setSelectedNetwork}
                      networks={networks} />


                    <RecipientInput
                      value={recipient}
                      onChange={setRecipient}
                      error={errors?.recipient}
                      onScan={handleScanQR}
                      recentRecipients={recentRecipients}
                      onSelectRecent={handleSelectRecent} />


                    <AmountInput
                      amount={amount}
                      onChange={setAmount}
                      error={errors?.amount}
                      selectedToken={selectedToken}
                      usdValue={calculateUsdValue()}
                      onMaxClick={handleMaxClick} />

                  </div>
                </div>

                <FeeEstimation
                  network={selectedNetwork}
                  selectedSpeed={selectedSpeed}
                  onSpeedSelect={setSelectedSpeed}
                  feeOptions={feeOptions?.[selectedNetwork]} />


                <MascotGuidance
                  network={selectedNetwork}
                  selectedSpeed={selectedSpeed}
                  amount={amount}
                  balance={selectedToken?.balance?.replace(/,/g, '')} />

              </div>

              <div className="space-y-6">
                {amount && recipient && (
                  <TransactionPreview
                    selectedToken={selectedToken}
                    amount={amount}
                    recipient={recipient}
                    network={networks?.find((n) => n?.id === selectedNetwork)?.name}
                    fee={getCurrentFee()?.fee}
                    totalAmount={calculateTotal()}
                    estimatedTime={getEstimatedTime()} 
                  />
                )}

                <div className="glass-card">
                  {errors.transaction && (
                    <div className="mb-4 p-3 bg-error bg-opacity-10 border border-error rounded-lg">
                      <p className="text-sm text-error">{errors.transaction}</p>
                    </div>
                  )}
                  
                  <Button
                    type="submit"
                    variant="default"
                    fullWidth
                    iconName="Send"
                    iconPosition="right"
                    disabled={!amount || !recipient || sending}
                  >
                    {sending ? 'Sending...' : 'Review & Send'}
                  </Button>

                  <div className="mt-4">
                    <div className="flex items-start gap-2">
                      <Icon name="ShieldCheck" size={16} className="text-success mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        Your transaction is secured with end-to-end encryption and on-device key management.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      {showQRScanner &&
      <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm" />
          <div className="relative bg-surface border border-accent rounded-2xl p-8 text-center">
            <Icon name="QrCode" size={64} className="text-accent mx-auto mb-4 animate-pulse" />
            <p className="text-foreground font-medium">Scanning QR Code...</p>
          </div>
        </div>
      }
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmTransaction}
        transactionData={{
          amount: amount,
          token: selectedToken?.symbol,
          usdValue: calculateUsdValue()?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          fee: getCurrentFee()?.fee,
          total: `${calculateTotal()} ${selectedToken?.symbol}`
        }} />

    </>);

};

export default SendTransfer;