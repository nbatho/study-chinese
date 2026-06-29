import { Router } from 'express';
import { listFriendsLeaderboard, listLeaderboard } from '../controllers/leaderboard.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', listLeaderboard);
router.get('/friends', listFriendsLeaderboard);

export default router;
