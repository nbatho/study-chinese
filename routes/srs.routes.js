import { Router } from 'express';
import { enrollSrsWord, listDueCards, submitReview } from '../controllers/srs.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireFields } from '../middlewares/validate.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/due', listDueCards);
router.post('/review', requireFields(['wordId', 'quality']), submitReview);
router.post('/enroll', enrollSrsWord);

export default router;
