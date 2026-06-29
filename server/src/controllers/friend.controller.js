import { acceptFriendRequest, listFriends, removeFriendship, sendFriendRequest } from '../services/friend.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { created, success } from '../utils/response.js';

export const getFriends = asyncHandler(async (req, res) => {
  const data = await listFriends(req.user.id);
  success(res, data);
});

export const createFriendRequest = asyncHandler(async (req, res) => {
  const data = await sendFriendRequest(req.user.id, req.body);
  created(res, data);
});

export const acceptRequest = asyncHandler(async (req, res) => {
  const data = await acceptFriendRequest(req.user.id, req.params.id);
  success(res, data);
});

export const deleteFriendship = asyncHandler(async (req, res) => {
  const data = await removeFriendship(req.user.id, req.params.id);
  success(res, data);
});
