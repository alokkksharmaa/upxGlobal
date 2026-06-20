'use strict';

const { db } = require('../config/firebase');
const { COLLECTIONS } = require('../config/constants');
const { generateId } = require('../utils/generateId');
const logger = require('../config/logger');

// ── Audit Log Actions ──────────────────────────────────────────
const ACTIONS = {
  ADMIN_LOGIN: 'ADMIN_LOGIN',
  ADMIN_LOGOUT: 'ADMIN_LOGOUT',
  COURSE_CREATED: 'COURSE_CREATED',
  COURSE_UPDATED: 'COURSE_UPDATED',
  COURSE_DELETED: 'COURSE_DELETED',
  ENROLLMENT_VIEWED: 'ENROLLMENT_VIEWED',
  PAYMENT_REFUNDED: 'PAYMENT_REFUNDED',
  EMAIL_RETRIED: 'EMAIL_RETRIED',
  STUDENT_VIEWED: 'STUDENT_VIEWED',
  ADMIN_CREATED: 'ADMIN_CREATED',
};

// ── Log an Audit Event ────────────────────────────────────────
const log = async ({ action, performedBy, targetId = null, metadata = {} }) => {
  const id = generateId('AUD');
  const entry = {
    id,
    action,
    performedBy, // admin uid
    targetId,
    metadata,
    timestamp: new Date().toISOString(),
    ip: metadata.ip || null,
  };

  try {
    await db.collection(COLLECTIONS.AUDIT_LOGS).doc(id).set(entry);
    logger.info(`AUDIT [${action}] by ${performedBy}`);
  } catch (err) {
    // Audit failures should not break the main flow
    logger.error(`Audit log failed: ${err.message}`);
  }

  return entry;
};

// ── List Audit Logs ────────────────────────────────────────────
const list = async ({ page = 1, limit = 50 } = {}) => {
  const query = db.collection(COLLECTIONS.AUDIT_LOGS)
    .orderBy('timestamp', 'desc')
    .offset((page - 1) * limit)
    .limit(limit);

  const snap = await query.get();
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return items;
};

module.exports = { log, list, ACTIONS };
