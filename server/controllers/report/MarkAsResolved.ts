/* eslint-disable indent */
import mongoose from 'mongoose';
import { render } from '@react-email/render';
import { z } from 'zod';
import { Request, Response } from 'express';

import ContentTakeDownEmail from '../../emails/ContentTakeDown';
import { ErrorHandler } from '../../utils/errors/errorHandler';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import { markAsResolvedInputSchema } from '../../router/report/schema';
import redisClient from '../../config/redisConfig';
import sendMail from '../../utils/emails/sendMail';
import { Comment, Question, Report } from '../../models';
import {
  ERROR_CODES,
  SERVER_ERROR,
  SUCCESS_CODES,
} from '../../constants/statusCode';
import {
  MAIL_EVENT_NAME,
  MONGO_WRITE_QUERY_TIMEOUT,
} from '../../constants/constants/shared';

const getEmailPayload = (data: any, contentType: 'COMMENT' | 'POST') => {
  if (contentType === 'POST') {
    const {
      uploadedBy,
      file: { url },
    } = data;
    if (!uploadedBy) return null;
    const { username, email } = uploadedBy;
    const emailHTML = render(
      ContentTakeDownEmail({ userFirstname: username, fileLink: url }),
      { pretty: true }
    );
    return { to: [email], subject: 'Your post was reported', html: emailHTML };
  }
  const { _id, userId, postId, message } = data;
  if (!userId) return null;
  const { username, email } = userId;
  const postLink = `${process.env.DOMAIN_URL}/filePreview/${postId}#${_id.toString()}`;
  const emailHTML = render(
    ContentTakeDownEmail({
      userFirstname: username,
      comment: { message, postLink },
    }),
    { pretty: true }
  );
  return { to: [email], subject: 'Your post was reported', html: emailHTML };
};

const MarkAsResolved = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { userId: adminId } = req.body as { userId: string };
    const { reportId, postId, contentType } = req.body.data as z.infer<
      typeof markAsResolvedInputSchema
    >;
    const Collection: any = contentType === 'COMMENT' ? Comment : Question;
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const populate =
        contentType === 'COMMENT'
          ? {
              path: 'userId',
              select: { username: 1, email: 1, _id: 0 },
              strictPopulate: false,
            }
          : {
              path: 'uploadedBy',
              select: { username: 1, email: 1, _id: 0 },
              strictPopulate: false,
            };
      const projection =
        contentType === 'COMMENT'
          ? { _id: 1, userId: 1, postId: 1, message: 1 }
          : { _id: 1, uploadedBy: 1, 'file.url': 1 };
      const [isReportMarkedResolved, isContentFlagged] = await Promise.all([
        Report.findOneAndUpdate(
          {
            _id: reportId,
            resolved: { isResolved: false },
          },
          { resolved: { isResolved: true, adminId } },
          { upsert: false, new: true }
        )
          .select({ _id: 1 })
          .session(session)
          .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
          .lean()
          .exec(),
        Collection.findOneAndUpdate(
          { _id: postId, isFlagged: false },
          { isFlagged: true },
          { upsert: false, new: true }
        )
          .populate(populate)
          .select(projection)
          .session(session)
          .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
          .lean()
          .exec(),
      ]);
      if (!(isReportMarkedResolved && isContentFlagged)) {
        await session.abortTransaction();
        throw new ErrorHandler(
          'No document found matching the specified id',
          ERROR_CODES['NOT FOUND']
        );
      }
      if (redisClient === null) {
        await session.abortTransaction();
        throw new ErrorHandler(
          'Something went wrong. Please try again later',
          SERVER_ERROR['INTERNAL SERVER ERROR']
        );
      }
      const emailPayload = getEmailPayload(isContentFlagged, contentType);
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
    });
    await session.endSession();
    return res
      .status(SUCCESS_CODES['NO CONTENT'])
      .json({ message: 'Marked resolved' });
  }
);

export default MarkAsResolved;
