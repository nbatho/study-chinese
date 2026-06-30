export class AppError extends Error {
  constructor(statusCode, errorCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;
  }
}

export const badRequest = (message, details) =>
  new AppError(400, 'INVALID_INPUT', message, details);

export const unauthorized = (message = 'Ban can dang nhap de thuc hien thao tac nay.') =>
  new AppError(401, 'UNAUTHORIZED', message);

export const forbidden = (message = 'Ban khong co quyen thuc hien thao tac nay.', details) =>
  new AppError(403, 'FORBIDDEN', message, details);

export const notFound = (message = 'Khong tim thay du lieu yeu cau.') =>
  new AppError(404, 'NOT_FOUND', message);

export const conflict = (message = 'Du lieu bi xung dot.') =>
  new AppError(409, 'CONFLICT', message);
