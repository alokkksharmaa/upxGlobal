'use strict';

const router = require('express').Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validateBody, schemas } = require('../middleware/validator');
const { createCourse, updateCourse, deleteCourse, getAllCourses } = require('../controllers/courseController');
const {
  getDashboardStats,
  getStudents,
  getStudentById,
  getEnrollments,
  getEnrollmentById,
  getPayments,
  getEmailLogs,
  retryFailedEmail,
  getAuditLogs,
} = require('../controllers/adminController');

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

// ── Dashboard ─────────────────────────────────────────────────
router.get('/dashboard', getDashboardStats);

// ── Students ──────────────────────────────────────────────────
router.get('/students', getStudents);
router.get('/students/:id', getStudentById);

// ── Enrollments ───────────────────────────────────────────────
router.get('/enrollments', getEnrollments);
router.get('/enrollments/:id', getEnrollmentById);

// ── Courses (Admin CRUD) ──────────────────────────────────────
router.get('/courses', getAllCourses);
router.post('/courses', validateBody(schemas.course), createCourse);
router.put('/courses/:id', validateBody(schemas.courseUpdate), updateCourse);
router.delete('/courses/:id', deleteCourse);

// ── Payments ──────────────────────────────────────────────────
router.get('/payments', getPayments);

// ── Email Logs ────────────────────────────────────────────────
router.get('/email-logs', getEmailLogs);
router.post('/email-logs/:logId/retry', retryFailedEmail);

// ── Audit Logs ────────────────────────────────────────────────
router.get('/audit-logs', getAuditLogs);

module.exports = router;
