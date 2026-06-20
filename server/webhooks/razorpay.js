'use strict';

const paymentService = require('../services/paymentService');
const EnrollmentModel = require('../models/Enrollment');
const PaymentModel = require('../models/Payment');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../config/logger');

// ── POST /api/webhooks/razorpay ───────────────────────────────
// Razorpay sends raw JSON body — must use express.raw()
const handleRazorpayWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    if (!signature) {
      logger.warn('Webhook received without signature');
      return res.status(400).json({ success: false, message: 'Missing signature' });
    }

    // 1. Verify webhook signature
    const rawBody = req.body; // Buffer (from express.raw)
    const isValid = paymentService.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      logger.warn('Webhook signature verification FAILED');
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    const event = JSON.parse(rawBody.toString());
    const payload = event.payload;

    logger.info(`Razorpay webhook: ${event.event}`);

    switch (event.event) {
      case 'payment.captured': {
        const { order_id, id: paymentId } = payload.payment.entity;

        const enrollment = await EnrollmentModel.findByRazorpayOrderId(order_id);
        if (!enrollment) break;

        if (enrollment.paymentStatus !== 'PAID') {
          // Webhook confirms payment even if client callback was missed
          await EnrollmentModel.updateStatus(enrollment.enrollmentId, 'PAID', {
            razorpayPaymentId: paymentId,
          });

          const payRec = await PaymentModel.findByRazorpayOrderId(order_id);
          if (payRec) {
            await PaymentModel.update(payRec.id, {
              transactionId: paymentId,
              status: 'CAPTURED',
              paymentDate: new Date().toISOString(),
            });
          }

          const CourseModel = require('../models/Course');
          const StudentModel = require('../models/Student');
          await CourseModel.incrementEnrollment(enrollment.courseId);

          const [student, course, payment] = await Promise.all([
            StudentModel.findById(enrollment.studentId),
            CourseModel.findById(enrollment.courseId),
            PaymentModel.findByRazorpayOrderId(order_id),
          ]);

          const emailService = require('../services/emailService');
          emailService.sendEnrollmentConfirmation({ student, course, enrollment, payment }).catch(
            (e) => logger.error('Webhook email error:', e)
          );
        }
        break;
      }

      case 'payment.failed': {
        const { order_id, id: paymentId, error_description } = payload.payment.entity;

        const enrollment = await EnrollmentModel.findByRazorpayOrderId(order_id);
        if (!enrollment || enrollment.paymentStatus === 'PAID') break;

        await EnrollmentModel.updateStatus(enrollment.enrollmentId, 'FAILED');

        const payRec = await PaymentModel.findByRazorpayOrderId(order_id);
        if (payRec) {
          await PaymentModel.update(payRec.id, {
            status: 'FAILED',
            metadata: { error: error_description },
          });
        }

        const StudentModel = require('../models/Student');
        const CourseModel = require('../models/Course');
        const [student, course] = await Promise.all([
          StudentModel.findById(enrollment.studentId),
          CourseModel.findById(enrollment.courseId),
        ]);
        const emailService = require('../services/emailService');
        emailService.sendPaymentFailedEmail({ student, course, enrollment }).catch(
          (e) => logger.error('Webhook failure email error:', e)
        );
        break;
      }

      case 'refund.created': {
        const { payment_id, id: refundId } = payload.refund.entity;
        logger.info(`Refund created: ${refundId} for payment ${payment_id}`);
        break;
      }

      default:
        logger.info(`Unhandled webhook event: ${event.event}`);
    }

    // Always acknowledge immediately to prevent Razorpay retries
    res.json({ success: true });
  } catch (err) {
    logger.error('Webhook handler error:', err);
    // Return 200 anyway to prevent endless Razorpay retries
    res.json({ success: true });
  }
};

module.exports = { handleRazorpayWebhook };
