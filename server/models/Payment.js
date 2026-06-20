'use strict';

const { db } = require('../config/firebase');
const { COLLECTIONS, PAYMENT_STATUS } = require('../config/constants');
const { generateId } = require('../utils/generateId');

const PaymentModel = {
  collection: () => db.collection(COLLECTIONS.PAYMENTS),

  async create(data) {
    const id = generateId('PAY');
    const payment = {
      id,
      enrollmentId: data.enrollmentId,
      razorpayOrderId: data.razorpayOrderId,
      transactionId: data.transactionId || null,
      gatewayProvider: 'razorpay',
      amount: data.amount,
      currency: data.currency || 'INR',
      status: data.status || PAYMENT_STATUS.CREATED,
      paymentDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: data.metadata || {},
    };
    await this.collection().doc(id).set(payment);
    return payment;
  },

  async findById(id) {
    const doc = await this.collection().doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  async findByEnrollmentId(enrollmentId) {
    const snap = await this.collection()
      .where('enrollmentId', '==', enrollmentId)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
  },

  async findByRazorpayOrderId(orderId) {
    const snap = await this.collection()
      .where('razorpayOrderId', '==', orderId)
      .limit(1)
      .get();
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
  },

  async update(id, data) {
    const updates = { ...data, updatedAt: new Date().toISOString() };
    await this.collection().doc(id).update(updates);
    return this.findById(id);
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

  async getRevenueStats() {
    const snap = await this.collection()
      .where('status', '==', 'CAPTURED')
      .get();
    const totalRevenue = snap.docs.reduce((sum, d) => sum + (d.data().amount || 0), 0);
    return { totalPayments: snap.size, totalRevenue };
  },
};

module.exports = PaymentModel;
