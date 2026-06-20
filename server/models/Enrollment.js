'use strict';

const { db } = require('../config/firebase');
const { COLLECTIONS, ENROLLMENT_STATUS } = require('../config/constants');
const { generateEnrollmentId } = require('../utils/generateId');

const EnrollmentModel = {
  collection: () => db.collection(COLLECTIONS.ENROLLMENTS),

  async create(data) {
    const enrollmentId = generateEnrollmentId();
    const doc = {
      id: enrollmentId,
      studentId: data.studentId,
      courseId: data.courseId,
      enrollmentId,
      paymentStatus: ENROLLMENT_STATUS.PENDING,
      razorpayOrderId: data.razorpayOrderId || null,
      enrolledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Denormalized fields for quick dashboard queries
      studentName: data.studentName,
      studentEmail: data.studentEmail,
      courseTitle: data.courseTitle,
      amount: data.amount,
    };
    await this.collection().doc(enrollmentId).set(doc);
    return doc;
  },

  async findById(id) {
    const doc = await this.collection().doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  async findByRazorpayOrderId(orderId) {
    const snap = await this.collection()
      .where('razorpayOrderId', '==', orderId)
      .limit(1)
      .get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() };
  },

  async findByStudentAndCourse(studentId, courseId) {
    const snap = await this.collection()
      .where('studentId', '==', studentId)
      .where('courseId', '==', courseId)
      .where('paymentStatus', '==', ENROLLMENT_STATUS.PAID)
      .limit(1)
      .get();
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
  },

  async updateStatus(id, status, extraData = {}) {
    const updates = {
      paymentStatus: status,
      updatedAt: new Date().toISOString(),
      ...extraData,
    };
    await this.collection().doc(id).update(updates);
    return this.findById(id);
  },

  async listAll({ page = 1, limit = 20, status = '' } = {}) {
    let query = this.collection().orderBy('enrolledAt', 'desc');
    if (status) query = query.where('paymentStatus', '==', status);

    const countSnap = await this.collection().get();
    const total = countSnap.size;

    const offset = (page - 1) * limit;
    const snap = await query.offset(offset).limit(limit).get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getStats() {
    const [totalSnap, paidSnap, pendingSnap, failedSnap] = await Promise.all([
      this.collection().get(),
      this.collection().where('paymentStatus', '==', ENROLLMENT_STATUS.PAID).get(),
      this.collection().where('paymentStatus', '==', ENROLLMENT_STATUS.PENDING).get(),
      this.collection().where('paymentStatus', '==', ENROLLMENT_STATUS.FAILED).get(),
    ]);
    return {
      total: totalSnap.size,
      paid: paidSnap.size,
      pending: pendingSnap.size,
      failed: failedSnap.size,
    };
  },
};

module.exports = EnrollmentModel;
