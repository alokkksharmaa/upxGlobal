'use strict';

const rateLimit = require('express-rate-limit');

const makeMessage = (action) => ({
  success: false,
  message: `Too many ${action} attempts. Please try again later.`,
});

// ── Auth endpoints (login / register) ─────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: makeMessage('authentication'),
  skipSuccessfulRequests: true,
});

// ── Enrollment creation ────────────────────────────────────────
const enrollmentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: makeMessage('enrollment'),
});

// ── Payment creation ──────────────────────────────────────────
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: makeMessage('payment'),
});

// ── Contact form ──────────────────────────────────────────────
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: makeMessage('contact form'),
});

module.exports = { authLimiter, enrollmentLimiter, paymentLimiter, contactLimiter };
