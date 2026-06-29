import { getFriendsLeaderboard, getLeaderboard } from '../services/leaderboard.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { success } from '../utils/response.js';

export const listLeaderboard = asyncHandler(async (req, res) => {
  const data = await getLeaderboard(req.user.id, req.query);
  success(res, data);
});

export const listFriendsLeaderboard = asyncHandler(async (req, res) => {
  const data = await getFriendsLeaderboard(req.user.id, req.query);
  success(res, data);
});
