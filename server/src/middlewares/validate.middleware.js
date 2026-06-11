import { badRequest } from '../utils/http-error.js';

export const requireFields = (fields) => (req, res, next) => {
  const missing = fields.filter((field) => req.body?.[field] === undefined || req.body[field] === '');

  if (missing.length > 0) {
    return next(badRequest('Input data is invalid.', { missing }));
  }

  return next();
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validators = {
  email: (value) => typeof value === 'string' && emailPattern.test(value.trim().toLowerCase()),
  nonEmptyString: (value) => typeof value === 'string' && value.trim().length > 0,
  password: (value) => typeof value === 'string' && value.length >= 8,
  optionalString:
    (max = 255) =>
    (value) =>
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim().length <= max),
  oneOf: (allowed) => (value) => allowed.includes(value),
  numberBetween: (min, max) => (value) =>
    typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max
};

export const validateBody = (schema) => (req, res, next) => {
  const fields = {};

  Object.entries(schema).forEach(([field, validate]) => {
    if (!validate(req.body?.[field])) {
      fields[field] = 'Invalid value.';
    }
  });

  if (Object.keys(fields).length > 0) {
    return next(badRequest('Input data is invalid.', { fields }));
  }

  return next();
};

export const authSchemas = {
  register: {
    email: validators.email,
    password: validators.password,
    name: validators.optionalString(80)
  },
  login: {
    email: validators.email,
    password: validators.nonEmptyString
  }
};
