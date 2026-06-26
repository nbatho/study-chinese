import { Router } from 'express';
import {
  listAchievements,
  listOcrHistory,
  scanImage,
  showOcrScan,
  showDailyContent,
  updateOcrScan,
  unlockSpecialAchievement
} from '../controllers/utility.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { ocrRateLimit } from '../middlewares/security.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/achievements', listAchievements);
router.post('/achievements/:id/unlock', unlockSpecialAchievement);
router.get('/dashboard/daily-content', showDailyContent);
router.get('/ocr/history', listOcrHistory);
router.get('/ocr/history/:id', showOcrScan);
router.patch('/ocr/history/:id', updateOcrScan);
router.post('/ocr/scan', ocrRateLimit, scanImage);

export default router;
