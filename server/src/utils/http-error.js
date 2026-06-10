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

export const unauthorized = (message = 'Bạn cần đăng nhập để thực hiện thao tác này.') =>
  new AppError(401, 'UNAUTHORIZED', message);

export const forbidden = (message = 'Bạn không có quyền thực hiện thao tác này.') =>
  new AppError(403, 'FORBIDDEN', message);

export const notFound = (message = 'Không tìm thấy dữ liệu yêu cầu.') =>
  new AppError(404, 'NOT_FOUND', message);

export const conflict = (message = 'Dữ liệu bị xung đột.') =>
  new AppError(409, 'CONFLICT', message);
