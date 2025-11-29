import { 
  generateMnemonic, 
  validateMnemonic,
  createWDKInstance,
  getAccount,
  getNetworkConfig 
} from '../config/wdk.config.js';
import { ValidationError } from '../middlewares/error.middleware.js';

/**
 * ⚠️ SECURITY NOTICE:
 * 
 * Bu servis ASLA seed phrase veya private key saklamaz!
 * Database kullanmıyoruz - tüm data frontend'de tutulur.
 * 
 * Backend sadece:
 * - Geçici olarak address generate eder
 * - WDK instance'ları dispose() ile temizler
 * 
 * WDK Best Practice: Seed phrases should NEVER be persisted!
 */

/**
 * Create a new wallet using WDK
 * 
 * ⚠️ SECURITY: Seed phrase ASLA saklanmaz!
 * Response'da seed phrase dönülür ama hiçbir yere yazılmaz.
 * Frontend bu seed phrase'i kullanıcı şifresi ile şifreler.
 */
export async function createWallet({ method, network, seedPhrase, privateKey }) {
  let wdk; // WDK instance tracking for cleanup
  
  try {
    const networkConfig = getNetworkConfig(network);
    if (!networkConfig) {
      throw new ValidationError(`Unsupported network: ${network}`);
    }

    let walletData;
    let mnemonic;

    if (method === 'generate') {
      // Generate new mnemonic using WDK
      mnemonic = generateMnemonic();
      
      // Create WDK instance with the mnemonic
      wdk = createWDKInstance(mnemonic);
      
      // Get account for the specified blockchain
      const account = await getAccount(wdk, network, 0);
      const address = await account.getAddress();
      
      walletData = {
        address: address,
        mnemonic: mnemonic,
        network: network,
      };
      
    } else if (method === 'import') {
      if (seedPhrase) {
        // Import from seed phrase
        if (!validateMnemonic(seedPhrase)) {
          throw new ValidationError('Invalid seed phrase');
        }
        
        mnemonic = seedPhrase;
        
        // Create WDK instance with imported mnemonic
        wdk = createWDKInstance(seedPhrase);
        
        // Get account for the specified blockchain
        const account = await getAccount(wdk, network, 0);
        const address = await account.getAddress();
        
        walletData = {
          address: address,
          mnemonic: seedPhrase,
          network: network,
        };
        
      } else if (privateKey) {
        throw new ValidationError('WDK does not support importing from private key directly. Please use seed phrase.');
      } else {
        throw new ValidationError('Seed phrase is required for import');
      }
    } else {
      throw new ValidationError(`Invalid method: ${method}`);
    }

    return {
      address: walletData.address,
      network,
      networkType: networkConfig.type,
      seedPhrase: walletData.mnemonic, // ⚠️ Response'da dön ama ASLA persist etme!
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Create wallet error:', error);
    throw error;
  } finally {
    // ✅ WDK Best Practice: Always dispose after use!
    if (wdk) {
      try {
        wdk.dispose();
      } catch (disposeError) {
        console.warn('WDK dispose warning:', disposeError);
      }
    }
  }
}

/**
 * Get wallet balance using WDK
 * 
 * ⚠️ SECURITY: Balance sorguları sadece public address ile yapılır.
 */
export async function getWalletBalance(address, network) {
  let wdk;
  
  try {
    const networkConfig = getNetworkConfig(network);
    if (!networkConfig) {
      throw new ValidationError(`Unsupported network: ${network}`);
    }

    // ⚠️ Balance sorgulama için seed phrase gerekli değil!
    // RPC provider üzerinden public address ile balance sorgulanır
    // TODO: WDK ile balance sorgusu implement edilecek
    // Şimdilik mock data dönüyoruz
    const balance = '0';
    const usdPrice = await getTokenPrice(networkConfig.symbol);
    const usdValue = parseFloat(balance) * usdPrice;

    return {
      address,
      network,
      balance: balance,
      usdValue,
      tokens: [],
    };
  } catch (error) {
    console.error('Get wallet balance error:', error);
    throw error;
  } finally {
    if (wdk) {
      try {
        wdk.dispose();
      } catch (disposeError) {
        console.warn('WDK dispose warning:', disposeError);
      }
    }
  }
}

/**
 * Helper: Get token price (mock for now)
 */
async function getTokenPrice(symbol) {
  // Mock prices - will be replaced with real price service
  const prices = {
    'ETH': 2000,
    'BNB': 300,
    'MATIC': 0.8,
    'TRX': 0.1,
    'TON': 2.5,
  };
  return prices[symbol] || 0;
}

/**
 * Import wallet
 * 
 * ⚠️ SECURITY: Database kullanmıyoruz!
 * Frontend seed phrase'i kendi şifresiyle şifreleyecek.
 */
export async function importWallet({ seedPhrase, network }) {
  return createWallet({ method: 'import', network, seedPhrase });
}

export default {
  createWallet,
  getWalletBalance,
  importWallet,
};
