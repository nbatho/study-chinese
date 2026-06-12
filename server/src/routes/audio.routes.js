import { Router } from 'express';
import { getAudio } from '../controllers/audio.controller.js';
import { audioRateLimit } from '../middlewares/security.middleware.js';

const router = Router();

router.get('/', audioRateLimit, getAudio);

export default router;
