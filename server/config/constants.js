'use strict';

module.exports = {
  // ── Firestore Collections ──────────────────────────────────────
  COLLECTIONS: {
    STUDENTS: 'students',
    COURSES: 'courses',
    ENROLLMENTS: 'enrollments',
    PAYMENTS: 'payments',
    EMAIL_LOGS: 'emailLogs',
    ADMINS: 'admins',
    AUDIT_LOGS: 'auditLogs',
    REFRESH_TOKENS: 'refreshTokens',
  },

  // ── Enrollment Status ─────────────────────────────────────────
  ENROLLMENT_STATUS: {
    PENDING: 'PENDING',
    PAID: 'PAID',
    FAILED: 'FAILED',
    CANCELLED: 'CANCELLED',
    REFUNDED: 'REFUNDED',
  },

  // ── Payment Status ────────────────────────────────────────────
  PAYMENT_STATUS: {
    CREATED: 'CREATED',
    AUTHORIZED: 'AUTHORIZED',
    CAPTURED: 'CAPTURED',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
  },

  // ── Email Types ───────────────────────────────────────────────
  EMAIL_TYPES: {
    ENROLLMENT_CONFIRMATION: 'ENROLLMENT_CONFIRMATION',
    ADMIN_NOTIFICATION: 'ADMIN_NOTIFICATION',
    PAYMENT_FAILED: 'PAYMENT_FAILED',
    PASSWORD_RESET: 'PASSWORD_RESET',
    WELCOME: 'WELCOME',
  },

  // ── Email Log Status ──────────────────────────────────────────
  EMAIL_STATUS: {
    SENT: 'SENT',
    FAILED: 'FAILED',
    PENDING: 'PENDING',
  },

  // ── Roles ─────────────────────────────────────────────────────
  ROLES: {
    ADMIN: 'admin',
    STUDENT: 'student',
  },

  // ── Course Status ─────────────────────────────────────────────
  COURSE_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    DRAFT: 'draft',
  },

  // ── Pagination ────────────────────────────────────────────────
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // ── File Upload ───────────────────────────────────────────────
  ALLOWED_RESUME_MIME: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  MAX_RESUME_SIZE_BYTES: 5 * 1024 * 1024, // 5 MB

  // ── Currency ──────────────────────────────────────────────────
  DEFAULT_CURRENCY: 'INR',

  // ── Razorpay ──────────────────────────────────────────────────
  RAZORPAY_CURRENCY: 'INR',
};
