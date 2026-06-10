import { asyncHandler } from '../utils/async-handler.js';
import { created, success } from '../utils/response.js';
import { getChatScenarios, sendChatMessage, startChatSession } from '../services/ai.service.js';

export const listScenarios = asyncHandler(async (req, res) => {
  const data = await getChatScenarios();
  success(res, data);
});

export const createSession = asyncHandler(async (req, res) => {
  const data = await startChatSession(req.user.id, req.body);
  created(res, data);
});

export const createMessage = asyncHandler(async (req, res) => {
  const data = await sendChatMessage(req.user.id, req.params.id, req.body);
  success(res, data);
});
