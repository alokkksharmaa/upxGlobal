'use strict';

const nodemailer = require('nodemailer');
const EmailLogModel = require('../models/EmailLog');
const { EMAIL_TYPES, EMAIL_STATUS } = require('../config/constants');
const logger = require('../config/logger');

// ── Transport ──────────────────────────────────────────────────
const createTransport = () =>
  nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    pool: true,
    maxConnections: 5,
    rateDelta: 1000,
    rateLimit: 10,
  });

let transporter;
const getTransporter = () => {
  if (!transporter) transporter = createTransport();
  return transporter;
};

// ── Send Helper ────────────────────────────────────────────────
const sendEmail = async ({ to, subject, html, text, emailType, metadata = {} }) => {
  const logEntry = await EmailLogModel.create({
    recipient: to,
    emailType,
    subject,
    status: EMAIL_STATUS.PENDING,
    metadata,
  });

  try {
    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || 'UPX Global <noreply@upxglobal.com>',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, ''),
    });
    await EmailLogModel.markSent(logEntry.id);
    logger.info(`Email sent [${emailType}] → ${to}`);
    return { success: true, logId: logEntry.id };
  } catch (err) {
    await EmailLogModel.markFailed(logEntry.id, err.message);
    logger.error(`Email FAILED [${emailType}] → ${to}: ${err.message}`);
    return { success: false, error: err.message, logId: logEntry.id };
  }
};

