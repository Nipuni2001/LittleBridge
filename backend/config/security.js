let rateLimit;
try {
  rateLimit = require('express-rate-limit');
} catch {
  // If express-rate-limit is not installed, use no-op middleware
  const noOp = (req, res, next) => next();
  module.exports = {
    generalLimiter: noOp,
    authLimiter:    noOp,
    uploadLimiter:  noOp,
  };
  return;
}

// General API limiter — 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'development', // disable in dev
});

// Auth limiter — 20 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts. Please wait 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'development', // disable in dev
});

// Upload limiter — 30 uploads per hour
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many uploads. Please try again later.' },
  skip: () => process.env.NODE_ENV === 'development',
});

module.exports = { generalLimiter, authLimiter, uploadLimiter };
