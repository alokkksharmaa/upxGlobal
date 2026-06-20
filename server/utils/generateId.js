'use strict';

const { v4: uuidv4 } = require('uuid');

// ── Generate prefixed Firestore document ID ───────────────────
const generateId = (prefix = 'DOC') => {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = uuidv4().replace(/-/g, '').slice(0, 8).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
};

// ── Generate human-readable Enrollment ID ─────────────────────
// Format: UPX-YYYYMMDD-XXXXXX
const generateEnrollmentId = () => {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `UPX-${date}-${rand}`;
};

// ── Generate short transaction reference ──────────────────────
const generateTxnRef = () => {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TXN-${ts}-${rand}`;
};

module.exports = { generateId, generateEnrollmentId, generateTxnRef };
