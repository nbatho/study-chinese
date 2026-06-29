import { asyncHandler } from '../utils/async-handler.js';
import { created, success } from '../utils/response.js';
import {
  deleteAdminLesson,
  deleteAdminWord,
  getAdminSummary,
  listAdminLessons,
  listAdminReports,
  listAdminUsers,
  listAdminWords,
  listAiLogs,
  updateAdminReport,
  updateAdminUser,
  upsertAdminLesson,
  upsertAdminWord
} from '../services/admin.service.js';

export const showSummary = asyncHandler(async (req, res) => {
  success(res, await getAdminSummary());
});

export const listLessons = asyncHandler(async (req, res) => {
  success(res, await listAdminLessons(req.query));
});

export const createLesson = asyncHandler(async (req, res) => {
  created(res, await upsertAdminLesson(req.body));
});

export const updateLesson = asyncHandler(async (req, res) => {
  success(res, await upsertAdminLesson(req.body, req.params.id));
});

export const removeLesson = asyncHandler(async (req, res) => {
  success(res, await deleteAdminLesson(req.params.id));
});

export const listWords = asyncHandler(async (req, res) => {
  success(res, await listAdminWords(req.query));
});

export const createWord = asyncHandler(async (req, res) => {
  created(res, await upsertAdminWord(req.body));
});

export const updateWord = asyncHandler(async (req, res) => {
  success(res, await upsertAdminWord(req.body, req.params.id));
});

export const removeWord = asyncHandler(async (req, res) => {
  success(res, await deleteAdminWord(req.params.id));
});

export const listUsers = asyncHandler(async (req, res) => {
  success(res, await listAdminUsers(req.query));
});

export const updateUser = asyncHandler(async (req, res) => {
  success(res, await updateAdminUser(req.user.id, req.params.id, req.body));
});

export const listLogs = asyncHandler(async (req, res) => {
  success(res, await listAiLogs(req.query));
});

export const listReports = asyncHandler(async (req, res) => {
  success(res, await listAdminReports(req.query));
});

export const updateReport = asyncHandler(async (req, res) => {
  success(res, await updateAdminReport(req.user.id, req.params.id, req.body));
});
