import { AnyZodObject } from 'zod';
import express from 'express';

import { adminPrevilege } from '../../middlewares/previlege';
import validate from '../../middlewares/validate';
import verifyUser from '../../middlewares/verifyUser';
import {
  AddNameToCache,
  NotificationWebhook,
  UploadFile,
} from '../../controllers/upload';
import {
  addNamesInputSchema,
  fileUploadNotifWebhookSchema,
  uploadFilesInputSchema,
} from './schema';

const router = express.Router();

router.post(
  '/',
  [
    verifyUser,
    adminPrevilege,
    validate(uploadFilesInputSchema as unknown as AnyZodObject, 'BODY'),
  ],
  UploadFile
);
router.post(
  '/webhook',
  [verifyUser, adminPrevilege, validate(fileUploadNotifWebhookSchema, 'BODY')],
  NotificationWebhook
);
router.put(
  '/addNames',
  [
    verifyUser,
    adminPrevilege,
    validate(addNamesInputSchema as unknown as AnyZodObject, 'BODY'),
  ],
  AddNameToCache
);

// TODO : create a route to get instution names for suggestions

export default router;
