'use strict';

const Razorpay = require('razorpay');
const crypto = require('crypto');
const logger = require('../config/logger');

let razorpayInstance;

const getRazorpay = () => {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

// ── Create Razorpay Order ─────────────────────────────────────
const createOrder = async ({ amount, currency = 'INR', receipt, notes = {} }) => {
  const options = {
    amount: Math.round(amount * 100), // Razorpay expects paise
    currency,
    receipt,
    notes,
  };

  try {
    const order = await getRazorpay().orders.create(options);
    logger.info(`Razorpay order created: ${order.id}`);
    return { success: true, order };
  } catch (err) {
    logger.error(`Razorpay order creation failed: ${err.message}`);
    throw new Error(`Payment gateway error: ${err.description || err.message}`);
  }
};

// ── Verify Payment Signature ──────────────────────────────────
// Prevents fake payment confirmations by verifying HMAC-SHA256
const verifyPaymentSignature = ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  const isValid = crypto.timingSafeEqual(
    Buffer.from(expected, 'hex'),
    Buffer.from(razorpaySignature, 'hex')
  );

  if (!isValid) {
    logger.warn(`Invalid payment signature for order: ${razorpayOrderId}`);
  }
  return isValid;
};

// ── Verify Webhook Signature ──────────────────────────────────
const verifyWebhookSignature = (rawBody, receivedSignature) => {
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expected, 'hex'),
    Buffer.from(receivedSignature, 'hex')
  );
};

// ── Fetch Payment Details ─────────────────────────────────────
const fetchPayment = async (paymentId) => {
  try {
    return await getRazorpay().payments.fetch(paymentId);
  } catch (err) {
    logger.error(`Fetch payment failed: ${err.message}`);
    throw new Error(`Could not fetch payment details: ${err.message}`);
  }
};

// ── Initiate Refund ───────────────────────────────────────────
const initiateRefund = async (paymentId, amount) => {
  try {
    const refund = await getRazorpay().payments.refund(paymentId, {
      amount: Math.round(amount * 100),
    });
    logger.info(`Refund initiated: ${refund.id} for payment ${paymentId}`);
    return refund;
  } catch (err) {
    logger.error(`Refund failed: ${err.message}`);
    throw new Error(`Refund failed: ${err.message}`);
  }
};

module.exports = {
  createOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
  fetchPayment,
  initiateRefund,
};
