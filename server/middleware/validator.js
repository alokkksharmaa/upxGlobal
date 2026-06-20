'use strict';

const Joi = require('joi');
const { AppError } = require('./errorHandler');

// ── Helper: validate and throw on failure ──────────────────────
const validate = (schema, data) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    const errors = error.details.map((d) => ({
      field: d.context?.key || d.path?.join('.'),
      message: d.message.replace(/"/g, ''),
    }));
    throw new AppError('Validation failed', 400, errors);
  }
  return value;
};

// ── Middleware factory ─────────────────────────────────────────
const validateBody = (schema) => (req, _res, next) => {
  try {
    req.body = validate(schema, req.body);
    next();
  } catch (err) {
    next(err);
  }
};

const validateQuery = (schema) => (req, _res, next) => {
  try {
    req.query = validate(schema, req.query);
    next();
  } catch (err) {
    next(err);
  }
};

// ── Schemas ────────────────────────────────────────────────────

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().email().lowercase().required(),
  password: Joi.string().min(8).max(72)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/)
    .required()
    .messages({
      'string.pattern.base': 'Password must have uppercase, lowercase, digit and special char.',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().lowercase().required(),
  password: Joi.string().required(),
});

const enrollmentSchema = Joi.object({
  courseId: Joi.string().trim().required(),
  fullName: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().email().lowercase().required(),
  phone: Joi.string().trim().pattern(/^\+?[0-9]{7,15}$/).required()
    .messages({ 'string.pattern.base': 'Phone number is invalid.' }),
  collegeName: Joi.string().trim().max(200).required(),
  degree: Joi.string().trim().max(100).required(),
  graduationYear: Joi.number().integer().min(2000).max(2035).required(),
  city: Joi.string().trim().max(100).required(),
});

const courseSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required(),
  description: Joi.string().trim().min(10).max(5000).required(),
  duration: Joi.string().trim().max(100).required(),
  price: Joi.number().positive().required(),
  instructor: Joi.string().trim().max(100).required(),
  skillsCovered: Joi.array().items(Joi.string().trim()).min(1).required(),
  learningOutcomes: Joi.array().items(Joi.string().trim()).min(1).required(),
  status: Joi.string().valid('active', 'inactive', 'draft').default('active'),
  thumbnailUrl: Joi.string().uri().optional().allow(''),
  category: Joi.string().trim().optional(),
  level: Joi.string().valid('beginner', 'intermediate', 'advanced').default('beginner'),
});

const courseUpdateSchema = courseSchema.fork(
  ['title', 'description', 'duration', 'price', 'instructor', 'skillsCovered', 'learningOutcomes'],
  (f) => f.optional()
);

const contactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().email().lowercase().required(),
  subject: Joi.string().trim().max(200).required(),
  message: Joi.string().trim().min(10).max(2000).required(),
});

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().trim().max(100).optional().allow(''),
  status: Joi.string().trim().optional().allow(''),
  sortBy: Joi.string().valid('createdAt', 'name', 'email', 'price').default('createdAt'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
});

module.exports = {
  validateBody,
  validateQuery,
  schemas: {
    register: registerSchema,
    login: loginSchema,
    enrollment: enrollmentSchema,
    course: courseSchema,
    courseUpdate: courseUpdateSchema,
    contact: contactSchema,
    pagination: paginationSchema,
  },
};
