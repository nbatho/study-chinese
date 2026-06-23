import { asyncHandler } from '../utils/async-handler.js';
import { created, success } from '../utils/response.js';
import {
  addWordToList,
  createCustomList,
  deleteCustomList,
  getCustomLists,
  removeWordFromList,
  toggleFavorite
} from '../services/list.service.js';

export const toggleFavoriteWord = asyncHandler(async (req, res) => {
  const data = await toggleFavorite(req.user.id, req.body.wordId);
  success(res, data);
});

export const listCustomLists = asyncHandler(async (req, res) => {
  const data = await getCustomLists(req.user.id);
  success(res, data);
});

export const createList = asyncHandler(async (req, res) => {
  const data = await createCustomList(req.user.id, req.body);
  created(res, data);
});

export const deleteList = asyncHandler(async (req, res) => {
  const data = await deleteCustomList(req.user.id, req.params.id);
  success(res, data);
});

export const addListWord = asyncHandler(async (req, res) => {
  const data = await addWordToList(req.user.id, req.params.id, req.body);
  success(res, data);
});

export const removeListWord = asyncHandler(async (req, res) => {
  const data = await removeWordFromList(req.user.id, req.params.id, req.params.wordId);
  success(res, data);
});
