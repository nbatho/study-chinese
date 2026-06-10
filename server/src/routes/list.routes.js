import { Router } from 'express';
import {
  addListWord,
  createList,
  deleteList,
  listCustomLists,
  removeListWord
} from '../controllers/list.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireFields } from '../middlewares/validate.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', listCustomLists);
router.post('/', requireFields(['name']), createList);
router.delete('/:id', deleteList);
router.post('/:id/words', requireFields(['wordId']), addListWord);
router.delete('/:id/words/:wordId', removeListWord);

export default router;
