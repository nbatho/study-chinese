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

// requireAuth is attached per route (not router.use) so unknown paths under
// /api/v1 fall through to the 404 handler instead of returning 401.
router.get('/achievements', requireAuth, listAchievements);
router.post('/achievements/:id/unlock', requireAuth, unlockSpecialAchievement);
router.get('/dashboard/daily-content', requireAuth, showDailyContent);
router.get('/ocr/history', requireAuth, listOcrHistory);
router.delete('/ocr/history', requireAuth, clearOcrScanHistory);
router.get('/ocr/history/:id', requireAuth, showOcrScan);
router.patch('/ocr/history/:id', requireAuth, updateOcrScan);
router.delete('/ocr/history/:id', requireAuth, deleteOcrScanHistory);
router.post('/ocr/scan', requireAuth, ocrRateLimit, scanImage);

export default router;
