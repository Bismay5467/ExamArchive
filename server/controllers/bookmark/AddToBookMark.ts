import mongoose from 'mongoose';
import { z } from 'zod';
import { Request, Response } from 'express';

import { BookMarkedFile } from '../../models/files';
import { ErrorHandler } from '../../utils/errors/errorHandler';
import { FILE_TYPE } from '../../constants/constants/upload';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { Question } from '../../models';
import { addBookmarkInputSchema } from '../../router/bookmark/schema';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import {
  ERROR_CODES,
  SERVER_ERROR,
  SUCCESS_CODES,
} from '../../constants/statusCode';

const AddToBookMarks = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.body as { userId: string };
    const { folderId, fileId, fileName } = req.body.data as z.infer<
      typeof addBookmarkInputSchema
    >;
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const [doesFileExistsInFolder, doesFileExists] = await Promise.all([
        BookMarkedFile.findOne({
          metadata: fileId,
          userId,
          parentId: folderId,
        })
          .select({ _id: 1 })
          .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
          .lean()
          .exec(),
        Question.findOne({ _id: fileId })
          .select({ _id: 1 })
          .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
          .lean()
          .exec(),
      ]);
      if (doesFileExistsInFolder) await session.abortTransaction();
      else if (doesFileExists === null) await session.abortTransaction();
      else {
        const [isFileAdded, isCountChanged] = await Promise.all([
          BookMarkedFile.findOneAndUpdate(
            {
              metadata: fileId,
              userId,
              fileType: FILE_TYPE.FILE,
              parentId: folderId,
            },
            {
              $setOnInsert: {
                metadata: fileId,
                userId,
                fileType: FILE_TYPE.FILE,
                parentId: folderId,
                name: fileName,
              },
            },
            { upsert: true, new: true }
          )
            .select({ _id: 1 })
            .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
            .session(session)
            .lean()
            .exec(),
          BookMarkedFile.findOneAndUpdate(
            { _id: folderId, fileType: FILE_TYPE.DIRECTORY, userId },
            { $inc: { noOfFiles: 1 } },
            { upsert: false, new: true }
          )
            .select({ _id: 1 })
            .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
            .session(session)
            .lean()
            .exec(),
        ]);
        if (isCountChanged === null) {
          await session.abortTransaction();
          throw new ErrorHandler(
            'It seems the folder does not exits',
            ERROR_CODES['NOT FOUND']
          );
        }
        if (isFileAdded === null) {
          await session.abortTransaction();
          throw new ErrorHandler(
            'Something went wrong. Please try again later',
            SERVER_ERROR['INTERNAL SERVER ERROR']
          );
        }
      }
    });
    await session.endSession();
    return res
      .status(SUCCESS_CODES.CREATED)
      .json({ message: 'File bookmarked' });
  }
);

export default AddToBookMarks;
