import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import MethodSelectionCard from './components/MethodSelectionCard';
import SeedPhraseDisplay from './components/SeedPhraseDisplay';
import SeedPhraseVerification from './components/SeedPhraseVerification';
import ImportWalletForm from './components/ImportWalletForm';
import LoginForm from './components/LoginForm';
import OrigamiCrowMascot from './components/OrigamiCrowMascot';
import ProgressIndicator from './components/ProgressIndicator';
import SecurityBadges from './components/SecurityBadges';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { createWallet, importWallet } from '../../services/api';
import { encryptAndStoreSeedPhrase, hasStoredWallet, decryptSeedPhrase } from '../../utils/secureStorage';

const WalletCreation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [generatedSeedPhrase, setGeneratedSeedPhrase] = useState([]);
  const [mascotTip, setMascotTip] = useState('security');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [walletData, setWalletData] = useState(null);
  const [userPassword, setUserPassword] = useState(''); // Kullanıcının belirlediği şifre

  const steps = [
    { id: 'method', label: 'Choose Method' },
    { id: 'setup', label: 'Setup Wallet' },
    { id: 'verify', label: 'Verify & Secure' },
    { id: 'complete', label: 'Complete' }
  ];

  useEffect(() => {
    // URL'den mode parametresini kontrol et
    const mode = searchParams.get('mode');
    
    if (mode === 'login') {
      // Login moduna geç (wallet varsa direkt açılsın, yoksa da açılsın)
      setSelectedMethod('login');
      setCurrentStep(1);
    } else if (hasStoredWallet() && !mode) {
      // Eğer wallet varsa ve mode belirtilmemişse dashboard'a yönlendir
      navigate('/user-dashboard');
    }
  }, [navigate, searchParams]);

  useEffect(() => {
    if (selectedMethod === 'generate' && currentStep === 1 && generatedSeedPhrase.length === 0) {
      generateNewWallet();
    }
  }, [selectedMethod, currentStep]);

  const generateNewWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Backend'den sadece address almak için geçici request
      // Seed phrase backend'den gelecek ama saklanmayacak
      const response = await createWallet({
        method: 'generate',
        network: 'ethereum',
        password: 'temp-not-used' // Backend için dummy, kullanılmıyor artık
      });
      
      if (response && response.seedPhrase) {
        const phrase = response.seedPhrase.split(' ');
        setGeneratedSeedPhrase(phrase);
        setWalletData(response);
        setMascotTip('backup');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Wallet creation error:', err);
      setError(err.message || 'Failed to create wallet');
      setCurrentStep(0);
      setSelectedMethod(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationComplete = async () => {
    // Kullanıcıdan şifre iste
    const password = prompt('🔐 Set a password to secure your wallet:\n(Min 8 characters)');
    
    if (!password || password.length < 8) {
      alert('❌ Password must be at least 8 characters');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('💾 Starting wallet save process...');
      console.log('📝 Wallet data:', walletData);
      console.log('🔑 Seed phrase length:', generatedSeedPhrase.length);
      
      // Seed phrase'i şifrele ve yerel olarak kaydet
      const saveResult = await encryptAndStoreSeedPhrase(
        generatedSeedPhrase.join(' '),
        password,
        {
          address: walletData.address,
          network: walletData.network,
          networkType: walletData.networkType,
          createdAt: walletData.createdAt
        }
      );

      console.log('✅ Encryption result:', saveResult);

      // Wallet metadata'yı da localStorage'a kaydet (şifresiz)
      localStorage.setItem('walletAddress', walletData.address);
      localStorage.setItem('walletNetwork', walletData.network);
      
      console.log('✅ Wallet metadata saved to localStorage');
      
      // Verify save
      const stored = localStorage.getItem('crowdk_encrypted_wallet');
      console.log('🔍 Verification - encrypted wallet exists:', !!stored);
      
      if (!stored) {
        throw new Error('Failed to save encrypted wallet to localStorage');
      }
      
      setCurrentStep(3);
      setMascotTip('security');
      
      setTimeout(() => {
        console.log('🚀 Navigating to dashboard...');
        navigate('/user-dashboard');
      }, 2000);
    } catch (err) {
      console.error('❌ Storage error:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack
      });
      setError(`Failed to save wallet: ${err.message}`);
      alert(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  const handleContinueFromMethod = () => {
    if (!selectedMethod) return;
    setCurrentStep(1);
    setMascotTip(selectedMethod === 'generate' ? 'backup' : 'encryption');
  };

  const handleContinueFromSeedPhrase = () => {
    setCurrentStep(2);
    setMascotTip('verification');
  };

  const handleImportComplete = async (importData) => {
    try {
      setLoading(true);
      setError(null);
      
      // ImportWalletForm'dan gelen data formatı: { method: 'seed', data: 'word1 word2...' }
      const seedPhrase = importData.data;
      
      if (!seedPhrase) {
        throw new Error('Seed phrase is required');
      }
      
      // Step 1: Kullanıcıdan şifre iste (seed phrase'i şifrelemek için)
      const password = prompt(
        '🔐 Wallet şifrelemek için bir şifre belirleyin:\n(Bu şifre wallet\'ınızı açmak için kullanılacak)'
      );
      
      if (!password || password.length < 8) {
        setError('Şifre en az 8 karakter olmalı');
        setLoading(false);
        return;
      }

      // Step 2: Backend'e seed phrase'i gönder (sadece address almak için)
      // Backend bunu ASLA saklamayacak!
      const response = await importWallet({
        method: 'import',
        seedPhrase: seedPhrase,
        network: 'ethereum'
      });
      
      if (!response?.address) {
        throw new Error('Invalid response from server');
      }

      // Step 3: Seed phrase'i LOCAL olarak şifrele (Web Crypto API)
      await encryptAndStoreSeedPhrase(
        seedPhrase,
        password,
        {
          address: response.address,
          network: 'ethereum',
          createdAt: new Date().toISOString()
        }
      );

      // Step 4: Sadece public data'yı localStorage'a kaydet (şifresiz)
      localStorage.setItem('walletAddress', response.address);
      localStorage.setItem('walletNetwork', 'ethereum');
      
      setCurrentStep(3);
      setMascotTip('security');
      setTimeout(() => {
        navigate('/user-dashboard');
      }, 2000);
    } catch (err) {
      console.error('Wallet import error:', err);
      setError(err.message || 'Failed to import wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      if (currentStep === 1) {
        setSelectedMethod(null);
        setMascotTip('security');
      }
    }
  };

  const handleLogin = async (password) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔐 Login attempt started...');
      console.log('📦 Checking localStorage for encrypted wallet...');
      
      const stored = localStorage.getItem('crowdk_encrypted_wallet');
      if (!stored) {
        console.error('❌ No encrypted wallet found in localStorage');
        throw new Error('No wallet found. Please create or import a wallet first.');
      }
      
      console.log('✅ Encrypted wallet found, attempting to decrypt...');
      
      // Şifreyi kullanarak seed phrase'i decrypt et
      const decryptedData = await decryptSeedPhrase(password);
      
      console.log('🔓 Decryption result:', decryptedData ? '✅ Success' : '❌ Failed');
      
      if (!decryptedData || !decryptedData.seedPhrase) {
        console.error('❌ Decryption failed or invalid data structure');
        throw new Error('Incorrect password or corrupted data');
      }
      
      console.log('✅ Login successful! Redirecting to dashboard...');
      
      // Başarılı login - dashboard'a yönlendir
      navigate('/user-dashboard');
    } catch (err) {
      console.error('❌ Login error:', err);
      console.error('Error details:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
      setError(err.message || 'Incorrect password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="main-content">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            {error && (
              <div className="mb-6 p-4 bg-error bg-opacity-10 border border-error rounded-lg max-w-2xl mx-auto">
                <div className="flex items-center gap-2 justify-center">
                  <Icon name="AlertCircle" size={20} color="var(--color-error)" />
                  <p className="text-foreground font-medium">{error}</p>
                </div>
              </div>
            )}
            
            {!error && (
              <>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent bg-opacity-20 border border-accent border-opacity-30 rounded-full mb-4">
                  <Icon name="Sparkles" size={16} color="#000000" />
                  <span className="text-sm font-medium text-accent-foreground">Secure Wallet Setup</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  {currentStep === 0 && 'Create Your Wallet'}
                  {currentStep === 1 && selectedMethod === 'generate' && 'Your Seed Phrase'}
                  {currentStep === 1 && selectedMethod === 'import' && 'Import Your Wallet'}
                  {currentStep === 1 && selectedMethod === 'login' && 'Unlock Your Wallet'}
                  {currentStep === 2 && 'Verify Your Seed Phrase'}
                  {currentStep === 3 && 'Wallet Created Successfully!'}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {currentStep === 0 && 'Choose how you want to set up your Crowly wallet. Your keys are encrypted and stored securely on your device.'}
                  {currentStep === 1 && selectedMethod === 'generate' && 'Write down these 12 words in order. This is your seed phrase - the only way to recover your wallet.'}
                  {currentStep === 1 && selectedMethod === 'import' && 'Enter your existing wallet credentials to restore access to your funds.'}
                  {currentStep === 1 && selectedMethod === 'login' && 'Enter your password to access your existing wallet.'}
                  {currentStep === 2 && 'Confirm you have saved your seed phrase by selecting the correct words.'}
                  {currentStep === 3 && 'Your wallet has been created successfully. You can now start managing your crypto assets.'}
                </p>
              </>
            )}
          </div>

          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={steps?.length}
            steps={steps}
          />

          {currentStep === 0 && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <MethodSelectionCard
                  method="generate"
                  onSelect={handleMethodSelect}
                  isSelected={selectedMethod === 'generate'}
                />
                <MethodSelectionCard
                  method="import"
                  onSelect={handleMethodSelect}
                  isSelected={selectedMethod === 'import'}
                />
              </div>

              <SecurityBadges />

              <div className="flex justify-center">
                <Button
                  variant="default"
                  size="lg"
                  iconName="ArrowRight"
                  iconPosition="right"
                  onClick={handleContinueFromMethod}
                  disabled={!selectedMethod || loading}
                >
                  {loading ? 'Loading...' : `Continue with ${selectedMethod === 'generate' ? 'New Wallet' : 'Import'}`}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 1 && selectedMethod === 'generate' && (
            <div className="max-w-3xl mx-auto">
              {loading ? (
                <div className="glass-card text-center py-12">
                  <Icon name="Loader2" size={48} className="animate-spin text-accent mx-auto mb-4" />
                  <p className="text-muted-foreground">Generating your secure wallet...</p>
                </div>
              ) : (
                <SeedPhraseDisplay
                  seedPhrase={generatedSeedPhrase}
                  onContinue={handleContinueFromSeedPhrase}
                />
              )}
            </div>
          )}

          {currentStep === 1 && selectedMethod === 'import' && (
            <div className="max-w-2xl mx-auto">
              <ImportWalletForm 
                onImport={handleImportComplete}
                loading={loading}
              />
            </div>
          )}

          {currentStep === 1 && selectedMethod === 'login' && (
            <div className="max-w-2xl mx-auto">
              <LoginForm 
                onLogin={handleLogin}
                loading={loading}
                error={error}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="max-w-3xl mx-auto">
              <SeedPhraseVerification
                seedPhrase={generatedSeedPhrase}
                onVerified={handleVerificationComplete}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="max-w-2xl mx-auto">
              <div className="glass-card text-center">
                <div className="inline-flex p-6 rounded-full bg-success bg-opacity-20 mb-6">
                  <Icon name="CheckCircle2" size={64} color="var(--color-success)" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Wallet Created Successfully!
                </h2>
                <p className="text-muted-foreground mb-8">
                  Your wallet has been created and secured. You will be redirected to your dashboard shortly.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  <span>Redirecting to dashboard...</span>
                </div>
              </div>
            </div>
          )}

          {currentStep > 0 && currentStep < 3 && (
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                iconName="ArrowLeft"
                iconPosition="left"
                onClick={handleBack}
              >
                Back
              </Button>
            </div>
          )}
        </div>
      </main>
      <OrigamiCrowMascot tip={mascotTip} position="bottom-right" />
    </div>
  );
};

export default WalletCreation;