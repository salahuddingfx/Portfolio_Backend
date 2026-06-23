const store = new Map();

const getClientKey = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : req.ip || req.connection?.remoteAddress || 'unknown';
  return ip;
};

export const createRateLimiter = ({ windowMs = 600000, max = 20 } = {}) => {
  return (req, res, next) => {
    const key = `${getClientKey(req)}:${req.originalUrl}`;
    const now = Date.now();

    const entry = store.get(key);
    if (!entry || entry.resetAt <= now) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= max) {
      return res.status(429).json({ message: 'Too many requests, please try again later.' });
    }

    entry.count += 1;
    store.set(key, entry);
    return next();
  };
};
