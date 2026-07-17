export interface ApiErrorPayload {
  status: 'error' | 'fail';
  errorCode: string;
  message: string;
  details?: unknown;
}

/**
 * Custom Error class representing API validation or response errors.
 */
export class ApiError extends Error {
  status: 'error' | 'fail';
  errorCode: string;
  statusCode: number;
  details?: unknown;

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

/** Message from an unknown thrown value, or the fallback when it has none. */
export const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback;
