import { Router } from 'express';
import {
  clearOcrScanHistory,
  deleteOcrScanHistory,
  listAchievements,
  listOcrHistory,
  scanImage,
  showOcrScan,
  showDailyContent,
  translateText,
  updateOcrScan,
  unlockSpecialAchievement
} from '../controllers/utility.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { ocrRateLimit } from '../middlewares/security.middleware.js';

const router = Router();

// Public: text-only translation works without an account (no history saved).
router.post('/ocr/translate', ocrRateLimit, translateText);

router.use(requireAuth);

router.get('/achievements', listAchievements);
router.post('/achievements/:id/unlock', unlockSpecialAchievement);
router.get('/dashboard/daily-content', showDailyContent);
router.get('/ocr/history', listOcrHistory);
router.delete('/ocr/history', clearOcrScanHistory);
router.get('/ocr/history/:id', showOcrScan);
router.patch('/ocr/history/:id', updateOcrScan);
router.delete('/ocr/history/:id', deleteOcrScanHistory);
router.post('/ocr/scan', ocrRateLimit, scanImage);

export default router;
