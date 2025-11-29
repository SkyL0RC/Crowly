// Simple in-memory cache (Redis alternative for development)

const cache = new Map();

export const redisClient = {
  async get(key) {
    const item = cache.get(key);
    if (!item) return null;
    
    if (item.expiresAt && item.expiresAt < Date.now()) {
      cache.delete(key);
      return null;
    }
    
    return item.value;
  },

  async set(key, value, options = {}) {
    const expiresAt = options.EX ? Date.now() + (options.EX * 1000) : null;
    cache.set(key, { value, expiresAt });
    return 'OK';
  },

  async del(key) {
    cache.delete(key);
    return 1;
  },

  async exists(key) {
    return cache.has(key) ? 1 : 0;
  },

  async keys(pattern) {
    // Simple pattern matching for wildcards
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return Array.from(cache.keys()).filter(key => regex.test(key));
  },

  async flushAll() {
    cache.clear();
    return 'OK';
  },

  // Mock connection methods
  on() {},
  connect() { return Promise.resolve(); },
  quit() { return Promise.resolve(); },
  disconnect() {},
};

// Periodic cleanup of expired items
setInterval(() => {
  const now = Date.now();
  for (const [key, item] of cache.entries()) {
    if (item.expiresAt && item.expiresAt < now) {
      cache.delete(key);
    }
  }
}, 60000); // Run every minute

console.log('💾 Using in-memory cache (Redis alternative)');
