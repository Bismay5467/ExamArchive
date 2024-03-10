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
    const file = new BookMarkedFile({
      userId,
      fileType: FILE_TYPE.FILE,
      name: fileName,
      parentId: folderId,
      metadata: fileId,
    });
    const [isFileAdded, isFileCountIncreased] = await Promise.all([
      file.save(),
      BookMarkedFile.findOneAndUpdate(
        { _id: folderId, fileType: FILE_TYPE.DIRECTORY },
        { $inc: { noOfFiles: 1 } },
        { upsert: false, new: true }
      )
        .select({ _id: 1 })
        .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
        .session(session)
        .lean()
        .exec(),
    ]);
    if (!(isFileAdded && isFileCountIncreased)) {
      await session.abortTransaction();
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong. Please try again later',
      });
    }
  });
  await session.endSession();
};

export default AddToBookMarks;
