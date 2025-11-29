import { query } from '../database/connection.js';
import { 
  generateMnemonic, 
  validateMnemonic,
  createWDKInstance,
  getAccount,
  getNetworkConfig 
} from '../config/wdk.config.js';
import { NotFoundError, ValidationError } from '../middlewares/error.middleware.js';

/**
 * ⚠️ SECURITY NOTICE:
 * 
 * Bu servis ASLA seed phrase veya private key saklamaz!
 * Tüm sensitive data frontend'de Web Crypto API ile şifrelenir.
 * 
 * Backend sadece:
 * - Public address saklar
 * - Geçici olarak address generate eder
 * - WDK instance'ları dispose() ile temizler
 * 
 * WDK Best Practice: Seed phrases should NEVER be persisted!
 */

/**
 * Create a new wallet using WDK
 * 
 * ⚠️ SECURITY: Seed phrase ASLA saklanmaz!
 * Response'da seed phrase dönülür ama database'e yazılmaz.
 * Frontend bu seed phrase'i kullanıcı şifresi ile şifreler.
 */
export async function createWallet({ method, network, seedPhrase, privateKey, userId }) {
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

    // ✅ Save to database - SADECE public address!
    // ❌ encrypted_private_key artık saklanmıyor!
    
    // Önce aynı wallet zaten var mı kontrol et
    const existingWallet = await query(
      `SELECT id, address, network FROM wallets WHERE address = $1 AND network = $2`,
      [walletData.address, network]
    );
    
    let savedWallet;
    
    if (existingWallet.rows.length > 0) {
      // Wallet zaten var, mevcut kaydı kullan
      savedWallet = existingWallet.rows[0];
    } else {
      // Yeni wallet oluştur
      const result = await query(
        `INSERT INTO wallets (user_id, address, network, network_type)
         VALUES ($1, $2, $3, $4)
         RETURNING id, address, network, created_at`,
        [userId || null, walletData.address, network, networkConfig.type]
      );
      savedWallet = result.rows[0];
    }

    return {
      id: savedWallet.id,
      address: savedWallet.address,
      network,
      networkType: networkConfig.type,
      seedPhrase: walletData.mnemonic, // ⚠️ Response'da dön ama ASLA persist etme!
      createdAt: savedWallet.created_at,
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
 * ⚠️ SECURITY: Artık encrypted_private_key yok!
 * Balance sorguları sadece public address ile yapılır.
 */
export async function getWalletBalance(address, network) {
  let wdk;
  
  try {
    const networkConfig = getNetworkConfig(network);
    if (!networkConfig) {
      throw new ValidationError(`Unsupported network: ${network}`);
    }

    // Wallet'ın database'de olduğunu kontrol et
    const walletResult = await query(
      `SELECT id, address, network FROM wallets WHERE address = $1 AND network = $2`,
      [address, network]
    );

    if (walletResult.rows.length === 0) {
      throw new NotFoundError('Wallet not found');
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
 * Get wallet by address
 */
export async function getWalletByAddress(address, network) {
  try {
    const result = await query(
      `SELECT id, user_id, address, network, network_type, public_key, created_at
       FROM wallets
       WHERE address = $1 AND network = $2`,
      [address, network]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Wallet not found');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Get wallet error:', error);
    throw error;
  }
}

/**
 * Get all wallets for a user
 */
export async function getUserWallets(userId) {
  try {
    const result = await query(
      `SELECT id, address, network, network_type, public_key, created_at
       FROM wallets
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    return result.rows;
  } catch (error) {
    console.error('Get user wallets error:', error);
    throw error;
  }
}

/**
 * Import wallet
 * 
 * ⚠️ SECURITY: Password parametresi artık kullanılmıyor!
 * Backward compatibility için kabul ediyoruz ama ignore ediyoruz.
 * Frontend seed phrase'i kendi şifresiyle şifreleyecek.
 */
export async function importWallet({ seedPhrase, network, userId }) {
  return createWallet({ method: 'import', network, seedPhrase, userId });
}

/**
 * ❌ REMOVED: exportWallet
 * 
 * Backend artık seed phrase saklamıyor!
 * Kullanıcı seed phrase'ini zaten kendi localStorage'ında tutuyor (şifreli).
 * Export gerekirse frontend'den yapılabilir.
 */

/**
 * ❌ REMOVED: getMnemonicForSigning
 * 
 * Backend artık seed phrase saklamıyor!
 * Signing işlemleri frontend'de yapılmalı:
 * 
 * Frontend'de:
 * 1. const { seedPhrase } = await decryptSeedPhrase(password);
 * 2. const wdk = createWDKInstance(seedPhrase);
 * 3. const account = await wdk.getAccount('ethereum', 0);
 * 4. const tx = await account.sendTransaction({...});
 * 5. wdk.dispose();
 * 6. Backend'e sadece signed transaction gönder
 */

/**
 * Delete wallet
 * 
 * ⚠️ SECURITY: Password verification kaldırıldı
 * Backend'de artık seed phrase olmadığı için verify edemeyiz.
 * Frontend'de kullanıcıdan onay alınmalı.
 */
export async function deleteWallet(walletId) {
  try {
    // Delete wallet from database
    await query('DELETE FROM wallets WHERE id = $1', [walletId]);
    
    return { success: true };
  } catch (error) {
    console.error('Delete wallet error:', error);
    throw error;
  }
}

export default {
  createWallet,
  getWalletBalance,
  getWalletByAddress,
  getUserWallets,
  importWallet,
  deleteWallet,
};
