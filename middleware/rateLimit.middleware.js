import rateLimit from 'express-rate-limit';

// General API limiter: 100 requests per 15 minutes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

// Contact form limiter: 5 requests per 10 minutes (prevents email spamming)
export const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many messages sent. Please wait a few minutes before trying again.'
  }
});

// Testimonial submission limiter: 5 submissions per 15 minutes per client
export const reviewSubmitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many review submissions from this IP. Please try again later.'
  }
});

// Admin Authentication limiter: 5 login/forgot-password attempts per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many login attempts. Please try again after 15 minutes.'
  }
});
