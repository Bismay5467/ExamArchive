import mongoose from 'mongoose';
import { Request, Response } from 'express';

import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { Question } from '../../models';
import { SUCCESS_CODES } from '../../constants/statusCode';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';

export default asyncErrorHandler(async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: string };

  const [stats] = await Question.aggregate(
    [
      { $match: { uploadedBy: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$uploadedBy',
          totalViewsCount: { $sum: '$noOfViews.count' },
          totalDownloadCount: { $sum: '$noOfDownloads.count' },
        },
      },
    ],
    { maxTimeMS: MONGO_READ_QUERY_TIMEOUT, lean: true }
  ).exec();
  return res.status(SUCCESS_CODES.OK).json({ stats });
});
