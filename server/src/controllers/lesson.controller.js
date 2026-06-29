import { asyncHandler } from '../utils/async-handler.js';
import { success } from '../utils/response.js';
import { completeLesson, getLessonDetails, getLessons } from '../services/lesson.service.js';
import { createCourseIssueReport } from '../services/report.service.js';

export const listLessons = asyncHandler(async (req, res) => {
  const data = await getLessons(req.user.id);
  success(res, data);
});

export const showLesson = asyncHandler(async (req, res) => {
  const data = await getLessonDetails(req.params.id);
  success(res, data);
});

export const submitLessonCompletion = asyncHandler(async (req, res) => {
  const data = await completeLesson(req.user.id, req.params.id, req.body);
  success(res, data);
});

export const reportLessonIssue = asyncHandler(async (req, res) => {
  const data = await createCourseIssueReport(req.user.id, req.params.id, req.body);
  success(res, data);
});
