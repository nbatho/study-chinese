import { Router } from 'express';
import {
  createLesson,
  createWord,
  listLessons,
  listLogs,
  listReports,
  listUsers,
  listWords,
  removeLesson,
  removeWord,
  showSummary,
  updateLesson,
  updateReport,
  updateUser,
  updateWord
} from '../controllers/admin.controller.js';
import { requireAdmin, requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get('/summary', showSummary);
router.get('/lessons', listLessons);
router.post('/lessons', createLesson);
router.patch('/lessons/:id', updateLesson);
router.delete('/lessons/:id', removeLesson);
router.get('/words', listWords);
router.post('/words', createWord);
router.patch('/words/:id', updateWord);
router.delete('/words/:id', removeWord);
router.get('/users', listUsers);
router.patch('/users/:id', updateUser);
router.get('/ai-logs', listLogs);
router.get('/reports', listReports);
router.patch('/reports/:id', updateReport);

export default router;
