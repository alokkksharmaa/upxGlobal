'use strict';

const { db } = require('../config/firebase');
const { COLLECTIONS, EMAIL_STATUS, EMAIL_TYPES } = require('../config/constants');
const { generateId } = require('../utils/generateId');

const EmailLogModel = {
  collection: () => db.collection(COLLECTIONS.EMAIL_LOGS),

  async create(data) {
    const id = generateId('EML');
    const log = {
      id,
      recipient: data.recipient,
      emailType: data.emailType,
      subject: data.subject || '',
      status: data.status || EMAIL_STATUS.PENDING,
      errorMessage: data.errorMessage || null,
      sentAt: data.status === EMAIL_STATUS.SENT ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
      retryCount: 0,
      metadata: data.metadata || {},
    };
    await this.collection().doc(id).set(log);
    return log;
  },

  async update(id, data) {
    await this.collection().doc(id).update({ ...data, updatedAt: new Date().toISOString() });
  },

  async markSent(id) {
    await this.collection().doc(id).update({
      status: EMAIL_STATUS.SENT,
      sentAt: new Date().toISOString(),
    });
  },

  async markFailed(id, errorMessage) {
    const doc = await this.collection().doc(id).get();
    const retryCount = (doc.data()?.retryCount || 0) + 1;
    await this.collection().doc(id).update({
      status: EMAIL_STATUS.FAILED,
      errorMessage,
      retryCount,
      updatedAt: new Date().toISOString(),
    });
  },

  async listAll({ page = 1, limit = 20, status = '' } = {}) {
    let query = this.collection().orderBy('createdAt', 'desc');
    if (status) query = query.where('status', '==', status);

    const countSnap = await this.collection().get();
    const total = countSnap.size;

    const offset = (page - 1) * limit;
    const snap = await query.offset(offset).limit(limit).get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async listFailed() {
    const snap = await this.collection()
      .where('status', '==', EMAIL_STATUS.FAILED)
      .orderBy('createdAt', 'desc')
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },
};

module.exports = EmailLogModel;
