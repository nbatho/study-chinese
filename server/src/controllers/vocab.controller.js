import { asyncHandler } from '../utils/async-handler.js';
import { success } from '../utils/response.js';
import {
  getVocabularyStats,
  listVocabularyRadicals,
  listVocabularyTopics,
  searchVocabulary
} from '../services/vocab.service.js';

export const listVocabulary = asyncHandler(async (req, res) => {
  const data = await searchVocabulary(req.query);
  success(res, data);
});

export const listTopics = asyncHandler(async (_req, res) => {
  const data = await listVocabularyTopics();
  success(res, data);
});

export const listRadicals = asyncHandler(async (_req, res) => {
  const data = await listVocabularyRadicals();
  success(res, data);
});

export const vocabularyStats = asyncHandler(async (_req, res) => {
  const data = await getVocabularyStats();
  success(res, data);
});
