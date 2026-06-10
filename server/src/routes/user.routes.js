import { Router } from 'express';
import {
  addActivity,
  getProfile,
  getStats,
  updateProfile
} from '../controllers/user.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/stats', getStats);
router.post('/activity', addActivity);

export default router;
