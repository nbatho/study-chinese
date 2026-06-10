import { badRequest } from '../utils/http-error.js';

export const requireFields = (fields) => (req, res, next) => {
  const missing = fields.filter((field) => req.body?.[field] === undefined || req.body[field] === '');

  if (missing.length > 0) {
    return next(
      badRequest('Dữ liệu đầu vào không hợp lệ.', {
        missing
      })
    );
  }

  return next();
};
