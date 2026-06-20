'use strict';

const CourseModel = require('../models/Course');
const { AppError } = require('../middleware/errorHandler');
const auditService = require('../services/auditService');

// ── GET /api/courses (public) ─────────────────────────────────
const getActiveCourses = async (_req, res, next) => {
  try {
    const courses = await CourseModel.listActive();
    res.json({ success: true, count: courses.length, courses });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/courses/:id (public) ─────────────────────────────
const getCourseById = async (req, res, next) => {
  try {
    const course = await CourseModel.findById(req.params.id);
    if (!course) throw new AppError('Course not found', 404);
    res.json({ success: true, course });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/admin/courses (admin) ────────────────────────────
const getAllCourses = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status = '' } = req.query;
    const result = await CourseModel.listAll({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      status,
    });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/admin/courses (admin) ──────────────────────────
const createCourse = async (req, res, next) => {
  try {
    const course = await CourseModel.create(req.body);

    await auditService.log({
      action: auditService.ACTIONS.COURSE_CREATED,
      performedBy: req.user.uid,
      targetId: course.id,
      metadata: { courseTitle: course.title, ip: req.ip },
    });

    res.status(201).json({ success: true, course });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/admin/courses/:id (admin) ───────────────────────
const updateCourse = async (req, res, next) => {
  try {
    const existing = await CourseModel.findById(req.params.id);
    if (!existing) throw new AppError('Course not found', 404);

    const updated = await CourseModel.update(req.params.id, req.body);

    await auditService.log({
      action: auditService.ACTIONS.COURSE_UPDATED,
      performedBy: req.user.uid,
      targetId: req.params.id,
      metadata: { ip: req.ip },
    });

    res.json({ success: true, course: updated });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/admin/courses/:id (admin) ────────────────────
const deleteCourse = async (req, res, next) => {
  try {
    const existing = await CourseModel.findById(req.params.id);
    if (!existing) throw new AppError('Course not found', 404);

    await CourseModel.delete(req.params.id);

    await auditService.log({
      action: auditService.ACTIONS.COURSE_DELETED,
      performedBy: req.user.uid,
      targetId: req.params.id,
      metadata: { courseTitle: existing.title, ip: req.ip },
    });

    res.json({ success: true, message: 'Course deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getActiveCourses, getCourseById, getAllCourses, createCourse, updateCourse, deleteCourse };
