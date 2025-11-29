import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { signAndSendSepoliaTransaction, estimateSepoliaGas } from '../../utils/transactionSigner';
import { useNetwork } from '../../contexts/NetworkContext';

const SendTransfer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isTestnet, getExplorerUrl } = useNetwork();
  const [selectedToken, setSelectedToken] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [selectedSpeed, setSelectedSpeed] = useState('standard');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [feeOptions, setFeeOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  
  const walletAddress = localStorage.getItem('walletAddress') || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

  // URL parametrelerini oku
  useEffect(() => {
    const addressParam = searchParams.get('address');
    const networkParam = searchParams.get('network');
    const amountParam = searchParams.get('amount');
    const memoParam = searchParams.get('memo');

    console.log('URL Parameters:', { addressParam, networkParam, amountParam, memoParam });

    if (addressParam) {
      setRecipient(addressParam);
    }
    if (networkParam) {
      setSelectedNetwork(networkParam);
    }
    if (amountParam) {
      setAmount(amountParam);
    }
    if (memoParam) {
      setMemo(memoParam);
      console.log('Memo set to:', memoParam);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchWalletData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, selectedNetwork, isTestnet]); // isTestnet değişince de yenile

  useEffect(() => {
    if (selectedNetwork) {
      fetchGasEstimate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNetwork, amount]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      
      // Gerçek bakiyeyi RPC'den çek
      if (walletAddress && walletAddress !== '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb') {
        try {
          const rpcUrl = isTestnet 
            ? 'https://ethereum-sepolia-rpc.publicnode.com'
            : 'https://ethereum-rpc.publicnode.com';
          
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
          
          const data = await response.json();
          const balanceWei = data.result ? parseInt(data.result, 16) : 0;
          const balanceEth = (balanceWei / 1e18).toFixed(6);
          
          console.log('ETH Balance:', balanceEth);
          
          const realTokens = [
            {
              id: 'eth',
              symbol: 'ETH',
              name: 'Ethereum',
              balance: balanceEth,
              usdValue: parseFloat(balanceEth) * 2000,
              price: 2000,
              icon: 'Hexagon',
              iconAlt: 'Ethereum cryptocurrency coin'
            }
          ];
          
          setTokens(realTokens);
          if (!selectedToken) {
            setSelectedToken(realTokens[0]);
          }
          setLoading(false);
          return;
        } catch (error) {
          console.error('Failed to fetch balance:', error);
        }
      }
      
      // Mock data - wallet yoksa
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
    
    // Ethereum address validation (0x + 40 hex characters)
    if (selectedNetwork === 'ethereum') {
      if (!address.startsWith('0x')) return 'Address must start with 0x';
      if (address.length !== 42) return 'Invalid Ethereum address length';
      if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return 'Invalid Ethereum address format';
    } else {
      if (address.length < 20) return 'Invalid address format';
    }
    
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
    // Validate password
    if (!password) {
      setErrors({ ...errors, password: 'Password is required to sign transaction' });
      return;
    }

    try {
      setSending(true);
      setErrors({});

      // Use real Sepolia transaction for Ethereum
      if (selectedNetwork === 'ethereum') {
        const result = await signAndSendSepoliaTransaction({
          to: recipient,
          amount: amount,
          password: password,
          isTestnet: isTestnet, // Network mode'u gönder
        });

        if (result.success) {
          setShowConfirmation(false);
          setPassword('');
          
          const explorerUrl = getExplorerUrl('ethereum');
          
          setTimeout(() => {
            navigate('/user-dashboard', {
              state: {
                notification: {
                  type: 'success',
                  message: `Successfully sent ${amount} ETH to ${recipient.slice(0, 10)}...${recipient.slice(-8)}`,
                  txHash: result.txHash,
                  explorerUrl: `${explorerUrl}/tx/${result.txHash}`,
                }
              }
            });
          }, 500);
          return;
        }
      }

      // Mock transaction for other networks
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
      setErrors({ 
        password: error.message.includes('password') || error.message.includes('decrypt') 
          ? 'Incorrect password' 
          : '',
        transaction: error.message || 'Failed to send transaction'
      });
      setPassword('');
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
        <title>Send Transfer - Crowly</title>
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

                    {memo && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">
                          Payment Message
                        </label>
                        <div className="p-4 glass-card">
                          <div className="flex items-start gap-3">
                            <Icon name="MessageSquare" size={20} color="var(--color-accent)" className="flex-shrink-0 mt-1" />
                            <div className="flex-1">
                              <div className="text-sm text-muted-foreground mb-1.5">Message from sender:</div>
                              <div className="text-base text-foreground font-medium leading-relaxed">
                                "{memo}"
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

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
        onClose={() => {
          setShowConfirmation(false);
          setShowPasswordInput(false);
          setPassword('');
        }}
        onConfirm={handleConfirmTransaction}
        password={password}
        setPassword={setPassword}
        error={errors.password}
        isProcessing={sending}
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