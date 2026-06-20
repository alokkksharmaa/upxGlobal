'use strict';

const multer = require('multer');
const path = require('path');
const StudentModel = require('../models/Student');
const CourseModel = require('../models/Course');
const EnrollmentModel = require('../models/Enrollment');
const PaymentModel = require('../models/Payment');
const { AppError } = require('../middleware/errorHandler');
const paymentService = require('../services/paymentService');
const { storage } = require('../config/firebase');
const { ALLOWED_RESUME_MIME, MAX_RESUME_SIZE_BYTES, ENROLLMENT_STATUS } = require('../config/constants');
const logger = require('../config/logger');

// ── File Upload (Firebase Storage) ───────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_RESUME_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_RESUME_MIME.includes(file.mimetype)) return cb(null, true);
    cb(new AppError('Only PDF and Word documents are allowed for resume', 400));
  },
});

const uploadResumeToStorage = async (file, studentId) => {
  const ext = path.extname(file.originalname);
  const filename = `resumes/${studentId}/${Date.now()}${ext}`;
  const bucket = storage.bucket();
  const fileRef = bucket.file(filename);

  await fileRef.save(file.buffer, {
    metadata: { contentType: file.mimetype },
    resumable: false,
  });

  await fileRef.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${filename}`;
};

// ── POST /api/enrollments ─────────────────────────────────────
// Step 1: Create enrollment + Razorpay order
const createEnrollment = async (req, res, next) => {
  try {
    const {
      courseId, fullName, email, phone,
      collegeName, degree, graduationYear, city,
    } = req.body;

    // 1. Validate course exists & is active
    const course = await CourseModel.findById(courseId);
    if (!course || course.status !== 'active') {
      throw new AppError('Course not found or is inactive', 404);
    }

    // 2. Check duplicate enrollment (same email + course + PAID)
    let student = await StudentModel.findByEmail(email);
    if (student) {
      const existing = await EnrollmentModel.findByStudentAndCourse(student.id, courseId);
      if (existing) throw new AppError('You are already enrolled in this course', 409);
    }

    // 3. Upload resume if provided
    let resumeUrl = null;
    if (req.file) {
      const tempId = `temp_${Date.now()}`;
      resumeUrl = await uploadResumeToStorage(req.file, tempId);
    }

    // 4. Upsert student record
    if (!student) {
      student = await StudentModel.create({
        name: fullName, email, phone, collegeName,
        degree, graduationYear, city, resumeUrl,
      });
    } else {
      student = await StudentModel.update(student.id, {
        name: fullName, phone, collegeName,
        degree, graduationYear, city,
        ...(resumeUrl && { resumeUrl }),
      });
    }

    // 5. Create Razorpay order
    const { order } = await paymentService.createOrder({
      amount: course.price,
      receipt: `rcpt_${student.id.slice(-6)}_${Date.now()}`,
      notes: { studentId: student.id, courseId },
    });

    // 6. Create enrollment record (PENDING)
    const enrollment = await EnrollmentModel.create({
      studentId: student.id,
      courseId,
      razorpayOrderId: order.id,
      studentName: fullName,
      studentEmail: email,
      courseTitle: course.title,
      amount: course.price,
    });

    // 7. Create payment record (CREATED)
    const payment = await PaymentModel.create({
      enrollmentId: enrollment.enrollmentId,
      razorpayOrderId: order.id,
      amount: course.price,
      currency: 'INR',
    });

    logger.info(`Enrollment initiated: ${enrollment.enrollmentId} | Order: ${order.id}`);

    res.status(201).json({
      success: true,
      enrollmentId: enrollment.enrollmentId,
      razorpayOrderId: order.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      studentName: fullName,
      studentEmail: email,
      courseTitle: course.title,
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/enrollments/verify-payment ─────────────────────
// Step 2: Verify signature & confirm enrollment
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, enrollmentId } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !enrollmentId) {
      throw new AppError('Missing payment verification fields', 400);
    }

    // 1. Verify signature (prevent fake confirmations)
    const isValid = paymentService.verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) throw new AppError('Payment verification failed: invalid signature', 400);

    // 2. Fetch enrollment & payment from DB
    const enrollment = await EnrollmentModel.findById(enrollmentId);
    if (!enrollment) throw new AppError('Enrollment not found', 404);

    // 3. Idempotency: already paid?
    if (enrollment.paymentStatus === ENROLLMENT_STATUS.PAID) {
      return res.json({ success: true, message: 'Already confirmed', enrollmentId });
    }

    // 4. Mark enrollment as PAID
    await EnrollmentModel.updateStatus(enrollmentId, ENROLLMENT_STATUS.PAID, {
      razorpayPaymentId,
    });

    // 5. Update payment record
    const payRec = await PaymentModel.findByRazorpayOrderId(razorpayOrderId);
    if (payRec) {
      await PaymentModel.update(payRec.id, {
        transactionId: razorpayPaymentId,
        status: 'CAPTURED',
        paymentDate: new Date().toISOString(),
        metadata: { razorpaySignature },
      });
    }

    // 6. Increment course enrollment count
    await CourseModel.incrementEnrollment(enrollment.courseId);

    // 7. Send emails (async, don't block response)
    const [student, course, updatedPayment] = await Promise.all([
      StudentModel.findById(enrollment.studentId),
      CourseModel.findById(enrollment.courseId),
      PaymentModel.findByRazorpayOrderId(razorpayOrderId),
    ]);

    const emailService = require('../services/emailService');
    emailService.sendEnrollmentConfirmation({ student, course, enrollment, payment: updatedPayment }).catch(
      (e) => logger.error('Confirmation email error:', e)
    );
    emailService.sendAdminNotification({ student, course, enrollment, payment: updatedPayment }).catch(
      (e) => logger.error('Admin notification email error:', e)
    );

    logger.info(`Enrollment confirmed: ${enrollmentId} | Payment: ${razorpayPaymentId}`);

    res.json({
      success: true,
      message: 'Payment verified and enrollment confirmed!',
      enrollmentId,
      transactionId: razorpayPaymentId,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/enrollments/:id ──────────────────────────────────
const getEnrollment = async (req, res, next) => {
  try {
    const enrollment = await EnrollmentModel.findById(req.params.id);
    if (!enrollment) throw new AppError('Enrollment not found', 404);
    res.json({ success: true, enrollment });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/enrollments/:id/retry ──────────────────────────
const retryPayment = async (req, res, next) => {
  try {
    const enrollment = await EnrollmentModel.findById(req.params.id);
    if (!enrollment) throw new AppError('Enrollment not found', 404);

    if (enrollment.paymentStatus === ENROLLMENT_STATUS.PAID) {
      return res.status(409).json({ success: false, message: 'Already paid' });
    }

    const course = await CourseModel.findById(enrollment.courseId);
    if (!course) throw new AppError('Course not found', 404);

    // Create new Razorpay order for retry
    const { order } = await paymentService.createOrder({
      amount: course.price,
      receipt: `retry_${enrollment.enrollmentId.slice(-6)}_${Date.now()}`,
      notes: { enrollmentId: enrollment.enrollmentId },
    });

    // Update enrollment with new order ID
    await EnrollmentModel.updateStatus(enrollment.enrollmentId, ENROLLMENT_STATUS.PENDING, {
      razorpayOrderId: order.id,
    });

    res.json({
      success: true,
      razorpayOrderId: order.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      enrollmentId: enrollment.enrollmentId,
      courseTitle: course.title,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  upload,
  createEnrollment,
  verifyPayment,
  getEnrollment,
  retryPayment,
};
