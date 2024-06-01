import express from 'express';

import validate from '../../middlewares/validate';
import verifyUser from '../../middlewares/verifyUser';
import {
  CreateFolder,
  DeleteFolder,
  GetFiles,
  GetFolderNames,
} from '../../controllers/folders';
import {
  createFolderInputSchema,
  deleteFolderInputSchema,
  getFilesInputSchema,
  getFolderNamesSchema,
} from './schema';

const router = express.Router();

router.post(
  '/create',
  [verifyUser, validate(createFolderInputSchema, 'BODY')],
  CreateFolder
);
router.get(
  '/get',
  [verifyUser, validate(getFilesInputSchema, 'QUERY')],
  GetFiles
);
router.get(
  '/getFolderNames',
  [verifyUser, validate(getFolderNamesSchema, 'QUERY')],
  GetFolderNames
);
router.delete(
  '/delete',
  [verifyUser, validate(deleteFolderInputSchema, 'BODY')],
  DeleteFolder
);

export default router;
