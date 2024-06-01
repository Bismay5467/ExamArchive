import express from 'express';

import validate from '../../middlewares/validate';
import verifyUser from '../../middlewares/verifyUser';
import { AddToBookMarks, RemoveBookMark } from '../../controllers/bookmark';
import { addBookmarkInputSchema, removeBookmarkInputSchema } from './schema';

const router = express.Router();

router.post(
  '/add',
  [verifyUser, validate(addBookmarkInputSchema, 'BODY')],
  AddToBookMarks
);
router.post(
  '/remove',
  [verifyUser, validate(removeBookmarkInputSchema, 'BODY')],
  RemoveBookMark
);

export default router;
