import { asyncHandler } from '../utils/async-handler.js';
import { success } from '../utils/response.js';
import { enrollWord, getAllCards, getDueCards, reviewCard, unenrollWord } from '../services/srs.service.js';

export const listDueCards = asyncHandler(async (req, res) => {
  const data = await getDueCards(req.user.id, req.query.limit, req.query.locale);
  success(res, data);
});

export const listAllCards = asyncHandler(async (req, res) => {
  const data = await getAllCards(req.user.id, req.query.locale);
  success(res, data);
});

export const submitReview = asyncHandler(async (req, res) => {
  const data = await reviewCard(req.user.id, req.body);
  success(res, data);
});

export const enrollSrsWord = asyncHandler(async (req, res) => {
  const data = await enrollWord(req.user.id, req.body);
  success(res, data);
});

export const deleteSrsCard = asyncHandler(async (req, res) => {
  const data = await unenrollWord(req.user.id, req.params.wordId);
  success(res, data);
});
