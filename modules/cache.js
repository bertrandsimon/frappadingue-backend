const NodeCache = require("node-cache");

// Create cache instance with 5 minute default TTL
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// Middleware to cache GET requests
const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to cache response
    res.json = function (body) {
      cache.set(key, body, duration);
      return originalJson(body);
    };

    next();
  };
};

// Function to clear cache for a specific pattern
const clearCache = (pattern) => {
  const keys = cache.keys();
  keys.forEach((key) => {
    if (key.includes(pattern)) {
      cache.del(key);
    }
  });
};

// Clear all cache
const clearAllCache = () => {
  cache.flushAll();
};

module.exports = { cacheMiddleware, clearCache, clearAllCache, cache };

