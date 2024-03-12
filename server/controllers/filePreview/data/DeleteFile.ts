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
    if (redisClient === null) {
      await session.abortTransaction();
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong. Please try again later',
      });
    }
    const [questionInfo] = await Promise.all([
      Question.findByIdAndDelete({ _id: postId })
        .populate({ path: 'uploadedBy', select: { email: 1, username: 1 } })
        .select({ 'file.url': 1, uploadedBy: 1 })
        .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
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
      redisClient.del(`post:${postId}`),
    ]);
    if (questionInfo === null || Object.keys(questionInfo).length === 0) {
      await session.abortTransaction();
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong. Plase try again later',
      });
    }
    if (role === 'ADMIN') {
      const {
        file: { url },
        uploadedBy: { email, username },
      } = questionInfo as unknown as {
        file: { url: string };
        uploadedBy: { username: string; email: string };
      };
      const emailHTML = render(
        ContentTakeDownEmail({
          userFirstname: username,
          fileLink: url,
        }),
        { pretty: true }
      );
      await sendMail({
        eventName: MAIL_EVENT_NAME,
        payload: {
          to: [email],
          subject: 'Your post was reported',
          html: emailHTML,
        },
      });
    }
  });
  await session.endSession();
};

export default DeleteFile;
