'use strict';

require('dotenv').config();

const express       = require('express');
const helmet        = require('helmet');
const cors          = require('cors');
const compression   = require('compression');
const rateLimit     = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss           = require('xss-clean');
const path          = require('path');

const logger           = require('./config/logger');
const { errorHandler } = require('./middleware/errorHandler');

// ── Route Imports ──────────────────────────────────────────────
const authRoutes       = require('./routes/auth');
const courseRoutes     = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const paymentRoutes    = require('./routes/payments');
const adminRoutes      = require('./routes/admin');
const webhookRoutes    = require('./routes/webhooks');

const app = express();

// ── Trust proxy (for rate-limiting behind reverse proxy) ───────
app.set('trust proxy', 1);

// ── Security HTTP Headers ──────────────────────────────────────
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc:   ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc:    ["'self'", 'https://fonts.gstatic.com'],
        scriptSrc:  ["'self'", 'https://checkout.razorpay.com'],
        imgSrc:     ["'self'", 'data:', 'https:'],
      },
    },
  })
);

// ── CORS ────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_URL || '').split(',').map(o => o.trim());
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  })
);

// ── Body Parsers ────────────────────────────────────────────────
// Webhooks need raw body for signature verification — mount before json()
app.use('/api/webhooks', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Data Sanitisation ───────────────────────────────────────────
app.use(mongoSanitize()); // strip $ and . from keys
app.use(xss());           // sanitize HTML in user input

// ── Compression ─────────────────────────────────────────────────
app.use(compression());

// ── Global Rate Limiter ─────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max:      parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api', globalLimiter);

// ── Request Logger ──────────────────────────────────────────────
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`, {
    ip:        req.ip,
    userAgent: req.get('User-Agent'),
  });
  next();
});

// ── Health Check ────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    status:  'healthy',
    env:     process.env.NODE_ENV,
    ts:      new Date().toISOString(),
  });
});

// ── API Routes ──────────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/courses',     courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/payments',    paymentRoutes);
app.use('/api/admin',       adminRoutes);
app.use('/api/webhooks',    webhookRoutes);

// ── 404 Handler ─────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler ────────────────────────────────────────
app.use(errorHandler);

// ── Start Server ────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT, 10) || 5000;
app.listen(PORT, () => {
  logger.info(`UPX Global server running on port ${PORT} [${process.env.NODE_ENV}]`);
});

module.exports = app; // for testing
