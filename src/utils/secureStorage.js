/**
 * Secure Storage Utility
 * Web Crypto API kullanarak seed phrase'i güvenli şekilde saklar
 * WDK Security Best Practices'e uygun
 */

const STORAGE_KEY = 'crowdk_encrypted_wallet';
const ITERATIONS = 100000; // PBKDF2 iterations

/**
 * Şifreden encryption key türet (PBKDF2)
 */
async function deriveKey(password, salt) {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: 'SHA-256'
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Seed phrase'i şifrele ve localStorage'a kaydet
 * @param {string} seedPhrase - BIP-39 seed phrase (12 veya 24 kelime)
 * @param {string} password - Kullanıcı şifresi
 * @param {Object} metadata - Wallet metadata (address, network, vb.)
 */
export async function encryptAndStoreSeedPhrase(seedPhrase, password, metadata = {}) {
  try {
    // Random salt ve IV oluştur
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encryption key türet
    const key = await deriveKey(password, salt);

    // Seed phrase'i şifrele
    const encoder = new TextEncoder();
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encoder.encode(seedPhrase)
    );

    // Tüm verileri birleştir (salt + iv + encrypted)
    const encryptedData = {
      salt: Array.from(salt),
      iv: Array.from(iv),
      encrypted: Array.from(new Uint8Array(encrypted)),
      metadata: metadata,
      version: '1.0',
      timestamp: Date.now()
    };

    // LocalStorage'a kaydet
    localStorage.setItem(STORAGE_KEY, JSON.stringify(encryptedData));
    
    console.log('✅ Seed phrase encrypted and stored securely');
    return true;
  } catch (error) {
    console.error('❌ Encryption error:', error);
    throw new Error('Failed to encrypt seed phrase');
  }
}

/**
 * Şifreli seed phrase'i çöz
 * @param {string} password - Kullanıcı şifresi
 * @returns {Object} { seedPhrase, metadata }
 */
export async function decryptSeedPhrase(password) {
  try {
    console.log('🔐 Starting decryption process...');
    
    // LocalStorage'dan şifreli veriyi al
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      console.error('❌ No data found in localStorage with key:', STORAGE_KEY);
      throw new Error('No encrypted wallet found');
    }

    console.log('✅ Found encrypted data in localStorage');
    
    const encryptedData = JSON.parse(stored);
    console.log('📦 Encrypted data structure:', {
      hasSalt: !!encryptedData.salt,
      hasIv: !!encryptedData.iv,
      hasEncrypted: !!encryptedData.encrypted,
      hasMetadata: !!encryptedData.metadata,
      timestamp: encryptedData.timestamp
    });
    
    // Array'leri Uint8Array'e çevir
    const salt = new Uint8Array(encryptedData.salt);
    const iv = new Uint8Array(encryptedData.iv);
    const encrypted = new Uint8Array(encryptedData.encrypted);

    console.log('🔑 Deriving encryption key from password...');
    
    // Encryption key türet
    const key = await deriveKey(password, salt);

    console.log('🔓 Attempting to decrypt with derived key...');
    
    // Deşifre et
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encrypted
    );

    const decoder = new TextDecoder();
    const seedPhrase = decoder.decode(decrypted);

    console.log('✅ Seed phrase decrypted successfully');
    console.log('📝 Seed phrase length:', seedPhrase.length);
    
    return {
      seedPhrase,
      metadata: encryptedData.metadata,
      timestamp: encryptedData.timestamp
    };
  } catch (error) {
    console.error('❌ Decryption error:', error);
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    
    // Web Crypto API'den gelen hata tipine göre daha açıklayıcı mesaj
    if (error.name === 'OperationError' || error.message.includes('decrypt')) {
      throw new Error('Incorrect password');
    }
    
    throw new Error('Invalid password or corrupted data');
  }
}

/**
 * Wallet var mı kontrol et
 */
export function hasStoredWallet() {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

/**
 * Wallet'ı sil (Logout)
 */
export function clearStoredWallet() {
  localStorage.removeItem(STORAGE_KEY);
  console.log('🗑️ Wallet data cleared');
}

/**
 * Wallet metadata'sını al (şifre gerekmez)
 */
export function getWalletMetadata() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    return data.metadata || null;
  } catch (error) {
    console.error('Error reading wallet metadata:', error);
    return null;
  }
}

/**
 * Session için seed phrase cache (Memory only - never localStorage!)
 * Bu object sadece runtime'da var, page refresh'te silinir
 */
class SessionCache {
  constructor() {
    this.seedPhrase = null;
    this.expiresAt = null;
    this.SESSION_DURATION = 15 * 60 * 1000; // 15 dakika
  }

  set(seedPhrase) {
    this.seedPhrase = seedPhrase;
    this.expiresAt = Date.now() + this.SESSION_DURATION;
    console.log('🔒 Seed phrase cached for session (15 min)');
  }

  get() {
    if (!this.seedPhrase || Date.now() > this.expiresAt) {
      this.clear();
      return null;
    }
    return this.seedPhrase;
  }

  clear() {
    if (this.seedPhrase) {
      // Overwrite with zeros (security)
      this.seedPhrase = '0'.repeat(this.seedPhrase.length);
      this.seedPhrase = null;
    }
    this.expiresAt = null;
    console.log('🧹 Session cache cleared');
  }

  extend() {
    if (this.seedPhrase) {
      this.expiresAt = Date.now() + this.SESSION_DURATION;
      console.log('⏰ Session extended');
    }
  }
}

export const sessionCache = new SessionCache();

// Page unload olduğunda session cache'i temizle
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    sessionCache.clear();
  });
}

export default {
  encryptAndStoreSeedPhrase,
  decryptSeedPhrase,
  hasStoredWallet,
  clearStoredWallet,
  getWalletMetadata,
  sessionCache
};
