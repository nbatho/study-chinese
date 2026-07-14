import { Router } from 'express';
import {
  listLessonGrammar,
  listLessonModules,
  listLessons,
  listSampleLessons,
  reportLessonIssue,
  showLesson,
  showPublicLesson,
  submitLessonCompletion
} from '../controllers/lesson.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireFields } from '../middlewares/validate.middleware.js';

const router = Router();

// Public HSK1 trial (no account needed). Declared before requireAuth and before
// the '/:id' route so these paths aren't treated as lesson ids.
router.get('/sample-list', listSampleLessons);
router.get('/public/:id', showPublicLesson);

router.use(requireAuth);

router.get('/', listLessons);
router.get('/grammar', listLessonGrammar);
router.get('/:id/modules', listLessonModules);
router.get('/:id', showLesson);
router.post('/:id/complete', requireFields(['accuracy']), submitLessonCompletion);
router.post('/:id/reports', requireFields(['category', 'message']), reportLessonIssue);

export default router;
