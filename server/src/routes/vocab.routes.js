import { Router } from 'express';
import {
  listRadicals,
  listTopics,
  listVocabulary,
  vocabularyStats
} from '../controllers/vocab.controller.js';

const router = Router();

// Dictionary/vocabulary lookup is public reference content (no user data), so
// it stays browsable without an account. Personalized features (word lists,
// favorites, SRS) live on their own authenticated routes.
router.get('/topics', listTopics);
router.get('/radicals', listRadicals);
router.get('/stats', vocabularyStats);
router.get('/search', listVocabulary);
router.get('/', listVocabulary);

export default router;
