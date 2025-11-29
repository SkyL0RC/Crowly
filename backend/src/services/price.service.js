import axios from 'axios';

const PRICE_CACHE_TTL = 60000; // 60 seconds in ms
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// In-memory cache
const priceCache = new Map();

/**
 * Get token prices
 */
export async function getTokenPrices(symbols) {
  try {
    const prices = {};
    
    for (const symbol of symbols) {
      // Check cache first
      const cached = priceCache.get(symbol);
      
      if (cached && Date.now() - cached.timestamp < PRICE_CACHE_TTL) {
        prices[symbol] = { usd: cached.usd, change24h: cached.change24h };
      } else {
        // Fetch from external API
        const freshPrice = await fetchPriceFromApi(symbol);
        if (freshPrice) {
          prices[symbol] = freshPrice;
          priceCache.set(symbol, {
            ...freshPrice,
            timestamp: Date.now()
          });
        } else {
          prices[symbol] = { usd: 0, change24h: 0 };
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
