import { asyncHandler } from '../utils/async-handler.js';
import { env, isProduction } from '../config/env.config.js';
import { created, success } from '../utils/response.js';
import { loginUser, refreshAuth, registerUser } from '../services/auth.service.js';

const REFRESH_TOKEN_COOKIE = 'refresh_token';

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/api/v1/auth',
  maxAge: env.REFRESH_TOKEN_EXPIRES_IN_SECONDS * 1000
};

const parseCookies = (cookieHeader = '') =>
  cookieHeader.split(';').reduce((cookies, item) => {
    const [rawKey, ...rawValue] = item.trim().split('=');

    if (!rawKey) {
      return cookies;
    }

    cookies[rawKey] = decodeURIComponent(rawValue.join('='));
    return cookies;
  }, {});

const getRefreshToken = (req) => parseCookies(req.headers.cookie)[REFRESH_TOKEN_COOKIE];

const attachRefreshCookie = (res, refreshToken) => {
  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, refreshCookieOptions);
};

const clearRefreshCookie = (res) => {
  res.clearCookie(REFRESH_TOKEN_COOKIE, {
    ...refreshCookieOptions,
    maxAge: undefined
  });
};

const publicAuthPayload = ({ accessToken, user }) => ({
  accessToken,
  user
});

export const register = asyncHandler(async (req, res) => {
  const data = await registerUser(req.body);
  attachRefreshCookie(res, data.refreshToken);
  created(res, publicAuthPayload(data));
});

export const login = asyncHandler(async (req, res) => {
  const data = await loginUser(req.body);
  attachRefreshCookie(res, data.refreshToken);
  success(res, publicAuthPayload(data));
});

export const refresh = asyncHandler(async (req, res) => {
  const data = await refreshAuth(getRefreshToken(req));
  attachRefreshCookie(res, data.refreshToken);
  success(res, publicAuthPayload(data));
});

export const logout = asyncHandler(async (req, res) => {
  clearRefreshCookie(res);
  success(res, null);
});
