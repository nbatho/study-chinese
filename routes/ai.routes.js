import { Router } from 'express';
import { createMessage, createSession, listScenarios } from '../controllers/ai.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireFields } from '../middlewares/validate.middleware.js';
import { aiRateLimit } from '../middlewares/security.middleware.js';

const router = Router();

router.use(requireAuth);
router.use(aiRateLimit);

router.get('/scenarios', listScenarios);
router.post('/sessions', createSession);
router.post('/sessions/:id/messages', requireFields(['text']), createMessage);

export default router;
