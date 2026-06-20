'use strict';

const { db } = require('../config/firebase');
const { COLLECTIONS, COURSE_STATUS } = require('../config/constants');
const { generateId } = require('../utils/generateId');

const CourseModel = {
  collection: () => db.collection(COLLECTIONS.COURSES),

  async create(data) {
    const id = generateId('CRS');
    const course = {
      id,
      title: data.title.trim(),
      description: data.description.trim(),
      duration: data.duration.trim(),
      price: parseFloat(data.price),
      instructor: data.instructor.trim(),
      skillsCovered: data.skillsCovered || [],
      learningOutcomes: data.learningOutcomes || [],
      status: data.status || COURSE_STATUS.ACTIVE,
      thumbnailUrl: data.thumbnailUrl || '',
      category: data.category || 'General',
      level: data.level || 'beginner',
      enrollmentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await this.collection().doc(id).set(course);
    return course;
  },

  async findById(id) {
    const doc = await this.collection().doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  async update(id, data) {
    const updates = { ...data, updatedAt: new Date().toISOString() };
    // Remove undefined fields
    Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);
    await this.collection().doc(id).update(updates);
    return this.findById(id);
  },

  async delete(id) {
    await this.collection().doc(id).delete();
  },

  async listActive() {
    const snap = await this.collection()
      .where('status', '==', COURSE_STATUS.ACTIVE)
      .orderBy('createdAt', 'desc')
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
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

  async incrementEnrollment(id) {
    const ref = this.collection().doc(id);
    await db.runTransaction(async (tx) => {
      const doc = await tx.get(ref);
      if (!doc.exists) return;
      tx.update(ref, { enrollmentCount: (doc.data().enrollmentCount || 0) + 1 });
    });
  },
};

module.exports = CourseModel;
