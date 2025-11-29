import dotenv from 'dotenv';

dotenv.config();

let redisClient;
let isRedisAvailable = false;

// Try to connect to Redis if configured
if (process.env.REDIS_HOST) {
  try {
    const { createClient } = await import('redis');
    
    redisClient = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT || 6379}`,
      password: process.env.REDIS_PASSWORD || undefined,
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
      isRedisAvailable = false;
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis client connected');
      isRedisAvailable = true;
    });

    await redisClient.connect();
  } catch (error) {
    console.warn('⚠️  Redis not available, using in-memory cache');
    const memCache = await import('./memoryCache.js');
    redisClient = memCache.redisClient;
    isRedisAvailable = false;
  }
} else {
  // Use in-memory cache if Redis not configured
  console.log('ℹ️  Redis not configured, using in-memory cache');
  const memCache = await import('./memoryCache.js');
  redisClient = memCache.redisClient;
  isRedisAvailable = false;
}

/**
 * Connect to Redis
 */
export async function connectRedis() {
  if (isRedisAvailable && !redisClient.isOpen) {
    await redisClient.connect();
  }
  return redisClient;
}

/**
 * Get value from cache
 */
export async function getCache(key) {
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

/**
 * Set value in cache with expiration
 */
export async function setCache(key, value, expirationInSeconds = 60) {
  try {
    await redisClient.setEx(key, expirationInSeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Redis set error:', error);
    return false;
  }
}

/**
 * Delete value from cache
 */
export async function deleteCache(key) {
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Redis delete error:', error);
    return false;
  }
}

/**
 * Check if key exists
 */
export async function existsCache(key) {
  try {
    const exists = await redisClient.exists(key);
    return exists === 1;
  } catch (error) {
    console.error('Redis exists error:', error);
    return false;
  }
}

/**
 * Get all keys matching pattern
 */
export async function getKeys(pattern) {
  try {
    return await redisClient.keys(pattern);
  } catch (error) {
    console.error('Redis keys error:', error);
    return [];
  }
}

/**
 * Clear all cache
 */
export async function clearCache() {
  try {
    await redisClient.flushAll();
    return true;
  } catch (error) {
    console.error('Redis flush error:', error);
    return false;
  }
}

/**
 * Disconnect from Redis
 */
export async function disconnectRedis() {
  if (isRedisAvailable && redisClient.isOpen) {
    await redisClient.quit();
  }
}

export { redisClient };
export default {
  connectRedis,
  getCache,
  setCache,
  deleteCache,
  existsCache,
  getKeys,
  clearCache,
  disconnectRedis,
};
