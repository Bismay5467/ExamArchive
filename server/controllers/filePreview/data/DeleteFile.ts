import mongoose from 'mongoose';
import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../../utils/errors/errorHandler';
import { MONGO_READ_QUERY_TIMEOUT } from '../../../constants/constants/shared';
import { Question } from '../../../models';
import { TRole } from '../../../types/auth/types';
import asyncErrorHandler from '../../../utils/errors/asyncErrorHandler';
import { deleteFileInputSchema } from '../../../router/filePreview/data/schema';
import redisClient from '../../../config/redisConfig';
import {
  ERROR_CODES,
  SERVER_ERROR,
  SUCCESS_CODES,
} from '../../../constants/statusCode';
import {
  decreaseFileCountInFolder,
  deleteFileFromDBPromises,
  getFolderIds,
  sendMailToOwner,
} from '../../../utils/filePreview/deleteFileHelpers';

const DeleteFile = asyncErrorHandler(async (req: Request, res: Response) => {
  const { userId: ownerId, role } = req.body as {
    userId: string;
    role: TRole;
  };
  const { postId } = req.body.data as z.infer<typeof deleteFileInputSchema>;
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    if (role === 'ADMIN') {
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
    const { uploadFolderIds } = await getFolderIds({
      postId,
      session,
    });
    const [questionInfo] = await Promise.all([
      ...deleteFileFromDBPromises({ postId, session }),
      ...decreaseFileCountInFolder({
        uploadFolderIds,
        session,
      }),
      redisClient.del(`post:${postId}`),
    ]);
    if (questionInfo === null || Object.keys(questionInfo).length === 0) {
      await session.abortTransaction();
      throw new ErrorHandler(
        'Something went wrong. Please try again later',
        SERVER_ERROR['INTERNAL SERVER ERROR']
      );
    }
    if (role === 'SUPERADMIN') sendMailToOwner({ questionInfo });
  });
  await session.endSession();
  return res.status(SUCCESS_CODES.OK).json({ message: 'Post was deleted' });
});

export default DeleteFile;
