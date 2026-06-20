'use strict';

const router = require('express').Router();
const { handleRazorpayWebhook } = require('../webhooks/razorpay');

// POST /api/webhooks/razorpay
// Note: raw body parsing is configured in app.js for this path
router.post('/razorpay', handleRazorpayWebhook);

module.exports = router;
