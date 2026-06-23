import { Router } from 'express';
import { login, logout, refresh, register } from '../controllers/auth.controller.js';
import { authSchemas, validateBody } from '../middlewares/validate.middleware.js';
import { authRateLimit } from '../middlewares/security.middleware.js';

const router = Router();

router.post('/register', authRateLimit, validateBody(authSchemas.register), register);
router.post('/login', authRateLimit, validateBody(authSchemas.login), login);
router.post('/refresh', authRateLimit, refresh);
router.post('/logout', logout);

export default router;
