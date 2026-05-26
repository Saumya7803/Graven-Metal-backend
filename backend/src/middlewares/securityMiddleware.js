const DEFAULT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const DEFAULT_MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX || 300);
const AUTH_WINDOW_MS = Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const AUTH_MAX_REQUESTS = Number(process.env.AUTH_RATE_LIMIT_MAX || 10);

const WINDOW_CLEANUP_INTERVAL = 60 * 1000;

function createRateLimiter({ windowMs, max, keyPrefix }) {
  const hits = new Map();

  setInterval(() => {
    const now = Date.now();
    for (const [key, data] of hits.entries()) {
      if (data.expiresAt <= now) hits.delete(key);
    }
  }, WINDOW_CLEANUP_INTERVAL).unref();

  return (req, res, next) => {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();
    const current = hits.get(key);

    if (!current || current.expiresAt <= now) {
      hits.set(key, { count: 1, expiresAt: now + windowMs });
      return next();
    }

    if (current.count >= max) {
      const retryAfterSec = Math.ceil((current.expiresAt - now) / 1000);
      res.set('Retry-After', String(retryAfterSec));
      return res.status(429).json({ message: 'Too many requests. Please try again later.' });
    }

    current.count += 1;
    return next();
  };
}

function sanitizeObject(input) {
  if (Array.isArray(input)) return input.map(sanitizeObject);
  if (!input || typeof input !== 'object') {
    if (typeof input === 'string') return input.replace(/[<>]/g, '').trim();
    return input;
  }

  const clean = {};
  for (const [key, value] of Object.entries(input)) {
    const safeKey = key.replace(/\$/g, '').replace(/\./g, '');
    clean[safeKey] = sanitizeObject(value);
  }
  return clean;
}

export const apiRateLimit = createRateLimiter({
  windowMs: DEFAULT_WINDOW_MS,
  max: DEFAULT_MAX_REQUESTS,
  keyPrefix: 'api',
});

export const authRateLimit = createRateLimiter({
  windowMs: AUTH_WINDOW_MS,
  max: AUTH_MAX_REQUESTS,
  keyPrefix: 'auth',
});

export const sanitizeInput = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }

  next();
};
