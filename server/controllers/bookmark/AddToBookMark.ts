import { TRPCError } from '@trpc/server';
import mongoose from 'mongoose';

import { BookMarkedFile } from '../../models/files';
import { FILE_TYPE } from '../../constants/constants/upload';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';

const AddToBookMarks = async ({
  folderId,
  userId,
  fileId,
  fileName,
}: {
  folderId: string;
  userId: string;
  fileId: string;
  fileName: string;
}) => {
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    const [isFileAdded] = await Promise.all([
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
        { _id: folderId, fileType: FILE_TYPE.DIRECTORY },
        { $inc: { noOfFiles: 1 } },
        { upsert: false, new: true }
      )
        .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
        .session(session)
        .lean()
        .exec(),
    ]);
    if (isFileAdded) {
      await session.abortTransaction();
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'This file was bookmarked by you',
      });
    }
  });
  await session.endSession();
};

export default AddToBookMarks;
