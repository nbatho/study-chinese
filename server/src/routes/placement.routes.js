import { Router } from 'express';
import { listPlacementQuestions, submitPlacement } from '../controllers/placement.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireFields } from '../middlewares/validate.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/questions', listPlacementQuestions);
router.post('/submit', requireFields(['cefrLevel', 'score']), submitPlacement);

export default router;
