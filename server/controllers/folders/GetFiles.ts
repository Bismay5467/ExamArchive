/* eslint-disable no-nested-ternary */
/* eslint-disable indent */
import mongoose from 'mongoose';
import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { SUCCESS_CODES } from '../../constants/statusCode';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import { getFilesInputSchema } from '../../router/folder/schema';
import sanitizeFilesInfo from '../../utils/folders/sanitizeFilesInfo';
import { BookMarkedFile, UploadedFiles } from '../../models/files';

const GetFiles = asyncErrorHandler(async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: string };
  const { parentId, action } = req.query as unknown as z.infer<
    typeof getFilesInputSchema
  > & { userId: string };
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
      ? action === 'BOOKMARK'
        ? { name: 1, _id: 1, createdAt: 1, updatedAt: 1 }
        : { name: 1, _id: 1, noOfFiles: 1, createdAt: 1, updatedAt: 1 }
      : {
          'metadata._id': 1,
          'metadata.createdAt': 1,
          'metadata.updatedAt': 1,
          _id: 1,
        };
  if (parentId && action === 'BOOKMARK') {
    Object.assign(projection, { name: 1, isPinned: 1 });
  }
  if (parentId && action === 'UPLOAD') {
    Object.assign(projection, {
      'metadata.status': 1,
      'metadata.file.filename': 1,
    });
  }
  const [files] = await Promise.all([
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
        { $project: projection },
      ],
      { maxTimeMS: MONGO_READ_QUERY_TIMEOUT, lean: true }
    ).exec(),
  ]);
  if (files.length === 0) {
    throw new ErrorHandler('No records found', SUCCESS_CODES.OK);
  }
  const sanitizedInfo =
    parentId === '' ? files : sanitizeFilesInfo({ files, action });
  return res.status(SUCCESS_CODES.OK).json({ files: sanitizedInfo });
});

export default GetFiles;
