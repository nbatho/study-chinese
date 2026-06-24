import { Router } from 'express';
import {
  addActivity,
  createMistake,
  getProfile,
  getStats,
  listMistakes,
  showTodayPlan,
  submitMistakePractice,
  updateProfile
} from '../controllers/user.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireFields } from '../middlewares/validate.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/stats', getStats);
router.get('/today-plan', showTodayPlan);
router.get('/mistakes', listMistakes);
router.post('/mistakes', requireFields(['skill']), createMistake);
router.post('/mistakes/:id/practice', submitMistakePractice);
router.post('/activity', addActivity);

export default router;
