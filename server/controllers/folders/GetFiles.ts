/* eslint-disable indent */
import { TRPCError } from '@trpc/server';

import { MAX_FILES_FETCH_LIMIT } from '../../constants/constants/uploadedFiles';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { TAction } from '../../types/folders/types';
import { BookMarkedFile, UploadedFiles } from '../../models/files';

const GetFiles = async ({
  userId,
  parentId = null,
  action,
  page = 1,
}: {
  userId: string;
  parentId: string | null;
  action: TAction;
  page: number;
}) => {
  const skipCount = (page - 1) * MAX_FILES_FETCH_LIMIT;
  let Collection;
  if (action === 'BOOKMARK') Collection = BookMarkedFile;
  else if (action === 'UPLOAD') Collection = UploadedFiles;
  else {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid action type',
    });
  }
  const query = {
    userId,
    parentId,
  };
  const [files, totalFiles] = await Promise.all([
    Collection.find(query)
      .populate({
        path: 'metadata',
        select: { uploadedBy: 0, file: 0, institutionName: 0 },
      })
      .select(
        parentId
          ? { metadata: 1, name: 1, _id: 1 }
          : { name: 1, _id: 1, noOfFiles: 1 }
      )
      .sort({ updatedAt: 'desc' })
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .lean()
      .skip(skipCount)
      .limit(MAX_FILES_FETCH_LIMIT)
      .exec(),
    Collection.countDocuments(query)
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .lean()
      .exec(),
  ]);
  if (files.length === 0) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'No records found' });
  }
  const totalPages = Math.ceil(Number(totalFiles) / MAX_FILES_FETCH_LIMIT);
  const hasMore = totalPages > page;
  return { files, totalPages, hasMore, totalFiles };
};

export default GetFiles;
