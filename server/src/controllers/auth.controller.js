import { asyncHandler } from '../utils/async-handler.js';
import { env, isProduction } from '../config/env.config.js';
import { created, success } from '../utils/response.js';
import {
  changePassword,
  deleteUserAccount,
  loginUser,
  loginWithGoogle,
  refreshAuth,
  registerUser,
  requestChangePasswordOtp,
  requestDeleteAccountOtp,
  requestPasswordReset,
  resendRegistrationOtp,
  resendVerificationEmail,
  resetPassword,
  revokeRefreshToken,
  verifyEmail,
  verifyRegistration
} from '../services/auth.service.js';

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
  // No account exists yet — the client must confirm the emailed OTP to finish signing up.
  created(res, data);
});

export const verifyRegistrationHandler = asyncHandler(async (req, res) => {
  const data = await verifyRegistration(req.body.email, req.body.otp);
  attachRefreshCookie(res, data.refreshToken);
  created(res, publicAuthPayload(data));
});

export const resendRegistrationHandler = asyncHandler(async (req, res) => {
  const data = await resendRegistrationOtp(req.body.email);
  success(res, data);
});

export const login = asyncHandler(async (req, res) => {
  const data = await loginUser(req.body);
  attachRefreshCookie(res, data.refreshToken);
  success(res, publicAuthPayload(data));
});

export const googleLogin = asyncHandler(async (req, res) => {
  const data = await loginWithGoogle(req.body.credential);
  attachRefreshCookie(res, data.refreshToken);
  success(res, { ...publicAuthPayload(data), isNewUser: data.isNewUser });
});

export const refresh = asyncHandler(async (req, res) => {
  const data = await refreshAuth(getRefreshToken(req));
  attachRefreshCookie(res, data.refreshToken);
  success(res, publicAuthPayload(data));
});

export const logout = asyncHandler(async (req, res) => {
  await revokeRefreshToken(getRefreshToken(req));
  clearRefreshCookie(res);
  success(res, null);
});

export const verifyEmailHandler = asyncHandler(async (req, res) => {
  const data = await verifyEmail(req.body.token);
  success(res, data);
});

export const resendVerification = asyncHandler(async (req, res) => {
  const data = await resendVerificationEmail(req.user.id);
  success(res, data);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const data = await requestPasswordReset(req.body.email);
  success(res, data);
});

export const resetPasswordHandler = asyncHandler(async (req, res) => {
  const data = await resetPassword(req.body.email, req.body.otp, req.body.password);
  success(res, data);
});

export const changePasswordOtpHandler = asyncHandler(async (req, res) => {
  const data = await requestChangePasswordOtp(req.user.id);
  success(res, data);
});

export const changePasswordHandler = asyncHandler(async (req, res) => {
  const data = await changePassword(
    req.user.id,
    req.body.currentPassword,
    req.body.newPassword,
    req.body.otp
  );
  attachRefreshCookie(res, data.refreshToken);
  success(res, publicAuthPayload(data));
});

export const deleteAccountOtpHandler = asyncHandler(async (req, res) => {
  const data = await requestDeleteAccountOtp(req.user.id);
  success(res, data);
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await deleteUserAccount(req.user.id, req.body?.otp);
  clearRefreshCookie(res);
  success(res, null);
});
