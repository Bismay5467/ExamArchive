/* eslint-disable indent */
import { Types } from 'mongoose';
import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../../utils/errors/errorHandler';
import { MONGO_WRITE_QUERY_TIMEOUT } from '../../../constants/constants/shared';
import { NOVU_MILESTONE_ACHIEVED } from '../../../constants/constants/filePreview';
import { Question } from '../../../models';
import asyncErrorHandler from '../../../utils/errors/asyncErrorHandler';
import redisClient from '../../../config/redisConfig';
import sendNotification from '../../../utils/notification/sendNotification';
import { updateDownloadCountInputSchema } from '../../../router/filePreview/data/schema';
import { SERVER_ERROR, SUCCESS_CODES } from '../../../constants/statusCode';

const DownloadCount = asyncErrorHandler(async (req: Request, res: Response) => {
  const { userId, ip } = req.body as { userId: string; ip: string };
  const { postId } = req.body.data as z.infer<
    typeof updateDownloadCountInputSchema
  >;
  const filter = userId
    ? {
        _id: postId,
        'noOfDownloads.userIds': { $ne: userId },
        isFlagged: false,
      }
    : { _id: postId, 'noOfDownloads.ips': { $ne: ip }, isFlagged: false };
  const update = userId
    ? {
        $inc: { 'noOfDownloads.count': 1 },
        $addToSet: { 'noOfDownloads.userIds': userId },
      }
    : {
        $inc: { 'noOfDownloads.count': 1 },
        $addToSet: { 'noOfDownloads.ips': ip },
      };
  const options = { upsert: false, new: true };
  const redisKey = `post:${postId}`;
  const [result] = await Promise.all([
    Question.findByIdAndUpdate(filter, update, options)
      .select({ _id: 1, uploadedBy: 1, noOfDownloads: 1 })
      .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
      .lean()
      .exec(),
    redisClient?.del(redisKey),
  ]);
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
  return res.status(SUCCESS_CODES['NO CONTENT']).json({
    message: 'No message',
  });
});

export default DownloadCount;
