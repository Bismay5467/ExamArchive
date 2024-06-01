import { Types } from 'mongoose';
import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../../utils/errors/errorHandler';
import { MONGO_WRITE_QUERY_TIMEOUT } from '../../../constants/constants/shared';
import { NOVU_MILESTONE_ACHIEVED } from '../../../constants/constants/filePreview';
import { Question } from '../../../models';
import asyncErrorHandler from '../../../utils/errors/asyncErrorHandler';
import sendNotification from '../../../utils/notification/sendNotification';
import { updateDownloadCountInputSchema } from '../../../router/filePreview/data/schema';
import { SERVER_ERROR, SUCCESS_CODES } from '../../../constants/statusCode';

const DownloadCount = asyncErrorHandler(async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: string };
  const { postId } = req.body.data as z.infer<
    typeof updateDownloadCountInputSchema
  >;
  const result = await Question.findByIdAndUpdate(
    { _id: postId, 'noOfDownloads.userIds': { $ne: userId }, isFlagged: false },
    {
      $inc: { 'noOfDownloads.count': 1 },
      $addToSet: { 'noOfDownloads.userIds': userId },
    },
    { upsert: false, new: true }
  )
    .select({ _id: 1, uploadedBy: 1, noOfDownloads: 1 })
    .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
    .lean()
    .exec();
  if (result === null) return res.status(SUCCESS_CODES['NO CONTENT']);
  const {
    uploadedBy: ownerId,
    noOfDownloads: { count },
  } = result as unknown as {
    uploadedBy: Types.ObjectId;
    noOfDownloads: { count: number };
  };
  const data = await sendNotification({
    ownerId,
    count,
    postId,
    type: 'downloads',
    workflowIndentifier: NOVU_MILESTONE_ACHIEVED,
  });
  if (data === null) {
    throw new ErrorHandler(
      'Something went wrong',
      SERVER_ERROR['INTERNAL SERVER ERROR']
    );
  }
  return res.status(SUCCESS_CODES['NO CONTENT']);
});

export default DownloadCount;
