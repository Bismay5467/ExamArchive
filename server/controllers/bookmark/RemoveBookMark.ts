import { TRPCError } from '@trpc/server';
import mongoose from 'mongoose';

import { BookMarkedFile } from '../../models/files';
import { FILE_TYPE } from '../../constants/constants/uploadedFiles';
import {
  MONGO_READ_QUERY_TIMEOUT,
  MONGO_WRITE_QUERY_TIMEOUT,
} from '../../constants/constants/shared';

const RemoveBookMark = async ({
  fileId,
  userId,
  folderId,
}: {
  fileId: string;
  userId: string;
  folderId: string;
}) => {
  const session = await mongoose.startSession();

  await session.withTransaction(async () => {
    const [isFileRemoved, isFileCountDecreased] = await Promise.all([
      BookMarkedFile.deleteOne({
        userId,
        fileType: FILE_TYPE.FILE,
        _id: fileId,
      })
        .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
        .session(session)
        .lean()
        .exec(),
      BookMarkedFile.findOneAndUpdate(
        { _id: folderId, fileType: FILE_TYPE.DIRECTORY },
        { $inc: { noOfFiles: -1 } },
        { upsert: false, new: true }
      )
        .select({ _id: 1 })
        .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
        .session(session)
        .lean()
        .exec(),
    ]);
    if (isFileRemoved.deletedCount === 0 || isFileCountDecreased === null) {
      await session.abortTransaction();
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong. Please try again later',
      });
    }
  });
  await session.endSession();
};

export default RemoveBookMark;
