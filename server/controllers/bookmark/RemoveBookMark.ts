import mongoose from 'mongoose';
import { z } from 'zod';
import { Request, Response } from 'express';

import { BookMarkedFile } from '../../models/files';
import { ErrorHandler } from '../../utils/errors/errorHandler';
import { FILE_TYPE } from '../../constants/constants/upload';
import { MONGO_WRITE_QUERY_TIMEOUT } from '../../constants/constants/shared';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import { removeBookmarkInputSchema } from '../../router/bookmark/schema';
import { SERVER_ERROR, SUCCESS_CODES } from '../../constants/statusCode';

const RemoveBookMark = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.body as { userId: string };
    const { fileId } = req.body.data as z.infer<
      typeof removeBookmarkInputSchema
    >;
    const session = await mongoose.startSession();

    await session.withTransaction(async () => {
      const isFileRemoved = await BookMarkedFile.deleteOne({
        userId,
        fileType: FILE_TYPE.FILE,
        _id: fileId,
      })
        .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
        .session(session)
        .lean()
        .exec();
      if (isFileRemoved.deletedCount === 0) {
        await session.abortTransaction();
        throw new ErrorHandler(
          'Something went wrong. Please try again later',
          SERVER_ERROR['INTERNAL SERVER ERROR']
        );
      }
    });
    await session.endSession();
    return res
      .status(SUCCESS_CODES.OK)
      .json({ message: 'File removed from bookmark' });
  }
);

export default RemoveBookMark;
