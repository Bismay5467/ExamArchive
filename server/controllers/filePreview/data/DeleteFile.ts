import { TRPCError } from '@trpc/server';
import mongoose from 'mongoose';
import { render } from '@react-email/render';

import ContentTakeDownEmail from '../../../emails/ContentTakeDown';
import redisClient from '../../../config/redisConfig';
import sendMail from '../../../utils/emails/sendMail';
import {
  BookMarkedFile,
  Comment,
  Question,
  Rating,
  Report,
  UploadedFiles,
  User,
} from '../../../models';
import {
  MAIL_EVENT_NAME,
  MONGO_READ_QUERY_TIMEOUT,
  MONGO_WRITE_QUERY_TIMEOUT,
} from '../../../constants/constants/shared';

const DeleteFile = async ({
  ownerId,
  postId,
  role,
}: {
  ownerId: string;
  postId: string;
  role: 'ADMIN' | 'USER';
}) => {
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    if (role === 'USER') {
      const docInfo = await Question.findOne({
        _id: postId,
        uploadedBy: ownerId,
      })
        .select({ _id: 1 })
        .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
        .session(session)
        .lean()
        .exec();
      if (docInfo === null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No document found with the specified IDs',
        });
      }
    }
    const [question, user] = await Promise.all([
      Question.findByIdAndDelete({ _id: postId })
        .select({ 'filename.url': 1 })
        .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
        .session(session)
        .lean()
        .exec(),
      User.findById({ _id: ownerId })
        .select({ username: 1, email: 1 })
        .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
        .session(session)
        .lean()
        .exec(),
      Rating.deleteMany({ postId })
        .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
        .session(session)
        .lean()
        .exec(),
      Comment.deleteMany({ postId })
        .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
        .session(session)
        .lean()
        .exec(),
      BookMarkedFile.deleteMany({ metadata: postId })
        .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
        .session(session)
        .lean()
        .exec(),
      UploadedFiles.deleteMany({ metadata: postId })
        .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
        .session(session)
        .lean()
        .exec(),
      Report.deleteMany({ postId })
        .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
        .session(session)
        .lean()
        .exec(),
    ]);
    if (question === null || Object.keys(question).length === 0) {
      await session.abortTransaction();
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong. Plase try again later',
      });
    }
    if (redisClient) {
      await Promise.all([redisClient.del(`post:${postId}`)]);
    } else {
      await session.abortTransaction();
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong. Please try again later',
      });
    }
    if (role === 'ADMIN') {
      if (user === null) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }
      const emailHTML = render(
        ContentTakeDownEmail({
          userFirstname: (user as any).username,
          fileLink: (question as any).filename.url,
        }),
        { pretty: true }
      );
      await sendMail({
        eventName: MAIL_EVENT_NAME,
        payload: {
          to: [(user as any).email],
          subject: 'Your post was reported',
          html: emailHTML,
        },
      });
    }
  });
  await session.endSession();
};

export default DeleteFile;
