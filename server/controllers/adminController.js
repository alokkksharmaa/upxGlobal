'use strict';

const StudentModel = require('../models/Student');
const EnrollmentModel = require('../models/Enrollment');
const CourseModel = require('../models/Course');
const PaymentModel = require('../models/Payment');
const EmailLogModel = require('../models/EmailLog');
const auditService = require('../services/auditService');
const emailService = require('../services/emailService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../config/logger');

// ── Dashboard Stats ───────────────────────────────────────────
const getDashboardStats = async (_req, res, next) => {
  try {
    const [enrollStats, revenueStats, coursesSnap, studentsSnap] = await Promise.all([
      EnrollmentModel.getStats(),
      PaymentModel.getRevenueStats(),
      CourseModel.listActive(),
      StudentModel.list({ page: 1, limit: 1 }),
    ]);

    res.json({
      success: true,
      stats: {
        enrollments: enrollStats,
        revenue: revenueStats,
        activeCourses: coursesSnap.length,
        totalStudents: studentsSnap.total,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── Students ──────────────────────────────────────────────────
const getStudents = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const result = await StudentModel.list({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      search,
    });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const getStudentById = async (req, res, next) => {
  try {
    const student = await StudentModel.findById(req.params.id);
    if (!student) throw new AppError('Student not found', 404);

    await auditService.log({
      action: auditService.ACTIONS.STUDENT_VIEWED,
      performedBy: req.user.uid,
      targetId: req.params.id,
      metadata: { ip: req.ip },
    });

    res.json({ success: true, student });
  } catch (err) {
    next(err);
  }
};

// ── Enrollments ────────────────────────────────────────────────
const getEnrollments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status = '' } = req.query;
    const result = await EnrollmentModel.listAll({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      status: status.toUpperCase(),
    });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const getEnrollmentById = async (req, res, next) => {
  try {
    const enrollment = await EnrollmentModel.findById(req.params.id);
    if (!enrollment) throw new AppError('Enrollment not found', 404);

    await auditService.log({
      action: auditService.ACTIONS.ENROLLMENT_VIEWED,
      performedBy: req.user.uid,
      targetId: req.params.id,
      metadata: { ip: req.ip },
    });

    res.json({ success: true, enrollment });
  } catch (err) {
    next(err);
  }
};

// ── Payments ──────────────────────────────────────────────────
const getPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status = '' } = req.query;
    const result = await PaymentModel.listAll({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      status: status.toUpperCase(),
    });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

// ── Email Logs ────────────────────────────────────────────────
const getEmailLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status = '' } = req.query;
    const result = await EmailLogModel.listAll({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      status,
    });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const retryFailedEmail = async (req, res, next) => {
  try {
    const result = await emailService.retryFailedEmail(req.params.logId);

    await auditService.log({
      action: auditService.ACTIONS.EMAIL_RETRIED,
      performedBy: req.user.uid,
      targetId: req.params.logId,
      metadata: { ip: req.ip },
    });

    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

// ── Audit Logs ────────────────────────────────────────────────
const getAuditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const items = await auditService.list({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardStats,
  getStudents,
  getStudentById,
  getEnrollments,
  getEnrollmentById,
  getPayments,
  getEmailLogs,
  retryFailedEmail,
  getAuditLogs,
};
