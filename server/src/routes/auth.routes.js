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
import { authRateLimit, requireTrustedOrigin } from '../middlewares/security.middleware.js';

const router = Router();

router.post('/register', authRateLimit, requireTrustedOrigin, validateBody(authSchemas.register), register);
router.post('/register/verify', authRateLimit, requireTrustedOrigin, validateBody(authSchemas.verifyRegistration), verifyRegistrationHandler);
router.post('/register/resend', authRateLimit, requireTrustedOrigin, validateBody(authSchemas.forgotPassword), resendRegistrationHandler);
router.post('/login', authRateLimit, requireTrustedOrigin, validateBody(authSchemas.login), login);
router.post('/google', authRateLimit, requireTrustedOrigin, validateBody(authSchemas.googleLogin), googleLogin);
router.post('/refresh', authRateLimit, requireTrustedOrigin, refresh);
router.post('/logout', requireTrustedOrigin, logout);

router.post('/verify-email', authRateLimit, requireTrustedOrigin, validateBody(authSchemas.verifyEmail), verifyEmailHandler);
router.post('/resend-verification', authRateLimit, requireTrustedOrigin, requireAuth, resendVerification);
router.post('/forgot-password', authRateLimit, requireTrustedOrigin, validateBody(authSchemas.forgotPassword), forgotPassword);
router.post('/reset-password', authRateLimit, requireTrustedOrigin, validateBody(authSchemas.resetPassword), resetPasswordHandler);
router.post('/change-password/otp', authRateLimit, requireTrustedOrigin, requireAuth, changePasswordOtpHandler);
router.post('/change-password', authRateLimit, requireTrustedOrigin, requireAuth, validateBody(authSchemas.changePassword), changePasswordHandler);
router.post('/account/otp', authRateLimit, requireTrustedOrigin, requireAuth, deleteAccountOtpHandler);
router.delete('/account', authRateLimit, requireTrustedOrigin, requireAuth, validateBody(authSchemas.deleteAccount), deleteAccount);

export default router;
