/* eslint-disable indent */
import mongoose from 'mongoose';
import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { MAIL_EVENT_NAME } from '../../constants/constants/shared';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import redisClient from '../../config/redisConfig';
import sendMail from '../../utils/emails/sendMail';
import { takeActionInputSchema } from '../../router/report/schema';
import {
  ERROR_CODES,
  SERVER_ERROR,
  SUCCESS_CODES,
} from '../../constants/statusCode';
import {
  getEmailPayload,
  readDBPromises,
  writeDBPromises,
} from '../../utils/report/getter';

const TakeAction = asyncErrorHandler(async (req: Request, res: Response) => {
  const { userId: adminId } = req.body as { userId: string };
  const { reportId, postId, contentType, action } = req.body.data as z.infer<
    typeof takeActionInputSchema
  >;
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    const folderId = (
      contentType === 'POST' ? await readDBPromises({ postId }) : undefined
    ) as string | undefined;
    const [isReportMarked, isContentFlagChanged] = await Promise.all(
      writeDBPromises({
        action,
        contentType,
        reportId,
        session,
        postId,
        adminId,
        folderId,
      })
    );
    if (
      isReportMarked === null ||
      (action !== 'MARK AS SPAM' && isContentFlagChanged === null)
    ) {
      await session.abortTransaction();
      throw new ErrorHandler(
        'No document found matching the specified id',
        ERROR_CODES['NOT FOUND']
      );
    }
    if (action === 'FLAG') {
      if (redisClient === null) {
        await session.abortTransaction();
        throw new ErrorHandler(
          'Something went wrong. Please try again later',
          SERVER_ERROR['INTERNAL SERVER ERROR']
        );
      }
      const emailPayload = getEmailPayload(isContentFlagChanged, contentType);
      const jobPromises: any[] =
        emailPayload !== null
          ? [
              sendMail({
                eventName: MAIL_EVENT_NAME,
                payload: emailPayload,
              }),
            ]
          : [];
      if (contentType === 'POST') {
        jobPromises.push(redisClient.del(`post:${postId}`));
      }
      await Promise.all(jobPromises);
    }
  });
  await session.endSession();
  return res
    .status(SUCCESS_CODES['NO CONTENT'])
    .json({ message: 'Marked resolved' });
});

export default TakeAction;
