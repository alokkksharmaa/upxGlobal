'use strict';

const { db } = require('../config/firebase');
const { COLLECTIONS } = require('../config/constants');
const { generateId } = require('../utils/generateId');

// ── Student Model ──────────────────────────────────────────────
const StudentModel = {
  collection: () => db.collection(COLLECTIONS.STUDENTS),

  async create(data) {
    const id = generateId('STU');
    const student = {
      id,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
      collegeName: data.collegeName.trim(),
      degree: data.degree.trim(),
      graduationYear: parseInt(data.graduationYear, 10),
      city: data.city.trim(),
      resumeUrl: data.resumeUrl || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await this.collection().doc(id).set(student);
    return student;
  },

  async findById(id) {
    const doc = await this.collection().doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  async findByEmail(email) {
    const snap = await this.collection()
      .where('email', '==', email.toLowerCase().trim())
      .limit(1)
      .get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() };
  },

  async update(id, data) {
    const updates = { ...data, updatedAt: new Date().toISOString() };
    await this.collection().doc(id).update(updates);
    return this.findById(id);
  },

  async list({ page = 1, limit = 20, search = '' } = {}) {
    let query = this.collection().orderBy('createdAt', 'desc');

    const countSnap = await query.get();
    const total = countSnap.size;

    if (search) {
      // Firestore doesn't support full-text, use range query on email/name
      query = this.collection()
        .orderBy('email')
        .startAt(search.toLowerCase())
        .endAt(search.toLowerCase() + '\uf8ff');
    }

    const offset = (page - 1) * limit;
    const snap = await query.offset(offset).limit(limit).get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  },
};

module.exports = StudentModel;
