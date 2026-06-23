import { Router } from 'express';
import { toggleFavoriteWord } from '../controllers/list.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireFields } from '../middlewares/validate.middleware.js';

const router = Router();

router.post('/toggle', requireAuth, requireFields(['wordId']), toggleFavoriteWord);

export default router;
