import { asyncHandler } from '../utils/async-handler.js';
import { success } from '../utils/response.js';
import { enrollWord, getDueCards, reviewCard } from '../services/srs.service.js';

export const listDueCards = asyncHandler(async (req, res) => {
  const data = await getDueCards(req.user.id, req.query.limit);
  success(res, data);
});

export const submitReview = asyncHandler(async (req, res) => {
  const data = await reviewCard(req.user.id, req.body);
  success(res, data);
});

export const enrollSrsWord = asyncHandler(async (req, res) => {
  const data = await enrollWord(req.user.id, req.body.wordId);
  success(res, data);
});
