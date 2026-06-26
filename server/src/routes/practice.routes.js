import { Router } from 'express';
import {
  listHanziStrokes,
  listMinimalPairs,
  listShadowingPrompts,
  showPracticeCatalog,
  submitPronunciationCheck,
  submitShadowingScore
} from '../controllers/practice.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', showPracticeCatalog);
router.get('/minimal-pairs', listMinimalPairs);
router.get('/shadowing-prompts', listShadowingPrompts);
router.post('/shadowing/score', submitShadowingScore);
router.post('/pronunciation/check', submitPronunciationCheck);
router.get('/hanzi-strokes', listHanziStrokes);

export default router;

