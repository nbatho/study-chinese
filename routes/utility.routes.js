import { Router } from 'express';
import {
  listAchievements,
  scanImage,
  showDailyContent,
  unlockSpecialAchievement
} from '../controllers/utility.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { ocrRateLimit } from '../middlewares/security.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/achievements', listAchievements);
router.post('/achievements/:id/unlock', unlockSpecialAchievement);
router.get('/dashboard/daily-content', showDailyContent);
router.post('/ocr/scan', ocrRateLimit, scanImage);

export default router;
