import { Router } from 'express';
import { login, logout, register } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireFields } from '../middlewares/validate.middleware.js';

const router = Router();

router.post('/register', requireFields(['email', 'password']), register);
router.post('/login', requireFields(['email', 'password']), login);
router.post('/logout', requireAuth, logout);

export default router;
