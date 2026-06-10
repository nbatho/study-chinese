import { asyncHandler } from '../utils/async-handler.js';
import { success } from '../utils/response.js';
import { searchVocabulary } from '../services/vocab.service.js';

export const listVocabulary = asyncHandler(async (req, res) => {
  const data = await searchVocabulary(req.query);
  success(res, data);
});
