/**
 * In-memory access token storage. The refresh token lives in an httpOnly cookie.
 * A non-sensitive marker lets the app decide whether a refresh attempt is useful.
 */

const AUTH_SESSION_MARKER = "study-chinese.auth-session";

let accessToken: string | null = null;

const getStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export const hasAuthSession = (): boolean => {
  if (accessToken) {
    return true;
  }

  try {
    return getStorage()?.getItem(AUTH_SESSION_MARKER) === "true";
  } catch {
    return false;
  }
};

export const getAccessToken = (): string | null => {
  return accessToken;
};

export const setAccessToken = (token: string): void => {
  accessToken = token;

  try {
    getStorage()?.setItem(AUTH_SESSION_MARKER, "true");
  } catch {
    // Ignore storage failures; the in-memory token still works for this tab.
  }
};

export const removeAccessToken = (): void => {
  accessToken = null;

  try {
    getStorage()?.removeItem(AUTH_SESSION_MARKER);
  } catch {
    // Ignore storage failures; clearing the in-memory token is the critical part.
  }
};
