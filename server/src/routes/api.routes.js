import { Router } from 'express';
import { getWordsList, getUserProfile } from '../controllers/api.controller.js';
import { checkAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Public route to get vocabulary list
router.get('/words', getWordsList);

// Protected route to get user profile
router.get('/profile', checkAuth, getUserProfile);

export default router;
