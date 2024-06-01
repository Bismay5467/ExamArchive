import mongoose from 'mongoose';
import { render } from '@react-email/render';
import { z } from 'zod';
import { Request, Response } from 'express';

import ContentTakeDownEmail from '../../../emails/ContentTakeDown';
import { ErrorHandler } from '../../../utils/errors/errorHandler';
import { TRole } from '../../../types/auth/types';
import asyncErrorHandler from '../../../utils/errors/asyncErrorHandler';
import { deleteFileInputSchema } from '../../../router/filePreview/data/schema';
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
  ERROR_CODES,
  SERVER_ERROR,
  SUCCESS_CODES,
} from '../../../constants/statusCode';
import {
  MAIL_EVENT_NAME,
  MONGO_READ_QUERY_TIMEOUT,
  MONGO_WRITE_QUERY_TIMEOUT,
} from '../../../constants/constants/shared';

const DeleteFile = asyncErrorHandler(async (req: Request, res: Response) => {
  const { userId: ownerId, role } = req.body as {
    userId: string;
    role: TRole;
  };
  const { postId } = req.body.data as z.infer<typeof deleteFileInputSchema>;
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
        throw new ErrorHandler(
          'No document found with the specified IDs',
          ERROR_CODES['NOT FOUND']
        );
      }
    }
    if (redisClient === null) {
      await session.abortTransaction();
      throw new ErrorHandler(
        'Something went wrong. Please try again later',
        SERVER_ERROR['INTERNAL SERVER ERROR']
      );
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
      throw new ErrorHandler(
        'Something went wrong. Please try again later',
        SERVER_ERROR['INTERNAL SERVER ERROR']
      );
    }
    if (role === 'ADMIN') {
      const {
        file: { url },
        uploadedBy,
      } = questionInfo as unknown as {
        file: { url: string };
        uploadedBy: { username: string; email: string };
      };
      if (typeof uploadedBy === 'object' && uploadedBy !== null) {
        const { username, email } = uploadedBy;
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
    }
  });
  await session.endSession();
  return res.status(SUCCESS_CODES.OK).json({ message: 'Post was deleted' });
});

export default DeleteFile;
