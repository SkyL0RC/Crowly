import apiClient from './apiClient';

/**
 * Network Service
 * Blockchain network durumu için API servisleri
 */

/**
 * Tüm network'lerin durumunu getir
 * @returns {Promise<Object>} Tüm network'lerin status bilgileri
 */
export async function getNetworkStatus() {
  try {
    const response = await apiClient.get('/network/status');
    return response;
  } catch (error) {
    console.error('Get network status error:', error);
    throw error;
  }
}

/**
 * Belirli bir network'ün durumunu getir
 * @param {string} networkId - Network ID (ethereum, bsc, polygon, ton, tron)
 * @returns {Promise<Object>} Network status
 */
export async function getNetworkStatusById(networkId) {
  try {
    const response = await apiClient.get(`/network/status/${networkId}`);
    return response;
  } catch (error) {
    console.error('Get network status by ID error:', error);
    throw error;
  }
}

/**
 * Desteklenen network'leri getir
 * @returns {Promise<Object>} Desteklenen network listesi
 */
export async function getSupportedNetworks() {
  try {
    const response = await apiClient.get('/network/supported');
    return response;
  } catch (error) {
    console.error('Get supported networks error:', error);
    throw error;
  }
}

/**
 * Network tıkanıklığını kontrol et
 * @param {string} networkId - Network ID
 * @returns {Promise<Object>} Tıkanıklık durumu
 */
export async function checkNetworkCongestion(networkId) {
  try {
    const response = await apiClient.get(`/network/${networkId}/congestion`);
    return response;
  } catch (error) {
    console.error('Check network congestion error:', error);
    throw error;
  }
}

export default {
  getNetworkStatus,
  getNetworkStatusById,
  getSupportedNetworks,
  checkNetworkCongestion,
};
