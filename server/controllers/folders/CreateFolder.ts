import { TRPCError } from '@trpc/server';

import { FILE_TYPE } from '../../constants/constants/upload';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { TAction } from '../../types/folders/types';
import { BookMarkedFile, UploadedFiles } from '../../models/files';

const CreateFolder = async ({
  userId,
  folderName,
  action,
}: {
  userId: string;
  folderName: string;
  action: TAction;
}) => {
  let Collection;
  if (action === 'BOOKMARK') {
    Collection = BookMarkedFile;
  } else if (action === 'UPLOAD') {
    Collection = UploadedFiles;
  } else {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid action type',
    });
  }
  const doesFolderExists = await Collection.findOne({
    userId,
    name: folderName,
  })
    .select({ _id: 1 })
    .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
    .lean()
    .exec();
  if (doesFolderExists) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Folder already exists',
    });
  }
  const folder = new Collection({
    userId,
    name: folderName,
    fileType: FILE_TYPE.DIRECTORY,
  });
  const res = await folder.save();
  if (!res) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong. Please try again later',
    });
  }
};

export default CreateFolder;
