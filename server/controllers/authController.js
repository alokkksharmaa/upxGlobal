'use strict';

const bcrypt = require('bcryptjs');
const { db } = require('../config/firebase');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../middleware/auth');
const { COLLECTIONS, ROLES } = require('../config/constants');
const { AppError } = require('../middleware/errorHandler');
const auditService = require('../services/auditService');
const logger = require('../config/logger');
const { generateId } = require('../utils/generateId');

// ── Admin Login ───────────────────────────────────────────────
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find admin
    const snap = await db.collection(COLLECTIONS.ADMINS)
      .where('email', '==', email.toLowerCase())
      .limit(1)
      .get();

    if (snap.empty) {
      throw new AppError('Invalid credentials', 401);
    }

    const adminDoc = snap.docs[0];
    const adminData = adminDoc.data();

    const isMatch = await bcrypt.compare(password, adminData.passwordHash);
    if (!isMatch) throw new AppError('Invalid credentials', 401);

    if (!adminData.isActive) throw new AppError('Account deactivated', 403);

    const payload = { uid: adminDoc.id, email: adminData.email, role: ROLES.ADMIN };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Persist refresh token (hashed)
    const rtHash = await bcrypt.hash(refreshToken, 10);
    await db.collection(COLLECTIONS.REFRESH_TOKENS).add({
      adminId: adminDoc.id,
      tokenHash: rtHash,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // Update last login
    await db.collection(COLLECTIONS.ADMINS).doc(adminDoc.id).update({
      lastLoginAt: new Date().toISOString(),
    });

    await auditService.log({
      action: auditService.ACTIONS.ADMIN_LOGIN,
      performedBy: adminDoc.id,
      metadata: { ip: req.ip },
    });

    res.json({
      success: true,
      accessToken,
      refreshToken,
      admin: {
        id: adminDoc.id,
        email: adminData.email,
        name: adminData.name,
        role: ROLES.ADMIN,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── Refresh Token ─────────────────────────────────────────────
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) throw new AppError('Refresh token required', 400);

    const decoded = verifyRefreshToken(token);

    // Verify token exists in DB (not revoked)
    const snap = await db.collection(COLLECTIONS.REFRESH_TOKENS)
      .where('adminId', '==', decoded.uid)
      .get();

    let tokenFound = false;
    for (const doc of snap.docs) {
      const match = await bcrypt.compare(token, doc.data().tokenHash);
      if (match) { tokenFound = true; break; }
    }

    if (!tokenFound) throw new AppError('Invalid refresh token', 401);

    const payload = { uid: decoded.uid, email: decoded.email, role: decoded.role };
    const accessToken = generateAccessToken(payload);

    res.json({ success: true, accessToken });
  } catch (err) {
    next(err);
  }
};

// ── Logout ────────────────────────────────────────────────────
const logout = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (token) {
      const snap = await db.collection(COLLECTIONS.REFRESH_TOKENS)
        .where('adminId', '==', req.user.uid)
        .get();

      const batch = db.batch();
      for (const doc of snap.docs) {
        const match = await bcrypt.compare(token, doc.data().tokenHash);
        if (match) batch.delete(doc.ref);
      }
      await batch.commit();
    }

    await auditService.log({
      action: auditService.ACTIONS.ADMIN_LOGOUT,
      performedBy: req.user.uid,
      metadata: { ip: req.ip },
    });

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

// ── Get Me (current admin) ────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    const doc = await db.collection(COLLECTIONS.ADMINS).doc(req.user.uid).get();
    if (!doc.exists) throw new AppError('Admin not found', 404);

    const { passwordHash, ...safeData } = doc.data();
    res.json({ success: true, admin: { id: doc.id, ...safeData } });
  } catch (err) {
    next(err);
  }
};

// ── Seed First Admin (called once during setup) ───────────────
const seedAdmin = async (req, res, next) => {
  try {
    const snap = await db.collection(COLLECTIONS.ADMINS).limit(1).get();
    if (!snap.empty) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }

    const id = generateId('ADM');
    const hash = await bcrypt.hash(process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123456', 12);

    await db.collection(COLLECTIONS.ADMINS).doc(id).set({
      id,
      name: 'Super Admin',
      email: (process.env.ADMIN_DEFAULT_EMAIL || 'admin@upxglobal.com').toLowerCase(),
      passwordHash: hash,
      role: ROLES.ADMIN,
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    res.json({ success: true, message: 'Admin seeded successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { adminLogin, refreshToken, logout, getMe, seedAdmin };
