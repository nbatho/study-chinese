import { Router } from 'express';
import {
  changePasswordHandler,
  changePasswordOtpHandler,
  deleteAccount,
  deleteAccountOtpHandler,
  forgotPassword,
  googleLogin,
  login,
  logout,
  refresh,
  register,
  resendRegistrationHandler,
  resendVerification,
  resetPasswordHandler,
  verifyEmailHandler,
  verifyRegistrationHandler
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { authSchemas, validateBody } from '../middlewares/validate.middleware.js';
import { createAuthRateLimit, requireTrustedOrigin } from '../middlewares/security.middleware.js';

const router = Router();

// Per-flow buckets: brute-force protection stays strict per flow, but one
// flow (e.g. token refreshes) can no longer lock users out of another.
const loginRateLimit = createAuthRateLimit('login');
const registerRateLimit = createAuthRateLimit('register');
const refreshRateLimit = createAuthRateLimit('refresh', 60);
const passwordRateLimit = createAuthRateLimit('password');
const accountRateLimit = createAuthRateLimit('account');

router.post('/register', registerRateLimit, requireTrustedOrigin, validateBody(authSchemas.register), register);
router.post('/register/verify', registerRateLimit, requireTrustedOrigin, validateBody(authSchemas.verifyRegistration), verifyRegistrationHandler);
router.post('/register/resend', registerRateLimit, requireTrustedOrigin, validateBody(authSchemas.forgotPassword), resendRegistrationHandler);
router.post('/login', loginRateLimit, requireTrustedOrigin, validateBody(authSchemas.login), login);
router.post('/google', loginRateLimit, requireTrustedOrigin, validateBody(authSchemas.googleLogin), googleLogin);
router.post('/refresh', refreshRateLimit, requireTrustedOrigin, refresh);
router.post('/logout', requireTrustedOrigin, logout);

router.post('/verify-email', registerRateLimit, requireTrustedOrigin, validateBody(authSchemas.verifyEmail), verifyEmailHandler);
router.post('/resend-verification', registerRateLimit, requireTrustedOrigin, requireAuth, resendVerification);
router.post('/forgot-password', passwordRateLimit, requireTrustedOrigin, validateBody(authSchemas.forgotPassword), forgotPassword);
router.post('/reset-password', passwordRateLimit, requireTrustedOrigin, validateBody(authSchemas.resetPassword), resetPasswordHandler);
router.post('/change-password/otp', passwordRateLimit, requireTrustedOrigin, requireAuth, changePasswordOtpHandler);
router.post('/change-password', passwordRateLimit, requireTrustedOrigin, requireAuth, validateBody(authSchemas.changePassword), changePasswordHandler);
router.post('/account/otp', accountRateLimit, requireTrustedOrigin, requireAuth, deleteAccountOtpHandler);
router.delete('/account', accountRateLimit, requireTrustedOrigin, requireAuth, validateBody(authSchemas.deleteAccount), deleteAccount);

export default router;
