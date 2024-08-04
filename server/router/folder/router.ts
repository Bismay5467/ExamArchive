import express from 'express';

import { ROLE } from '../../constants/constants/auth';
import privilege from '../../middlewares/previlege';
import validate from '../../middlewares/validate';
import verifyUser from '../../middlewares/verifyUser';
import {
  CreateFolder,
  DeleteFolder,
  GetFiles,
  GetFolderNames,
  GetPinnedFiles,
  PinFile,
  RenameFolder,
} from '../../controllers/folders';
import {
  createFolderInputSchema,
  deleteFolderInputSchema,
  getFilesInputSchema,
  getFolderNamesSchema,
  pinFileSchema,
  renameFolderSchema,
} from './schema';

const router = express.Router();

router.post(
  '/create',
  [
    verifyUser,
    privilege([ROLE.ADMIN, ROLE.USER]),
    validate(createFolderInputSchema, 'BODY'),
  ],
  CreateFolder
);
router.get(
  '/get',
  [
    verifyUser,
    privilege([ROLE.ADMIN, ROLE.USER]),
    validate(getFilesInputSchema, 'QUERY'),
  ],
  GetFiles
);
router.get('/getPinFiles', verifyUser, GetPinnedFiles);
router.put('/pinFile', [verifyUser, validate(pinFileSchema, 'BODY')], PinFile);
router.get(
  '/getFolderNames',
  [
    verifyUser,
    privilege([ROLE.ADMIN, ROLE.USER]),
    validate(getFolderNamesSchema, 'QUERY'),
  ],
  GetFolderNames
);
router.put(
  '/rename',
  [
    verifyUser,
    privilege([ROLE.ADMIN, ROLE.USER]),
    validate(renameFolderSchema, 'BODY'),
  ],
  RenameFolder
);
router.delete(
  '/delete',
  [
    verifyUser,
    privilege([ROLE.ADMIN, ROLE.USER]),
    validate(deleteFolderInputSchema, 'BODY'),
  ],
  DeleteFolder
);

export default router;
