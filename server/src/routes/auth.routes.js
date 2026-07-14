import { Router } from 'express';
import { login, logout, refresh, register } from '../controllers/auth.controller.js';
import { authSchemas, validateBody } from '../middlewares/validate.middleware.js';
import { authRateLimit, requireTrustedOrigin } from '../middlewares/security.middleware.js';

const router = Router();

router.post('/register', authRateLimit, requireTrustedOrigin, validateBody(authSchemas.register), register);
router.post('/login', authRateLimit, requireTrustedOrigin, validateBody(authSchemas.login), login);
router.post('/refresh', authRateLimit, requireTrustedOrigin, refresh);
router.post('/logout', requireTrustedOrigin, logout);

export default router;
