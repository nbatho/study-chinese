import { Router } from 'express';
import {
  listRadicals,
  listTopics,
  listVocabulary,
  lookupVocabulary,
  vocabularyStats
} from '../controllers/vocab.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Public: the tap-to-lookup popover must work for signed-out learners too.
router.get('/lookup', lookupVocabulary);
router.get('/topics', requireAuth, listTopics);
router.get('/radicals', requireAuth, listRadicals);
router.get('/stats', requireAuth, vocabularyStats);
router.get('/search', requireAuth, listVocabulary);
router.get('/', requireAuth, listVocabulary);

export default router;
