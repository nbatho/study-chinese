import { Router } from 'express';
import {
  listRadicals,
  listTopics,
  listVocabulary,
  vocabularyStats
} from '../controllers/vocab.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/topics', requireAuth, listTopics);
router.get('/radicals', requireAuth, listRadicals);
router.get('/stats', requireAuth, vocabularyStats);
router.get('/search', requireAuth, listVocabulary);
router.get('/', requireAuth, listVocabulary);

export default router;