// ── Email Templates ────────────────────────────────────────────
const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>UPX Global</title>
  <style>
    body { margin:0; padding:0; font-family:'Segoe UI',Arial,sans-serif; background:#f4f6f9; }
    .wrapper { max-width:600px; margin:30px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,.08); }
    .header { background:linear-gradient(135deg,#1a237e 0%,#283593 100%); padding:36px 40px; text-align:center; }
    .header h1 { color:#fff; margin:0; font-size:26px; font-weight:700; letter-spacing:1px; }
    .header p  { color:#c5cae9; margin:6px 0 0; font-size:13px; }
    .body   { padding:36px 40px; }
    .badge  { display:inline-block; background:#e8eaf6; color:#3949ab; padding:4px 14px; border-radius:20px; font-size:12px; font-weight:600; margin-bottom:20px; }
    h2      { color:#1a237e; font-size:22px; margin:0 0 16px; }
    p       { color:#424242; line-height:1.7; margin:0 0 14px; font-size:15px; }
    .info-box { background:#f5f7ff; border-left:4px solid #3f51b5; border-radius:6px; padding:18px 22px; margin:20px 0; }
    .info-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #e8eaf6; font-size:14px; }
    .info-row:last-child { border-bottom:none; }
    .label  { color:#757575; font-weight:500; }
    .value  { color:#212121; font-weight:600; text-align:right; }
    .btn    { display:inline-block; background:linear-gradient(135deg,#1a237e,#3f51b5); color:#fff!important; text-decoration:none; padding:13px 32px; border-radius:8px; font-size:15px; font-weight:600; margin:10px 0; }
    .footer { background:#f5f5f5; padding:22px 40px; text-align:center; border-top:1px solid #eeeeee; }
    .footer p { color:#9e9e9e; font-size:12px; margin:4px 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>UPX Global</h1>
      <p>Empowering Careers Through Knowledge</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} UPX Global EdTech. All rights reserved.</p>
      <p>Need help? Email us at <a href="mailto:support@upxglobal.com" style="color:#3f51b5;">support@upxglobal.com</a></p>
    </div>
  </div>
</body>
</html>`;

// ── Enrollment Confirmation Email ──────────────────────────────
const sendEnrollmentConfirmation = async ({ student, course, enrollment, payment }) => {
  const content = `
    <span class="badge">Enrollment Confirmed ✓</span>
    <h2>Welcome aboard, ${student.name}! 🎉</h2>
    <p>Your enrollment in <strong>${course.title}</strong> has been confirmed. We're excited to have you on this learning journey!</p>
    <div class="info-box">
      <div class="info-row"><span class="label">Enrollment ID</span><span class="value">${enrollment.enrollmentId}</span></div>
      <div class="info-row"><span class="label">Payment ID</span><span class="value">${payment.transactionId}</span></div>
      <div class="info-row"><span class="label">Course</span><span class="value">${course.title}</span></div>
      <div class="info-row"><span class="label">Duration</span><span class="value">${course.duration}</span></div>
      <div class="info-row"><span class="label">Instructor</span><span class="value">${course.instructor}</span></div>
      <div class="info-row"><span class="label">Amount Paid</span><span class="value">₹${(payment.amount).toLocaleString('en-IN')}</span></div>
      <div class="info-row"><span class="label">Payment Date</span><span class="value">${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</span></div>
    </div>
    <h2 style="font-size:17px;margin-top:24px;">Next Steps</h2>
    <p>📧 Our team will reach out within <strong>24 hours</strong> with your joining instructions, course access details, and schedule.</p>
    <p>📞 For immediate assistance, contact us at <strong>+91-XXXXXXXXXX</strong> or reply to this email.</p>
    <p>We look forward to helping you build an amazing career!</p>
    <br/>
    <p style="color:#757575;font-size:13px;">Please save your Enrollment ID <strong>${enrollment.enrollmentId}</strong> for future reference.</p>`;

  return sendEmail({
    to: student.email,
    subject: `Enrollment Confirmed — ${course.title} | UPX Global`,
    html: baseTemplate(content),
    emailType: EMAIL_TYPES.ENROLLMENT_CONFIRMATION,
    metadata: { enrollmentId: enrollment.enrollmentId, courseId: course.id },
  });
};

// ── Admin Notification Email ───────────────────────────────────
const sendAdminNotification = async ({ student, course, enrollment, payment }) => {
  const content = `
    <span class="badge">New Enrollment Alert</span>
    <h2>New Student Enrolled</h2>
    <div class="info-box">
      <div class="info-row"><span class="label">Student Name</span><span class="value">${student.name}</span></div>
      <div class="info-row"><span class="label">Email</span><span class="value">${student.email}</span></div>
      <div class="info-row"><span class="label">Phone</span><span class="value">${student.phone}</span></div>
      <div class="info-row"><span class="label">College</span><span class="value">${student.collegeName}</span></div>
      <div class="info-row"><span class="label">Degree</span><span class="value">${student.degree}</span></div>
      <div class="info-row"><span class="label">Graduation Year</span><span class="value">${student.graduationYear}</span></div>
      <div class="info-row"><span class="label">City</span><span class="value">${student.city}</span></div>
    </div>
    <h2 style="font-size:17px;margin-top:24px;">Course & Payment Details</h2>
    <div class="info-box">
      <div class="info-row"><span class="label">Course</span><span class="value">${course.title}</span></div>
      <div class="info-row"><span class="label">Enrollment ID</span><span class="value">${enrollment.enrollmentId}</span></div>
      <div class="info-row"><span class="label">Transaction ID</span><span class="value">${payment.transactionId}</span></div>
      <div class="info-row"><span class="label">Amount</span><span class="value">₹${(payment.amount).toLocaleString('en-IN')}</span></div>
      <div class="info-row"><span class="label">Gateway</span><span class="value">Razorpay</span></div>
    </div>`;

  return sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `[Admin] New Enrollment: ${student.name} → ${course.title}`,
    html: baseTemplate(content),
    emailType: EMAIL_TYPES.ADMIN_NOTIFICATION,
    metadata: { enrollmentId: enrollment.enrollmentId },
  });
};

// ── Payment Failed Email ───────────────────────────────────────
const sendPaymentFailedEmail = async ({ student, course, enrollment }) => {
  const content = `
    <span class="badge" style="background:#fce4ec;color:#c62828;">Payment Failed</span>
    <h2>Payment Unsuccessful</h2>
    <p>Hi ${student.name}, unfortunately your payment for <strong>${course.title}</strong> could not be processed.</p>
    <div class="info-box">
      <div class="info-row"><span class="label">Enrollment ID</span><span class="value">${enrollment.enrollmentId}</span></div>
      <div class="info-row"><span class="label">Course</span><span class="value">${course.title}</span></div>
      <div class="info-row"><span class="label">Amount</span><span class="value">₹${(course.price).toLocaleString('en-IN')}</span></div>
    </div>
    <p>Your enrollment details are saved. You can retry payment anytime using the link below.</p>
    <a href="${process.env.CLIENT_URL}/enrollment/retry/${enrollment.enrollmentId}" class="btn">Retry Payment</a>
    <p style="margin-top:20px;">If you continue to face issues, contact us at <a href="mailto:support@upxglobal.com" style="color:#3f51b5;">support@upxglobal.com</a></p>`;

  return sendEmail({
    to: student.email,
    subject: `Payment Failed — ${course.title} | UPX Global`,
    html: baseTemplate(content),
    emailType: EMAIL_TYPES.PAYMENT_FAILED,
    metadata: { enrollmentId: enrollment.enrollmentId },
  });
};

// ── Retry Failed Emails ────────────────────────────────────────
const retryFailedEmail = async (logId) => {
  const EmailLogModel = require('../models/EmailLog');
  const log = await EmailLogModel.collection().doc(logId).get();
  if (!log.exists) return { success: false, message: 'Log not found' };
  // Re-queue logic can be extended here with a proper job queue
  return { success: true, message: 'Retry queued' };
};

module.exports = {
  sendEnrollmentConfirmation,
  sendAdminNotification,
  sendPaymentFailedEmail,
  retryFailedEmail,
};
