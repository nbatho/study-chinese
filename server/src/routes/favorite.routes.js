import { Router } from 'express';
import { listFavoriteWords, toggleFavoriteWord } from '../controllers/list.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireFields } from '../middlewares/validate.middleware.js';

const router = Router();

router.get('/', requireAuth, listFavoriteWords);
router.post('/toggle', requireAuth, requireFields(['wordId']), toggleFavoriteWord);

export default router;
