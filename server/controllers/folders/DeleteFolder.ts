import { TRPCError } from '@trpc/server';

import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { TAction } from '../../types/folders/types';
import { BookMarkedFile, UploadedFiles } from '../../models/files';

const DeleteFolder = async ({
  userId,
  folderName,
  action,
}: {
  userId: string;
  folderName: string;
  action: TAction;
}) => {
  let Collection;
  if (action === 'BOOKMARK') Collection = BookMarkedFile;
  else if (action === 'UPLOAD') Collection = UploadedFiles;
  else {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid action type',
    });
  }
  const doesFolderExists = await Collection.findOne({
    userId,
    name: folderName,
  })
    .select({ _id: 0, noOfFiles: 1 })
    .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
    .lean()
    .exec();
  if (doesFolderExists === null) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'No such folder exists',
    });
  }
  if (Number(doesFolderExists.noOfFiles) > 0) {
    throw new TRPCError({ code: 'CONFLICT', message: 'Folder is not empty' });
  }
  await Collection.deleteOne({ userId, name: folderName });
};

export default DeleteFolder;
