/* eslint-disable indent */
import mongoose from 'mongoose';
import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { MAX_FILES_FETCH_LIMIT } from '../../constants/constants/upload';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import { getFilesInputSchema } from '../../router/folder/schema';
import { BookMarkedFile, UploadedFiles } from '../../models/files';
import { ERROR_CODES, SUCCESS_CODES } from '../../constants/statusCode';

const GetFiles = asyncErrorHandler(async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: string };
  const { parentId, action, page } = req.query as unknown as z.infer<
    typeof getFilesInputSchema
  > & { userId: string };
  const skipCount = ((parseInt(page, 10) || 1) - 1) * MAX_FILES_FETCH_LIMIT;
  const Collection: any =
    action === 'BOOKMARK' ? BookMarkedFile : UploadedFiles;
  const query =
    parentId === ''
      ? { userId: new mongoose.Types.ObjectId(userId), parentId: null }
      : {
          userId: new mongoose.Types.ObjectId(userId),
          parentId: new mongoose.Types.ObjectId(parentId),
        };
  const projection =
    parentId === ''
      ? { name: 1, _id: 1, noOfFiles: 1 }
      : {
          'metadata._id': 1,
          'metadata.createdAt': 1,
          'metadata.updatedAt': 1,
          _id: 1,
        };
  if (parentId && action === 'UPLOAD') Object.assign(projection, { name: 1 });
  if (parentId && action === 'BOOKMARK') {
    Object.assign(projection, {
      'metadata.status': 1,
      'metadata.file.filename': 1,
    });
  }
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
    throw new ErrorHandler('No records found', ERROR_CODES['NOT FOUND']);
  }
  const { totalCount } = totalFiles;
  const totalPages = Math.ceil(Number(totalCount) / MAX_FILES_FETCH_LIMIT);
  const hasMore = totalPages > (parseInt(page, 10) || 1);
  return res
    .status(SUCCESS_CODES.OK)
    .json({ files, totalPages, hasMore, totalCount });
});

export default GetFiles;
