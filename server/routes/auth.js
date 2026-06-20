'use strict';

const router = require('express').Router();
const { adminLogin, refreshToken, logout, getMe, seedAdmin } = require('../controllers/authController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validateBody, schemas } = require('../middleware/validator');

// POST /api/auth/login
router.post('/login', authLimiter, validateBody(schemas.login), adminLogin);

// POST /api/auth/refresh
router.post('/refresh', authLimiter, refreshToken);

// POST /api/auth/logout
router.post('/logout', authenticate, requireAdmin, logout);

// GET /api/auth/me
router.get('/me', authenticate, requireAdmin, getMe);

// POST /api/auth/seed  (only works if no admin exists — run once)
router.post('/seed', seedAdmin);

module.exports = router;
