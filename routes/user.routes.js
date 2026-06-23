import { Router } from 'express';
import {
  addActivity,
  getProfile,
  getStats,
  listMistakes,
  submitMistakePractice,
  updateProfile
} from '../controllers/user.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/stats', getStats);
router.get('/mistakes', listMistakes);
router.post('/mistakes/:id/practice', submitMistakePractice);
router.post('/activity', addActivity);

export default router;
