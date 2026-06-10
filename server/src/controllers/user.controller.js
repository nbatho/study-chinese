import { asyncHandler } from '../utils/async-handler.js';
import { success } from '../utils/response.js';
import {
  addUserActivity,
  getUserProfile,
  getUserStats,
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

export const addActivity = asyncHandler(async (req, res) => {
  const data = await addUserActivity(req.user.id, req.body);
  success(res, data);
});
