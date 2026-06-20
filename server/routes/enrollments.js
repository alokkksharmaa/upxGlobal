'use strict';

const router = require('express').Router();
const {
  upload,
  createEnrollment,
  verifyPayment,
  getEnrollment,
  retryPayment,
} = require('../controllers/enrollmentController');
const { validateBody, schemas } = require('../middleware/validator');
const { enrollmentLimiter } = require('../middleware/rateLimiter');

// POST /api/enrollments — create enrollment + Razorpay order
router.post(
  '/',
  enrollmentLimiter,
  upload.single('resume'),
  validateBody(schemas.enrollment),
  createEnrollment
);

// POST /api/enrollments/verify-payment — confirm payment
router.post('/verify-payment', verifyPayment);

// GET /api/enrollments/:id
router.get('/:id', getEnrollment);

// POST /api/enrollments/:id/retry
router.post('/:id/retry', enrollmentLimiter, retryPayment);

module.exports = router;
