/* eslint-disable indent */
import { TRPCError } from '@trpc/server';
import mongoose from 'mongoose';

import { MAX_FILES_FETCH_LIMIT } from '../../constants/constants/upload';
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
  const Collection: any =
    action === 'BOOKMARK' ? BookMarkedFile : UploadedFiles;
  const query =
    parentId === null
      ? { userId: new mongoose.Types.ObjectId(userId), parentId }
      : {
          userId: new mongoose.Types.ObjectId(userId),
          parentId: new mongoose.Types.ObjectId(parentId),
        };
  const projection =
    parentId === null
      ? { name: 1, _id: 1, noOfFiles: 1 }
      : { metadata: 1, name: 1, _id: 1 };
  const [files, [totalFiles]] = await Promise.all([
    Collection.aggregate(
      [
        { $match: query },
        {
          $lookup: {
            from: 'questions',
            localField: 'metadata',
            foreignField: '_id',
            as: 'metadata',
          },
        },
        { $match: { 'metadata.isFlagged': { $ne: true } } },
        { $sort: { updatedAt: -1 } },
        { $skip: skipCount },
        { $limit: MAX_FILES_FETCH_LIMIT },
        { $project: projection },
      ],
      { maxTimeMS: MONGO_READ_QUERY_TIMEOUT, lean: true }
    ).exec(),
    Collection.aggregate(
      [
        { $match: query },
        {
          $lookup: {
            from: 'questions',
            localField: 'metadata',
            foreignField: '_id',
            as: 'metadata',
          },
        },
        { $match: { 'metadata.isFlagged': { $ne: true } } },
        { $group: { _id: null, totalCount: { $sum: 1 } } },
        { $project: { _id: 0, totalCount: 1 } },
      ],
      { maxTimeMS: MONGO_READ_QUERY_TIMEOUT, lean: true }
    ).exec(),
  ]);
  if (files.length === 0) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'No records found' });
  }
  const { totalCount } = totalFiles;
  const totalPages = Math.ceil(Number(totalCount) / MAX_FILES_FETCH_LIMIT);
  const hasMore = totalPages > page;
  return { files, totalPages, hasMore, totalCount };
};

export default GetFiles;
