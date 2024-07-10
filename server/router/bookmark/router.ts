import express from 'express';

import { ROLE } from '../../constants/constants/auth';
import privilege from '../../middlewares/previlege';
import validate from '../../middlewares/validate';
import verifyUser from '../../middlewares/verifyUser';
import { AddToBookMarks, RemoveBookMark } from '../../controllers/bookmark';
import { addBookmarkInputSchema, removeBookmarkInputSchema } from './schema';

const router = express.Router();

router.post(
  '/add',
  [
    verifyUser,
    privilege([ROLE.ADMIN, ROLE.USER]),
    validate(addBookmarkInputSchema, 'BODY'),
  ],
  AddToBookMarks
);
router.post(
  '/remove',
  [
    verifyUser,
    privilege([ROLE.ADMIN, ROLE.USER]),
    validate(removeBookmarkInputSchema, 'BODY'),
  ],
  RemoveBookMark
);

export default router;
