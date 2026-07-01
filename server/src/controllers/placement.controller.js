import { getPlacementQuestions, submitPlacementResult } from '../services/placement.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { success } from '../utils/response.js';

export const listPlacementQuestions = asyncHandler(async (_req, res) => {
  const data = await getPlacementQuestions();
  success(res, data);
});

export const submitPlacement = asyncHandler(async (req, res) => {
  const data = await submitPlacementResult(req.user.id, req.body);
  success(res, data);
});
