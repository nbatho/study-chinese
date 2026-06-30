import { asyncHandler } from '../utils/async-handler.js';
import { success } from '../utils/response.js';
import {
  addUserActivity,
  buyUserShopItem,
  createUserMistake,
  getUserShop,
  getTodayPlan,
  getUserMistakes,
  getUserProfile,
  getUserStats,
  recordMistakePractice,
  updateUserProfile
} from '../services/user.service.js';

export const getProfile = asyncHandler(async (req, res) => {
  const data = await getUserProfile(req.user.id);
  success(res, data);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const data = await updateUserProfile(req.user.id, req.body);
  success(res, data);
});

export const getStats = asyncHandler(async (req, res) => {
  const data = await getUserStats(req.user.id, req.query.days);
  success(res, data);
});

export const showTodayPlan = asyncHandler(async (req, res) => {
  const data = await getTodayPlan(req.user.id);
  success(res, data);
});

export const addActivity = asyncHandler(async (req, res) => {
  const data = await addUserActivity(req.user.id, req.body);
  success(res, data);
});

export const showShop = asyncHandler(async (req, res) => {
  const data = await getUserShop(req.user.id);
  success(res, data);
});

export const buyShopItem = asyncHandler(async (req, res) => {
  const data = await buyUserShopItem(req.user.id, req.params.itemId);
  success(res, data);
});

export const listMistakes = asyncHandler(async (req, res) => {
  const data = await getUserMistakes(req.user.id, req.query);
  success(res, data);
});

export const createMistake = asyncHandler(async (req, res) => {
  const data = await createUserMistake(req.user.id, req.body);
  success(res, data);
});

export const submitMistakePractice = asyncHandler(async (req, res) => {
  const data = await recordMistakePractice(req.user.id, req.params.id, req.body);
  success(res, data);
});
