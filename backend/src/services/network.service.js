import { supportedNetworks, getWalletByNetwork } from '../config/wdk.config.js';
import { getCache, setCache } from '../utils/redis.js';

const NETWORK_STATUS_CACHE_TTL = 30; // 30 seconds

/**
 * Get status of all supported networks
 */
export async function getNetworkStatus() {
  try {
    // Check cache
    const cacheKey = 'network:status:all';
    const cached = await getCache(cacheKey);
    if (cached) {
      return cached;
    }

    const statusPromises = supportedNetworks.map(async (network) => {
      try {
        const status = await checkNetworkHealth(network);
        return {
          ...network,
          ...status,
        };
      } catch (error) {
        console.error(`Error checking ${network.name} status:`, error);
        return {
          ...network,
          status: 'unknown',
          blockHeight: 0,
          avgBlockTime: 0,
          gasPrice: 0,
        };
      }
    });

    const networks = await Promise.all(statusPromises);
    
    const result = {
      networks,
      timestamp: new Date().toISOString(),
    };

    // Cache the result
    await setCache(cacheKey, result, NETWORK_STATUS_CACHE_TTL);

    return result;
  } catch (error) {
    console.error('Get network status error:', error);
    throw error;
  }
}

/**
 * Get status of a specific network
 */
export async function getNetworkStatusById(networkId) {
  try {
    const cacheKey = `network:status:${networkId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return cached;
    }

    const network = supportedNetworks.find(n => n.id === networkId);
    if (!network) {
      throw new Error(`Network not found: ${networkId}`);
    }

    const status = await checkNetworkHealth(network);
    const result = {
      ...network,
      ...status,
      timestamp: new Date().toISOString(),
    };

    await setCache(cacheKey, result, NETWORK_STATUS_CACHE_TTL);

    return result;
  } catch (error) {
    console.error('Get network status by ID error:', error);
    throw error;
  }
}

/**
 * Check health of a specific network
 */
async function checkNetworkHealth(network) {
  try {
    const wallet = getWalletByNetwork(network.type);
    
    // Get block height
    let blockHeight = 0;
    try {
      blockHeight = await wallet.getBlockNumber();
    } catch (error) {
      console.warn(`Failed to get block number for ${network.name}`);
    }

    // Get gas price
    let gasPrice = 0;
    try {
      gasPrice = await wallet.getGasPrice();
    } catch (error) {
      console.warn(`Failed to get gas price for ${network.name}`);
    }

    // Determine network status based on response times
    const status = blockHeight > 0 ? 'healthy' : 'down';

    // Average block time by network
    const avgBlockTimes = {
      ethereum: 12,
      bsc: 3,
      polygon: 2,
      ton: 5,
      tron: 3,
    };

    return {
      status,
      blockHeight,
      avgBlockTime: avgBlockTimes[network.id] || 0,
      gasPrice,
    };
  } catch (error) {
    console.error(`Network health check failed for ${network.name}:`, error);
    return {
      status: 'down',
      blockHeight: 0,
      avgBlockTime: 0,
      gasPrice: 0,
    };
  }
}

/**
 * Get supported networks list
 */
export function getSupportedNetworks() {
  return {
    networks: supportedNetworks.map(network => ({
      id: network.id,
      name: network.name,
      symbol: network.symbol,
      type: network.type,
      chainId: network.chainId,
      decimals: network.decimals,
      icon: network.icon,
      color: network.color,
      explorer: network.explorer,
    })),
    total: supportedNetworks.length,
  };
}

/**
 * Check if network is congested
 */
export async function isNetworkCongested(networkId) {
  try {
    const status = await getNetworkStatusById(networkId);
    
    // Simple congestion check based on gas price
    const congestionThresholds = {
      ethereum: 100000000000, // 100 gwei
      bsc: 10000000000, // 10 gwei
      polygon: 100000000000, // 100 gwei
      ton: 5000000,
      tron: 1000000,
    };

    const threshold = congestionThresholds[networkId] || 50000000000;
    return status.gasPrice > threshold;
  } catch (error) {
    console.error('Check network congestion error:', error);
    return false;
  }
}

export default {
  getNetworkStatus,
  getNetworkStatusById,
  getSupportedNetworks,
  isNetworkCongested,
};
