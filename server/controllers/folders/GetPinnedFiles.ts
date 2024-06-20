import mongoose from 'mongoose';
import { Request, Response } from 'express';

import { BookMarkedFile } from '../../models';
import { FILE_TYPE } from '../../constants/constants/upload';
import { MAX_FILE_PIN_LIMIT } from '../../constants/constants/filePreview';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { SUCCESS_CODES } from '../../constants/statusCode';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import { sanitizePinnedFilesInfo } from '../../utils/folders/sanitizeFilesInfo';

const GetPinnedFiles = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.body as { userId: string };
    const query = {
      userId: new mongoose.Types.ObjectId(userId),
      fileType: FILE_TYPE.FILE,
      isPinned: true,
    };
    const files = await BookMarkedFile.aggregate(
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
        { $limit: MAX_FILE_PIN_LIMIT },
        { $project: { _id: 0, name: 1, updatedAt: 1, 'metadata._id': 1 } },
      ],
      { maxTimeMS: MONGO_READ_QUERY_TIMEOUT, lean: true }
    ).exec();
    return res
      .status(SUCCESS_CODES.OK)
      .json({ files: sanitizePinnedFilesInfo({ files }) });
  }
);

export default GetPinnedFiles;
