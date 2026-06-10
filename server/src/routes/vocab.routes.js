import { Router } from 'express';
import { listVocabulary } from '../controllers/vocab.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', requireAuth, listVocabulary);

export default router;
