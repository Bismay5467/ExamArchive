import express from 'express';

import validate from '../../../middlewares/validate';
import verifyUser from '../../../middlewares/verifyUser';
import {
  DeleteFile,
  DownloadCount,
  EditTags,
  GetFile,
  UpdateRating,
  ViewCount,
} from '../../../controllers/filePreview';
import {
  deleteFileInputSchema,
  editTagsInputSchema,
  getFileInputSchema,
  ratingInputSchema,
  updateDownloadCountInputSchema,
  updateViewCountInputSchema,
} from './schema';

const router = express.Router();

router.get('/get/:postId', validate(getFileInputSchema, 'PARAMS'), GetFile);
router.delete(
  '/delete',
  [verifyUser, validate(deleteFileInputSchema, 'BODY')],
  DeleteFile
);
router.put(
  '/editTags',
  [verifyUser, validate(editTagsInputSchema, 'BODY')],
  EditTags
);
router.put(
  '/downloadCount',
  [verifyUser, validate(updateDownloadCountInputSchema, 'BODY')],
  DownloadCount
);
router.put(
  '/viewCount',
  [verifyUser, validate(updateViewCountInputSchema, 'BODY')],
  ViewCount
);
router.put(
  '/rating',
  [verifyUser, validate(ratingInputSchema, 'BODY')],
  UpdateRating
);

export default router;
