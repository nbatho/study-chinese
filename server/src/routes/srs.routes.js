import { Router } from 'express';
import { deleteSrsCard, enrollSrsWord, listAllCards, listDueCards, submitReview } from '../controllers/srs.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireFields } from '../middlewares/validate.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/due', listDueCards);
router.get('/cards', listAllCards);
router.post('/review', requireFields(['wordId', 'quality']), submitReview);
router.post('/enroll', enrollSrsWord);
router.delete('/cards/:wordId', deleteSrsCard);

export default router;
