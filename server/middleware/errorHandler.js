'use strict';

const logger = require('../config/logger');

// ── Centralised Error Handler ──────────────────────────────────
const errorHandler = (err, req, res, _next) => {
  // Log error details server-side
  logger.error(`${req.method} ${req.originalUrl} — ${err.message}`, {
    stack: err.stack,
    status: err.statusCode || 500,
    user: req.user?.uid || 'unauthenticated',
  });

  // Operational (expected) errors
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
  }

  // Firebase errors
  if (err.code && err.code.startsWith('auth/')) {
    return res.status(401).json({ success: false, message: err.message });
  }

  // JWT errors (should be caught in middleware, but fallback)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }

  // Validation errors (Joi)
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.details?.map((d) => ({ field: d.context?.key, message: d.message })),
    });
  }

  // Unknown / programming errors — don't leak internals in production
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Something went wrong. Please try again later.'
    : err.message;

  res.status(statusCode).json({ success: false, message });
};

// ── Custom Operational Error Class ────────────────────────────
class AppError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { errorHandler, AppError };
