import { AnyZodObject } from 'zod';
import express from 'express';

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
    validate(uploadFilesInputSchema as unknown as AnyZodObject, 'BODY'),
  ],
  UploadFile
);
router.post(
  '/webhook',
  [verifyUser, validate(fileUploadNotifWebhookSchema, 'BODY')],
  NotificationWebhook
);
router.put(
  '/addNames',
  [
    verifyUser,
    validate(addNamesInputSchema as unknown as AnyZodObject, 'BODY'),
  ],
  AddNameToCache
);

// TODO : create a route to get instution names for suggestions

export default router;
