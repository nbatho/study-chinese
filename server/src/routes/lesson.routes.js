import { Router } from 'express';
import {
  listLessons,
  reportLessonIssue,
  showLesson,
  submitLessonCompletion
} from '../controllers/lesson.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireFields } from '../middlewares/validate.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', listLessons);
router.get('/:id', showLesson);
router.post('/:id/complete', requireFields(['accuracy']), submitLessonCompletion);
router.post('/:id/reports', requireFields(['category', 'message']), reportLessonIssue);

export default router;
