import { getWalletByNetwork, getNetworkConfig } from '../config/wdk.config.js';
import { getCache, setCache } from '../utils/redis.js';
import { ValidationError } from '../middlewares/error.middleware.js';

const GAS_CACHE_TTL = 10; // 10 seconds

/**
 * Get gas fee estimates for a network
 */
export async function getGasEstimate(network, transactionType = 'transfer') {
  try {
    // Check cache first
    const cacheKey = `gas:${network}:${transactionType}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return cached;
    }

    const networkConfig = getNetworkConfig(network);
    if (!networkConfig) {
      throw new ValidationError(`Unsupported network: ${network}`);
    }

    const wallet = getWalletByNetwork(networkConfig.type);
    
    // Get base gas price
    let baseGasPrice;
    try {
      baseGasPrice = await wallet.getGasPrice();
    } catch (error) {
      console.warn('Failed to get gas price, using default:', error);
      baseGasPrice = getDefaultGasPrice(network);
    }

    // Estimate gas limit based on transaction type
    const gasLimit = estimateGasLimit(transactionType, networkConfig.type);

    // Calculate fees for different speeds
    const estimates = {
      network,
      transactionType,
      slow: calculateFeeEstimate(baseGasPrice, gasLimit, 0.8, networkConfig),
      standard: calculateFeeEstimate(baseGasPrice, gasLimit, 1.0, networkConfig),
      fast: calculateFeeEstimate(baseGasPrice, gasLimit, 1.3, networkConfig),
      timestamp: new Date().toISOString(),
    };

    // Cache the result
    await setCache(cacheKey, estimates, GAS_CACHE_TTL);

    return estimates;
  } catch (error) {
    console.error('Get gas estimate error:', error);
    throw error;
  }
}

/**
 * Calculate fee estimate with multiplier
 */
function calculateFeeEstimate(baseGasPrice, gasLimit, multiplier, networkConfig) {
  const adjustedGasPrice = Math.floor(baseGasPrice * multiplier);
  
  let cost, estimatedTime;
  
  if (networkConfig.type === 'evm') {
    // EVM networks (Ethereum, BSC, Polygon)
    const costInWei = adjustedGasPrice * gasLimit;
    cost = costInWei / 1e18; // Convert to native token
    
    // Estimate confirmation time based on speed
    estimatedTime = multiplier === 0.8 ? 180 : multiplier === 1.0 ? 60 : 30; // seconds
  } else if (networkConfig.type === 'tron') {
    // TRON network
    cost = (adjustedGasPrice * gasLimit) / 1e6; // TRX
    estimatedTime = multiplier === 0.8 ? 9 : multiplier === 1.0 ? 3 : 1; // seconds
  } else if (networkConfig.type === 'ton') {
    // TON network
    cost = adjustedGasPrice / 1e9; // TON
    estimatedTime = multiplier === 0.8 ? 15 : multiplier === 1.0 ? 5 : 2; // seconds
  } else {
    cost = 0.001;
    estimatedTime = 60;
  }

  return {
    gasPrice: adjustedGasPrice,
    gasLimit,
    estimatedTime,
    cost: parseFloat(cost.toFixed(8)),
    costUSD: 0, // Will be calculated with price service
  };
}

/**
 * Estimate gas limit based on transaction type
 */
function estimateGasLimit(transactionType, networkType) {
  const limits = {
    evm: {
      transfer: 21000,
      token: 65000,
      contract: 100000,
      swap: 150000,
    },
    tron: {
      transfer: 10000,
      token: 15000,
      contract: 50000,
      swap: 100000,
    },
    ton: {
      transfer: 1000,
      token: 2000,
      contract: 5000,
      swap: 10000,
    },
  };

  return limits[networkType]?.[transactionType] || limits[networkType]?.transfer || 21000;
}

/**
 * Get default gas price if API call fails
 */
function getDefaultGasPrice(network) {
  const defaults = {
    ethereum: 30000000000, // 30 gwei
    bsc: 5000000000, // 5 gwei
    polygon: 50000000000, // 50 gwei
    tron: 420000, // 420 sun
    ton: 1000000, // 0.001 TON
  };

  return defaults[network] || 20000000000;
}

/**
 * Get historical gas prices
 */
export async function getGasHistory(network, hours = 24) {
  try {
    // This would typically fetch from a database or external API
    // For now, return mock data structure
    const now = Date.now();
    const interval = (hours * 60 * 60 * 1000) / 24; // 24 data points
    
    const history = [];
    for (let i = 0; i < 24; i++) {
      history.push({
        timestamp: new Date(now - (i * interval)),
        gasPrice: getDefaultGasPrice(network) * (0.8 + Math.random() * 0.4),
      });
    }

    return {
      network,
      hours,
      data: history.reverse(),
    };
  } catch (error) {
    console.error('Get gas history error:', error);
    throw error;
  }
}

export default {
  getGasEstimate,
  getGasHistory,
};
