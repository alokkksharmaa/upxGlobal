'use strict';

const admin = require('firebase-admin');
const logger = require('./logger');

let db, storage, auth;

const initFirebase = () => {
  if (admin.apps.length > 0) {
    db      = admin.firestore();
    storage = admin.storage();
    auth    = admin.auth();
    return { db, storage, auth };
  }

  const serviceAccount = {
    type:                        'service_account',
    project_id:                  process.env.FIREBASE_PROJECT_ID,
    private_key_id:              process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key:                 process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email:                process.env.FIREBASE_CLIENT_EMAIL,
    client_id:                   process.env.FIREBASE_CLIENT_ID,
    auth_uri:                    process.env.FIREBASE_AUTH_URI,
    token_uri:                   process.env.FIREBASE_TOKEN_URI,
  };

  admin.initializeApp({
    credential:    admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });

  db      = admin.firestore();
  storage = admin.storage();
  auth    = admin.auth();

  // Firestore settings
  db.settings({ ignoreUndefinedProperties: true });

  logger.info('Firebase Admin SDK initialised');
  return { db, storage, auth };
};

initFirebase();

module.exports = { db, storage, auth, admin };
