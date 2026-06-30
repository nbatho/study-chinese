/**
 * In-memory access token storage. The refresh token lives in an httpOnly cookie,
 * so a page reload can safely restore auth through /auth/refresh.
 */

let accessToken: string | null = null;

export const getAccessToken = (): string | null => {
  return accessToken;
};

export const setAccessToken = (token: string): void => {
  accessToken = token;
};

export const removeAccessToken = (): void => {
  accessToken = null;
};
