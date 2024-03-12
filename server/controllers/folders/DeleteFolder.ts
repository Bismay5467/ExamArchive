import { TRPCError } from '@trpc/server';

import { MONGO_WRITE_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { TAction } from '../../types/folders/types';
import { BookMarkedFile, UploadedFiles } from '../../models/files';

const DeleteFolder = async ({
  userId,
  folderId,
  action,
}: {
  userId: string;
  folderId: string;
  action: TAction;
}) => {
  const Collection = action === 'BOOKMARK' ? BookMarkedFile : UploadedFiles;
  const deleteQuery = {
    $or: [{ _id: folderId }, { userId, parentId: folderId }],
  };
  const { deletedCount } = await Collection.deleteMany(deleteQuery)
    .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
    .lean()
    .exec();
  if (deletedCount === 0) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'No matching records found',
    });
  }
};

export default DeleteFolder;
