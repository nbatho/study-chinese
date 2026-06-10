import { asyncHandler } from '../utils/async-handler.js';
import { created, success } from '../utils/response.js';
import { loginUser, registerUser } from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const data = await registerUser(req.body);
  created(res, data);
});

export const login = asyncHandler(async (req, res) => {
  const data = await loginUser(req.body);
  success(res, data);
});

export const logout = asyncHandler(async (req, res) => {
  success(res, null);
});
