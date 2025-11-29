import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/Header';
import QuickActionsBar from '../../components/QuickActionsBar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import TokenSelector from './components/TokenSelector';
import NetworkSelector from './components/NetworkSelector';
import AmountInput from './components/AmountInput';
import SwapPreview from './components/SwapPreview';
import PriceInfo from './components/PriceInfo';
import SlippageSettings from './components/SlippageSettings';
import ConfirmationModal from './components/ConfirmationModal';
import MascotGuidance from './components/MascotGuidance';
import { getWalletBalance, getTokenPrice } from '../../services/api';

const Swap = () => {
  const navigate = useNavigate();
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [swapping, setSwapping] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [priceData, setPriceData] = useState(null);
  const [errors, setErrors] = useState({});

  const walletAddress = localStorage.getItem('walletAddress') || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

  useEffect(() => {
    fetchWalletData();
  }, [walletAddress, selectedNetwork]);

  useEffect(() => {
    if (fromToken && toToken && fromAmount) {
      calculateSwapAmount();
    }
  }, [fromToken, toToken, fromAmount]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      
      // Mock data - wallet yoksa
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
            network: 'ethereum'
          },
          {
            id: 'usdt',
            symbol: 'USDT',
            name: 'Tether USD',
            balance: '0.00',
            usdValue: 0,
            price: 1,
            icon: 'DollarSign',
            network: 'ethereum'
          },
          {
            id: 'usdc',
            symbol: 'USDC',
            name: 'USD Coin',
            balance: '0.00',
            usdValue: 0,
            price: 1,
            icon: 'Circle',
            network: 'ethereum'
          }
        ];
        
        setTokens(mockTokens);
        if (!fromToken) setFromToken(mockTokens[0]);
        if (!toToken) setToToken(mockTokens[1]);
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
            network: n.network
          })));
        
        setTokens(formattedTokens);
        if (!fromToken && formattedTokens.length > 0) {
          setFromToken(formattedTokens[0]);
        }
        if (!toToken && formattedTokens.length > 1) {
          setToToken(formattedTokens[1]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSwapAmount = async () => {
    try {
      if (!fromToken || !toToken || !fromAmount) return;

      // Basit fiyat hesaplama (gerçek uygulamada DEX API kullanılacak)
      const fromPrice = fromToken.price || 2000;
      const toPrice = toToken.price || 1;
      const rate = fromPrice / toPrice;
      const estimatedAmount = (parseFloat(fromAmount) * rate * (1 - slippage / 100)).toFixed(6);
      
      setToAmount(estimatedAmount);
      
      setPriceData({
        rate: rate,
        fromPrice: fromPrice,
        toPrice: toPrice,
        impact: 0.1, // Mock değer
        fee: 0.3 // Mock değer (%0.3)
      });
    } catch (error) {
      console.error('Failed to calculate swap amount:', error);
    }
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const validateSwap = () => {
    const newErrors = {};
    
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      newErrors.fromAmount = 'Enter an amount';
    }
    
    if (parseFloat(fromAmount) > parseFloat(fromToken?.balance || 0)) {
      newErrors.fromAmount = 'Insufficient balance';
    }
    
    if (!fromToken || !toToken) {
      newErrors.tokens = 'Select both tokens';
    }
    
    if (fromToken?.id === toToken?.id) {
      newErrors.tokens = 'Cannot swap same token';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSwap = () => {
    if (validateSwap()) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmSwap = async () => {
    try {
      setSwapping(true);
      
      // Backend'e swap isteği gönderilecek
      // const response = await swapTokens({
      //   from: fromToken.symbol,
      //   to: toToken.symbol,
      //   amount: fromAmount,
      //   slippage: slippage,
      //   network: selectedNetwork
      // });
      
      // Mock başarılı işlem
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowConfirmation(false);
      
      // Başarı mesajı göster
      alert(`Successfully swapped ${fromAmount} ${fromToken.symbol} to ${toAmount} ${toToken.symbol}`);
      
      // Dashboard'a yönlendir
      navigate('/user-dashboard');
      
    } catch (error) {
      console.error('Swap failed:', error);
      alert('Swap failed. Please try again.');
    } finally {
      setSwapping(false);
    }
  };

  const getTokenIcon = (symbol) => {
    const iconMap = {
      'ETH': 'Hexagon',
      'BTC': 'Circle',
      'USDT': 'DollarSign',
      'USDC': 'Circle',
      'TRX': 'Triangle'
    };
    return iconMap[symbol] || 'Coins';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading swap interface...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Swap Tokens - Crowly</title>
        <meta 
          name="description" 
          content="Swap cryptocurrencies instantly across multiple networks with the best rates and low fees." 
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="main-content">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-accent bg-opacity-20">
                  <Icon name="ArrowLeftRight" size={24} className="text-accent" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Swap Tokens</h1>
              </div>
              <p className="text-muted-foreground">
                Exchange tokens instantly at the best rates across multiple networks
              </p>
            </div>

            <div className="mb-6">
              <QuickActionsBar />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Swap Interface */}
              <div className="lg:col-span-2 space-y-6">
                <NetworkSelector 
                  selectedNetwork={selectedNetwork}
                  onNetworkChange={setSelectedNetwork}
                />

                <div className="card-elevated">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">Swap</h2>
                    <SlippageSettings 
                      slippage={slippage}
                      onSlippageChange={setSlippage}
                    />
                  </div>

                  {/* From Token */}
                  <div className="space-y-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        From
                      </label>
                      <div className="flex gap-3">
                        <TokenSelector
                          tokens={tokens}
                          selectedToken={fromToken}
                          onSelectToken={setFromToken}
                          excludeToken={toToken}
                        />
                        <AmountInput
                          value={fromAmount}
                          onChange={setFromAmount}
                          token={fromToken}
                          error={errors.fromAmount}
                        />
                      </div>
                      {fromToken && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Balance: {fromToken.balance} {fromToken.symbol}
                        </p>
                      )}
                    </div>

                    {/* Swap Button */}
                    <div className="flex justify-center -my-2">
                      <button
                        onClick={handleSwapTokens}
                        className="p-2 rounded-full bg-surface border border-border hover:bg-accent hover:border-accent transition-all duration-200 group"
                      >
                        <Icon 
                          name="ArrowDownUp" 
                          size={20} 
                          className="text-foreground group-hover:text-background transition-colors"
                        />
                      </button>
                    </div>

                    {/* To Token */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        To (estimated)
                      </label>
                      <div className="flex gap-3">
                        <TokenSelector
                          tokens={tokens}
                          selectedToken={toToken}
                          onSelectToken={setToToken}
                          excludeToken={fromToken}
                        />
                        <div className="flex-1 input-base bg-surface">
                          <input
                            type="text"
                            value={toAmount}
                            readOnly
                            className="w-full bg-transparent text-foreground text-lg font-medium outline-none"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      {toToken && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Balance: {toToken.balance} {toToken.symbol}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price Info */}
                  {priceData && (
                    <PriceInfo
                      fromToken={fromToken}
                      toToken={toToken}
                      priceData={priceData}
                      slippage={slippage}
                    />
                  )}

                  {/* Errors */}
                  {errors.tokens && (
                    <div className="mt-4 p-3 bg-destructive/10 border border-destructive rounded-lg">
                      <p className="text-sm text-destructive">{errors.tokens}</p>
                    </div>
                  )}

                  {/* Swap Button */}
                  <div className="mt-6">
                    <Button
                      onClick={handleSwap}
                      disabled={!fromAmount || !fromToken || !toToken || swapping}
                      className="w-full"
                      size="lg"
                    >
                      {swapping ? (
                        <>
                          <Icon name="Loader2" size={20} className="animate-spin mr-2" />
                          Swapping...
                        </>
                      ) : (
                        'Swap Tokens'
                      )}
                    </Button>
                  </div>
                </div>

                {/* Swap Preview */}
                {fromAmount && toAmount && fromToken && toToken && (
                  <SwapPreview
                    fromToken={fromToken}
                    toToken={toToken}
                    fromAmount={fromAmount}
                    toAmount={toAmount}
                    priceData={priceData}
                    slippage={slippage}
                  />
                )}
              </div>

              {/* Mascot Guidance */}
              <div className="lg:col-span-1">
                <MascotGuidance 
                  step="swap"
                  fromToken={fromToken}
                  toToken={toToken}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <ConfirmationModal
          fromToken={fromToken}
          toToken={toToken}
          fromAmount={fromAmount}
          toAmount={toAmount}
          priceData={priceData}
          slippage={slippage}
          onConfirm={handleConfirmSwap}
          onCancel={() => setShowConfirmation(false)}
          isLoading={swapping}
        />
      )}
    </>
  );
};

export default Swap;
