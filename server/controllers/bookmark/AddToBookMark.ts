import mongoose from 'mongoose';
import { z } from 'zod';
import { Request, Response } from 'express';

import { BookMarkedFile } from '../../models/files';
import { ErrorHandler } from '../../utils/errors/errorHandler';
import { FILE_TYPE } from '../../constants/constants/upload';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { addBookmarkInputSchema } from '../../router/bookmark/schema';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import { ERROR_CODES, SUCCESS_CODES } from '../../constants/statusCode';

const AddToBookMarks = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.body as { userId: string };
    const { folderId, fileId, fileName } = req.body.data as z.infer<
      typeof addBookmarkInputSchema
    >;
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const [isFileAdded, isCountChanged] = await Promise.all([
        BookMarkedFile.findOneAndUpdate(
          {
            metadata: fileId,
            userId,
            fileType: FILE_TYPE.FILE,
          },
          { parentId: folderId, name: fileName },
          { upsert: true, new: false }
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
      if (isFileAdded !== null) {
        await session.abortTransaction();
        throw new ErrorHandler(
          'This file was bookmarked by you',
          ERROR_CODES.CONFLICT
        );
      }
    });
    await session.endSession();
    return res
      .status(SUCCESS_CODES.CREATED)
      .json({ message: 'File bookmarked.' });
  }
);

export default AddToBookMarks;
