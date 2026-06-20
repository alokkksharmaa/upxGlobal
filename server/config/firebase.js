'use strict';

const admin = require('firebase-admin');
const logger = require('./logger');

let _db, _storage, _auth, _initialised = false;

const initFirebase = () => {
  if (_initialised) return;

  if (admin.apps.length > 0) {
    _db = admin.firestore();
    _storage = admin.storage();
    _auth = admin.auth();
    _initialised = true;
    return;
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!process.env.FIREBASE_PROJECT_ID || !privateKey || !process.env.FIREBASE_CLIENT_EMAIL) {
    logger.warn('Firebase credentials not configured — fill in FIREBASE_* vars in server/.env');
    _initialised = true;
    return;
  }

  try {
    const serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: privateKey,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });

    _db = admin.firestore();
    _storage = admin.storage();
    _auth = admin.auth();
    _db.settings({ ignoreUndefinedProperties: true });
    logger.info('Firebase Admin SDK initialised');
  } catch (err) {
    logger.warn(`Firebase init failed (${err.message}) — fill in valid credentials in server/.env`);
  }

  _initialised = true;
};

// Lazy proxies — Firebase is only connected on first access
const handler = (target, prop) => ({
  get(_, key) {
    initFirebase();
    return target[key];
  },
});

// Export plain getters so models can do: const { db } = require('../config/firebase')
module.exports = {
  get db() { initFirebase(); return _db; },
  get storage() { initFirebase(); return _storage; },
  get auth() { initFirebase(); return _auth; },
  admin,
};
