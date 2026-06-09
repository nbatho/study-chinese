export interface ApiErrorPayload {
  status: 'error' | 'fail';
  errorCode: string;
  message: string;
  details?: any;
}

/**
 * Custom Error class representing API validation or response errors.
 */
export class ApiError extends Error {
  status: 'error' | 'fail';
  errorCode: string;
  statusCode: number;
  details?: any;

  constructor(payload: ApiErrorPayload, statusCode: number) {
    super(payload.message);
    this.name = 'ApiError';
    this.status = payload.status;
    this.errorCode = payload.errorCode;
    this.statusCode = statusCode;
    this.details = payload.details;

    // Explicitly set prototype to fix inheritance issues in TS compiling ES5/ES6
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
