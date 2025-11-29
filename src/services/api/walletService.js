import apiClient from './apiClient';

/**
 * Wallet Service
 * Cüzdan işlemleri için API servisleri
 */

/**
 * Yeni cüzdan oluştur
 * @param {Object} data - { method: 'generate'|'import', network: string, password: string, seedPhrase?: string }
 * @returns {Promise<Object>} Yeni cüzdan bilgileri
 */
export async function createWallet(data) {
  try {
    const response = await apiClient.post('/wallet/create', data);
    return response;
  } catch (error) {
    console.error('Create wallet error:', error);
    throw error;
  }
}

/**
 * Cüzdan bakiyesini getir
 * @param {string} address - Cüzdan adresi
 * @param {string} network - Network (ethereum, bsc, polygon, ton, tron)
 * @returns {Promise<Object>} Balance ve token bilgileri
 */
export async function getWalletBalance(address, network) {
  try {
    const response = await apiClient.get(`/wallet/${address}/balance`, {
      params: { network }
    });
    return response;
  } catch (error) {
    console.error('Get balance error:', error);
    throw error;
  }
}

/**
 * Cüzdan detaylarını getir
 * @param {string} address - Cüzdan adresi
 * @param {string} network - Network
 * @returns {Promise<Object>} Cüzdan detayları
 */
export async function getWalletDetails(address, network) {
  try {
    const response = await apiClient.get(`/wallet/${address}`, {
      params: { network }
    });
    return response;
  } catch (error) {
    console.error('Get wallet details error:', error);
    throw error;
  }
}

/**
 * Cüzdan import et
 * @param {Object} data - { seedPhrase: string, network: string, password: string }
 * @returns {Promise<Object>} Import edilen cüzdan bilgileri
 */
export async function importWallet(data) {
  try {
    const response = await apiClient.post('/wallet/import', data);
    return response;
  } catch (error) {
    console.error('Import wallet error:', error);
    throw error;
  }
}

/**
 * Private key export et (dikkatli kullan!)
 * @param {string} walletId - Cüzdan ID
 * @param {string} password - Cüzdan şifresi
 * @returns {Promise<Object>} Private key
 */
export async function exportWallet(walletId, password) {
  try {
    const response = await apiClient.post(`/wallet/${walletId}/export`, { password });
    return response;
  } catch (error) {
    console.error('Export wallet error:', error);
    throw error;
  }
}

/**
 * Cüzdan sil
 * @param {string} walletId - Cüzdan ID
 * @param {string} password - Cüzdan şifresi
 * @returns {Promise<Object>} Silme sonucu
 */
export async function deleteWallet(walletId, password) {
  try {
    const response = await apiClient.delete(`/wallet/${walletId}`, {
      data: { password }
    });
    return response;
  } catch (error) {
    console.error('Delete wallet error:', error);
    throw error;
  }
}

export default {
  createWallet,
  getWalletBalance,
  getWalletDetails,
  importWallet,
  exportWallet,
  deleteWallet,
};
