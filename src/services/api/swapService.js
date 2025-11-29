import apiClient from './apiClient';

/**
 * Swap Service
 * Token swap işlemleri için API servisleri
 */

/**
 * Swap fiyat teklifi al
 * @param {Object} params - Swap parametreleri
 * @returns {Promise<Object>} Swap fiyat teklifi
 */
export async function getSwapQuote(params) {
  try {
    const response = await apiClient.post('/swap/quote', {
      fromToken: params.fromToken,
      toToken: params.toToken,
      amount: parseFloat(params.amount),
      network: params.network,
      slippage: params.slippage || 0.5,
    });
    return response;
  } catch (error) {
    console.error('Get swap quote error:', error);
    throw error;
  }
}

/**
 * Token swap işlemi gerçekleştir
 * @param {Object} data - Swap verileri
 * @returns {Promise<Object>} Swap sonucu
 */
export async function executeSwap(data) {
  try {
    const response = await apiClient.post('/swap/execute', {
      fromToken: data.fromToken,
      toToken: data.toToken,
      amount: parseFloat(data.amount),
      minReceived: parseFloat(data.minReceived),
      network: data.network,
      slippage: data.slippage,
      walletAddress: data.walletAddress,
      password: data.password,
    });
    return response;
  } catch (error) {
    console.error('Execute swap error:', error);
    throw error;
  }
}

/**
 * Swap geçmişini getir
 * @param {string} address - Cüzdan adresi
 * @param {Object} params - Query parametreleri
 * @returns {Promise<Object>} Swap geçmişi
 */
export async function getSwapHistory(address, params = {}) {
  try {
    const response = await apiClient.get(`/swap/${address}/history`, {
      params: {
        network: params.network,
        limit: params.limit || 20,
        offset: params.offset || 0,
      }
    });
    return response;
  } catch (error) {
    console.error('Get swap history error:', error);
    throw error;
  }
}

/**
 * Desteklenen swap pair'lerini getir
 * @param {string} network - Network adı
 * @returns {Promise<Object>} Swap pair listesi
 */
export async function getSupportedPairs(network) {
  try {
    const response = await apiClient.get(`/swap/pairs/${network}`);
    return response;
  } catch (error) {
    console.error('Get supported pairs error:', error);
    throw error;
  }
}

export default {
  getSwapQuote,
  executeSwap,
  getSwapHistory,
  getSupportedPairs,
};
