import apiClient from './apiClient';

/**
 * Gas Service
 * Gas fee tahminleri için API servisleri
 */

/**
 * Gas fee tahmini getir
 * @param {string} network - Network adı (ethereum, bsc, polygon, ton, tron)
 * @param {string} transactionType - Transaction tipi ('transfer', 'token', 'contract', 'swap')
 * @returns {Promise<Object>} Gas fee tahminleri (slow, standard, fast)
 */
export async function getGasEstimate(network, transactionType = 'transfer') {
  try {
    const response = await apiClient.get('/gas/estimate', {
      params: { network, transactionType }
    });
    return response;
  } catch (error) {
    console.error('Get gas estimate error:', error);
    throw error;
  }
}

/**
 * Gas fiyat geçmişini getir
 * @param {string} network - Network adı
 * @param {number} hours - Kaç saatlik geçmiş (default: 24)
 * @returns {Promise<Object>} Geçmiş gas fiyatları
 */
export async function getGasHistory(network, hours = 24) {
  try {
    const response = await apiClient.get(`/gas/history/${network}`, {
      params: { hours }
    });
    return response;
  } catch (error) {
    console.error('Get gas history error:', error);
    throw error;
  }
}

export default {
  getGasEstimate,
  getGasHistory,
};
