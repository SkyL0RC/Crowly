import apiClient from './apiClient';

/**
 * Price Service
 * Token fiyatları için API servisleri
 */

/**
 * Token fiyatlarını getir
 * @param {Array<string>} symbols - Token sembolleri ['ETH', 'BTC', 'BNB']
 * @returns {Promise<Object>} Token fiyatları
 */
export async function getTokenPrices(symbols) {
  try {
    const symbolString = Array.isArray(symbols) ? symbols.join(',') : symbols;
    const response = await apiClient.get('/prices', {
      params: { symbols: symbolString }
    });
    return response;
  } catch (error) {
    console.error('Get token prices error:', error);
    throw error;
  }
}

/**
 * Tek token fiyatı getir
 * @param {string} symbol - Token sembolü (ETH, BTC, BNB, vb.)
 * @returns {Promise<Object>} Token fiyatı ve değişim
 */
export async function getTokenPrice(symbol) {
  try {
    const response = await apiClient.get(`/prices/${symbol}`);
    return response;
  } catch (error) {
    console.error('Get token price error:', error);
    throw error;
  }
}

/**
 * Market verilerini getir (fiyat, market cap, volume vb.)
 * @param {Array<string>} symbols - Token sembolleri
 * @returns {Promise<Object>} Detaylı market verileri
 */
export async function getMarketData(symbols) {
  try {
    const symbolString = Array.isArray(symbols) ? symbols.join(',') : symbols;
    const response = await apiClient.get('/prices/market/data', {
      params: { symbols: symbolString }
    });
    return response;
  } catch (error) {
    console.error('Get market data error:', error);
    throw error;
  }
}

export default {
  getTokenPrices,
  getTokenPrice,
  getMarketData,
};
