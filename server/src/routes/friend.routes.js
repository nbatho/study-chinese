import { Router } from 'express';
import { acceptRequest, createFriendRequest, deleteFriendship, getFriends } from '../controllers/friend.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', getFriends);
router.post('/request', createFriendRequest);
router.put('/:id/accept', acceptRequest);
router.delete('/:id', deleteFriendship);

export default router;
