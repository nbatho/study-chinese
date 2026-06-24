import { asyncHandler } from '../utils/async-handler.js';
import { success } from '../utils/response.js';
import {
  getAchievements,
  getDailyContent,
  getOcrHistory,
  scanOcr,
  unlockAchievement
} from '../services/utility.service.js';

export const listAchievements = asyncHandler(async (req, res) => {
  const data = await getAchievements(req.user.id);
  success(res, data);
});

export const unlockSpecialAchievement = asyncHandler(async (req, res) => {
  const data = await unlockAchievement(req.user.id, req.params.id);
  success(res, data);
});

export const showDailyContent = asyncHandler(async (req, res) => {
  const data = await getDailyContent();
  success(res, data);
});

export const scanImage = asyncHandler(async (req, res) => {
  const data = await scanOcr(req.user.id, req.body);
  success(res, data);
});

export const listOcrHistory = asyncHandler(async (req, res) => {
  const data = await getOcrHistory(req.user.id, req.query);
  success(res, data);
});
