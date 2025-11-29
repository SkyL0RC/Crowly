import axios from 'axios';
import { query } from '../database/connection.js';
import { getCache, setCache } from '../utils/redis.js';

const PRICE_CACHE_TTL = 60; // 60 seconds
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

/**
 * Get token prices
 */
export async function getTokenPrices(symbols) {
  try {
    const prices = {};
    
    for (const symbol of symbols) {
      // Check cache first
      const cacheKey = `price:${symbol}`;
      const cached = await getCache(cacheKey);
      
      if (cached) {
        prices[symbol] = cached;
      } else {
        // Fetch from database cache
        const dbPrice = await getPriceFromDb(symbol);
        
        if (dbPrice && isRecentPrice(dbPrice.last_updated)) {
          const priceData = {
            usd: parseFloat(dbPrice.usd_price),
            change24h: parseFloat(dbPrice.change_24h),
          };
          prices[symbol] = priceData;
          await setCache(cacheKey, priceData, PRICE_CACHE_TTL);
        } else {
          // Fetch from external API
          const freshPrice = await fetchPriceFromApi(symbol);
          if (freshPrice) {
            prices[symbol] = freshPrice;
            await savePriceToDb(symbol, freshPrice);
            await setCache(cacheKey, freshPrice, PRICE_CACHE_TTL);
          } else {
            prices[symbol] = { usd: 0, change24h: 0 };
          }
        }
      }
    }

    return {
      prices,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Get token prices error:', error);
    throw error;
  }
}

/**
 * Fetch price from CoinGecko API
 */
async function fetchPriceFromApi(symbol) {
  try {
    // Map symbols to CoinGecko IDs
    const coinIds = {
      ETH: 'ethereum',
      BTC: 'bitcoin',
      BNB: 'binancecoin',
      MATIC: 'matic-network',
      TON: 'the-open-network',
      TRX: 'tron',
      SOL: 'solana',
      USDT: 'tether',
      USDC: 'usd-coin',
      DAI: 'dai',
      BUSD: 'binance-usd',
    };

    const coinId = coinIds[symbol.toUpperCase()];
    if (!coinId) {
      console.warn(`Unknown symbol: ${symbol}`);
      return null;
    }

    const response = await axios.get(`${COINGECKO_API}/simple/price`, {
      params: {
        ids: coinId,
        vs_currencies: 'usd',
        include_24hr_change: true,
      },
      headers: process.env.COINGECKO_API_KEY ? {
        'x-cg-pro-api-key': process.env.COINGECKO_API_KEY,
      } : {},
    });

    const data = response.data[coinId];
    if (!data) {
      return null;
    }

    return {
      usd: data.usd,
      change24h: data.usd_24h_change || 0,
    };
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error.message);
    return null;
  }
}

/**
 * Get price from database cache
 */
async function getPriceFromDb(symbol) {
  try {
    const result = await query(
      'SELECT * FROM price_cache WHERE symbol = $1',
      [symbol.toUpperCase()]
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error('Get price from DB error:', error);
    return null;
  }
}

/**
 * Save price to database cache
 */
async function savePriceToDb(symbol, priceData) {
  try {
    await query(
      `INSERT INTO price_cache (symbol, usd_price, change_24h, last_updated)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (symbol)
       DO UPDATE SET
         usd_price = $2,
         change_24h = $3,
         last_updated = NOW()`,
      [symbol.toUpperCase(), priceData.usd, priceData.change24h]
    );
  } catch (error) {
    console.error('Save price to DB error:', error);
  }
}

/**
 * Check if price is recent (within 5 minutes)
 */
function isRecentPrice(lastUpdated) {
  if (!lastUpdated) return false;
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return new Date(lastUpdated) > fiveMinutesAgo;
}

/**
 * Get price for a single token
 */
export async function getTokenPrice(symbol) {
  try {
    const result = await getTokenPrices([symbol]);
    return {
      symbol,
      ...result.prices[symbol],
      timestamp: result.timestamp,
    };
  } catch (error) {
    console.error('Get token price error:', error);
    throw error;
  }
}

/**
 * Get market data for tokens
 */
export async function getMarketData(symbols) {
  try {
    const coinIds = symbols.map(symbol => {
      const mapping = {
        ETH: 'ethereum',
        BTC: 'bitcoin',
        BNB: 'binancecoin',
        MATIC: 'matic-network',
        TON: 'the-open-network',
        TRX: 'tron',
        SOL: 'solana',
        USDT: 'tether',
        USDC: 'usd-coin',
      };
      return mapping[symbol.toUpperCase()];
    }).filter(Boolean);

    const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        ids: coinIds.join(','),
        order: 'market_cap_desc',
        sparkline: false,
      },
      headers: process.env.COINGECKO_API_KEY ? {
        'x-cg-pro-api-key': process.env.COINGECKO_API_KEY,
      } : {},
    });

    return {
      data: response.data.map(coin => ({
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        marketCap: coin.market_cap,
        volume24h: coin.total_volume,
        change24h: coin.price_change_percentage_24h,
        image: coin.image,
      })),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Get market data error:', error);
    throw error;
  }
}

/**
 * Update all prices (cron job)
 */
export async function updateAllPrices() {
  const commonSymbols = ['ETH', 'BTC', 'BNB', 'MATIC', 'TON', 'TRX', 'SOL', 'USDT', 'USDC'];
  
  try {
    console.log('Updating prices for all tokens...');
    await getTokenPrices(commonSymbols);
    console.log('✓ Prices updated successfully');
  } catch (error) {
    console.error('Failed to update prices:', error);
  }
}

export default {
  getTokenPrices,
  getTokenPrice,
  getMarketData,
  updateAllPrices,
};
