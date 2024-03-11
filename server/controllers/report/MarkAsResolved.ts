/* eslint-disable indent */
import { TRPCError } from '@trpc/server';
import mongoose from 'mongoose';
import { render } from '@react-email/render';

import ContentTakeDownEmail from '../../emails/ContentTakeDown';
import redisClient from '../../config/redisConfig';
import sendMail from '../../utils/emails/sendMail';
import { Comment, Question, Report } from '../../models';
import {
  MAIL_EVENT_NAME,
  MONGO_WRITE_QUERY_TIMEOUT,
} from '../../constants/constants/shared';

const getEmailPayload = (data: any, contentType: 'COMMENT' | 'POST') => {
  if (contentType === 'POST') {
    const {
      uploadedBy: { username, email },
      file: { url },
    } = data as unknown as {
      uploadedBy: { username: string; email: string };
      file: { url: string };
    };
    const emailHTML = render(
      ContentTakeDownEmail({ userFirstname: username, fileLink: url }),
      { pretty: true }
    );
    return { to: [email], subject: 'Your post was reported', html: emailHTML };
  }
  const {
    userId: { username, email },
    postId: commentId,
    message,
  } = data as unknown as {
    userId: { username: string; email: string };
    postId: mongoose.Types.ObjectId;
    message: string;
  };
  // TODO: create the comment link
  const emailHTML = render(
    ContentTakeDownEmail({
      userFirstname: username,
      comment: { message, postLink: commentId.toString() },
    }),
    { pretty: true }
  );
  return { to: [email], subject: 'Your post was reported', html: emailHTML };
};

const MarkAsResolved = async ({
  adminId,
  reportId,
  postId,
  contentType,
}: {
  adminId: string;
  reportId: string;
  postId: string;
  contentType: 'COMMENT' | 'POST';
}) => {
  const Collection: any = contentType === 'COMMENT' ? Comment : Question;
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    const populate =
      contentType === 'COMMENT'
        ? { path: 'userId', select: { username: 1, email: 1, _id: 0 } }
        : { path: 'uploadedBy', select: { username: 1, email: 1, _id: 0 } };
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
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No document found matching the specified id',
      });
    }
    if (redisClient === null) {
      await session.abortTransaction();
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong. Please try again later',
      });
    }
    const emailPayload = getEmailPayload(isContentFlagged, contentType);
    const jobPromises =
      contentType === 'POST'
        ? [
            sendMail({
              eventName: MAIL_EVENT_NAME,
              payload: emailPayload,
            }),
            redisClient.del(`post:${postId}`),
          ]
        : [
            sendMail({
              eventName: MAIL_EVENT_NAME,
              payload: emailPayload,
            }),
          ];
    await Promise.all(jobPromises);
  });
  await session.endSession();
};

export default MarkAsResolved;
