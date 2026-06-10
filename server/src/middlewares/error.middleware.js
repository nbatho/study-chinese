import { AppError } from '../utils/http-error.js';

const mapPostgresError = (error) => {
  if (error.code === '23505') {
    return new AppError(409, 'CONFLICT', 'Dữ liệu đã tồn tại.');
  }

  if (error.code === '23503') {
    return new AppError(400, 'INVALID_REFERENCE', 'Dữ liệu liên kết không hợp lệ.');
  }

  if (error.code === '22P02') {
    return new AppError(400, 'INVALID_INPUT', 'Định dạng dữ liệu không hợp lệ.');
  }

  return error;
};

export const notFoundHandler = (req, res, next) => {
  next(new AppError(404, 'ROUTE_NOT_FOUND', `API endpoint '${req.originalUrl}' not found`));
};

export const errorHandler = (error, req, res, next) => {
  const normalizedError = mapPostgresError(error);
  const statusCode = normalizedError.statusCode || 500;
  const status = statusCode >= 500 ? 'error' : 'fail';

  if (statusCode >= 500) {
    console.error('Unhandled Server Error:', normalizedError);
  }

  res.status(statusCode).json({
    status,
    errorCode: normalizedError.errorCode || 'INTERNAL_SERVER_ERROR',
    message:
      statusCode >= 500
        ? 'Máy chủ gặp sự cố. Vui lòng thử lại sau.'
        : normalizedError.message,
    ...(normalizedError.details ? { details: normalizedError.details } : {})
  });
};
