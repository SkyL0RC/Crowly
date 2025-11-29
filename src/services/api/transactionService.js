import apiClient from './apiClient';

/**
 * Transaction Service
 * İşlem (transaction) işlemleri için API servisleri
 */

/**
 * Transaction gönder
 * @param {Object} data - Transaction bilgileri
 * @returns {Promise<Object>} Transaction sonucu
 */
export async function sendTransaction(data) {
  try {
    const response = await apiClient.post('/transaction/send', {
      from: data.from,
      to: data.to,
      amount: parseFloat(data.amount),
      token: data.token,
      network: data.network,
      feeSpeed: data.feeSpeed || 'standard',
      password: data.password,
      memo: data.memo || '',
    });
    return response;
  } catch (error) {
    console.error('Send transaction error:', error);
    throw error;
  }
}

/**
 * Transaction geçmişini getir
 * @param {string} address - Cüzdan adresi
 * @param {Object} params - Query parametreleri (network, type, limit, offset)
 * @returns {Promise<Object>} Transaction listesi
 */
export async function getTransactionHistory(address, params = {}) {
  try {
    const response = await apiClient.get(`/transaction/${address}/history`, {
      params: {
        network: params.network,
        type: params.type, // 'send', 'receive', 'swap'
        limit: params.limit || 20,
        offset: params.offset || 0,
      }
    });
    return response;
  } catch (error) {
    console.error('Get transaction history error:', error);
    throw error;
  }
}

/**
 * Transaction detaylarını getir
 * @param {string} txHash - Transaction hash
 * @returns {Promise<Object>} Transaction detayları
 */
export async function getTransactionDetails(txHash) {
  try {
    const response = await apiClient.get(`/transaction/${txHash}`);
    return response;
  } catch (error) {
    console.error('Get transaction details error:', error);
    throw error;
  }
}

export default {
  sendTransaction,
  getTransactionHistory,
  getTransactionDetails,
};
