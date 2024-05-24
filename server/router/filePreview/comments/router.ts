import express from 'express';

import validate from '../../../middlewares/validate';
import verifyUser from '../../../middlewares/verifyUser';
import {
  DeleteComment,
  EditComment,
  GetComments,
  PostComment,
  ReactOnComments,
} from '../../../controllers/filePreview';
import {
  deleteCommentInputSchema,
  editCommentInputSchema,
  getCommentsInputSchema,
  postCommentsInputSchema,
  reactCommentInputSchema,
} from './schema';

const router = express.Router();

router.get('/get', validate(getCommentsInputSchema, 'QUERY'), GetComments);
router.post(
  '/post',
  [verifyUser, validate(postCommentsInputSchema, 'BODY')],
  PostComment
);
router.put(
  '/edit',
  [verifyUser, validate(editCommentInputSchema, 'BODY')],
  EditComment
);
router.delete(
  '/delete',
  [verifyUser, validate(deleteCommentInputSchema, 'BODY')],
  DeleteComment
);
router.post(
  '/react',
  [verifyUser, validate(reactCommentInputSchema, 'BODY')],
  ReactOnComments
);

export default router;
