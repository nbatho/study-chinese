import { asyncHandler } from '../utils/async-handler.js';
import { success } from '../utils/response.js';
import {
  getHanziStrokes,
  getMinimalPairs,
  getPracticeCatalog,
  getShadowingPrompts,
  scoreShadowing
} from '../services/practice.service.js';

export const showPracticeCatalog = asyncHandler(async (req, res) => {
  const data = await getPracticeCatalog();
  success(res, data);
});

export const listMinimalPairs = asyncHandler(async (req, res) => {
  const data = await getMinimalPairs();
  success(res, data);
});

export const listShadowingPrompts = asyncHandler(async (req, res) => {
  const data = await getShadowingPrompts();
  success(res, data);
});

export const listHanziStrokes = asyncHandler(async (req, res) => {
  const data = await getHanziStrokes();
  success(res, data);
});

export const submitShadowingScore = asyncHandler(async (req, res) => {
  const data = await scoreShadowing(req.body);
  success(res, data);
});
