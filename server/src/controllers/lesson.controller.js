import { asyncHandler } from '../utils/async-handler.js';
import { success } from '../utils/response.js';
import {
  completeLesson,
  getDialogue,
  getLessonGrammarIndex,
  getLessonDetails,
  getLessonModules,
  getLessons,
  getPublicLessonDetails,
  getReadingPassage,
  getSampleLessons
} from '../services/lesson.service.js';
import { createCourseIssueReport } from '../services/report.service.js';

export const listLessons = asyncHandler(async (req, res) => {
  const data = await getLessons(req.user.id, req.query);
  success(res, data);
});

export const listLessonGrammar = asyncHandler(async (req, res) => {
  const data = await getLessonGrammarIndex(req.user.id, req.query.locale);
  success(res, data);
});

export const showLesson = asyncHandler(async (req, res) => {
  const data = await getLessonDetails(req.params.id, req.query.locale);
  success(res, data);
});

export const listSampleLessons = asyncHandler(async (req, res) => {
  const data = await getSampleLessons(req.query.locale);
  success(res, data);
});

export const showPublicLesson = asyncHandler(async (req, res) => {
  const data = await getPublicLessonDetails(req.params.id, req.query.locale);
  success(res, data);
});

export const listLessonModules = asyncHandler(async (req, res) => {
  const data = await getLessonModules(req.params.id);
  success(res, data);
});

export const showDialogue = asyncHandler(async (req, res) => {
  const data = await getDialogue(req.params.id);
  success(res, data);
});

export const showReadingPassage = asyncHandler(async (req, res) => {
  const data = await getReadingPassage(req.params.id);
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
