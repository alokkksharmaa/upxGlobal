'use strict';

const router = require('express').Router();
const {
  getActiveCourses,
  getCourseById,
} = require('../controllers/courseController');

// GET /api/courses
router.get('/', getActiveCourses);

// GET /api/courses/:id
router.get('/:id', getCourseById);

module.exports = router;
