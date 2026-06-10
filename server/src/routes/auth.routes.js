import { Router } from 'express';
import { login, logout, refresh, register } from '../controllers/auth.controller.js';
import { requireFields } from '../middlewares/validate.middleware.js';

const router = Router();

router.post('/register', requireFields(['email', 'password']), register);
router.post('/login', requireFields(['email', 'password']), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
