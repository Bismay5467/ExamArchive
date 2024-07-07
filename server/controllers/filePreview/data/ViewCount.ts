/* eslint-disable indent */
import { Types } from 'mongoose';
import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../../utils/errors/errorHandler';
import { MONGO_WRITE_QUERY_TIMEOUT } from '../../../constants/constants/shared';
import { NOVU_MILESTONE_ACHIEVED } from '../../../constants/constants/filePreview';
import Question from '../../../models/question';
import asyncErrorHandler from '../../../utils/errors/asyncErrorHandler';
import redisClient from '../../../config/redisConfig';
import sendNotification from '../../../utils/notification/sendNotification';
import { updateViewCountInputSchema } from '../../../router/filePreview/data/schema';
import { SERVER_ERROR, SUCCESS_CODES } from '../../../constants/statusCode';

const ViewCount = asyncErrorHandler(async (req: Request, res: Response) => {
  const { userId, ip } = req.body as { userId: string; ip: string };
  const { postId } = req.body.data as z.infer<
    typeof updateViewCountInputSchema
  >;
  const filter = userId
    ? {
        _id: postId,
        'noOfViews.userIds': { $ne: new Types.ObjectId(userId) },
        isFlagged: false,
      }
    : { _id: postId, 'noOfViews.ips': { $ne: ip }, isFlagged: false };
  const update = userId
    ? {
        $inc: { 'noOfViews.count': 1 },
        $addToSet: { 'noOfViews.userIds': userId },
      }
    : {
        $inc: { 'noOfViews.count': 1 },
        $addToSet: { 'noOfViews.ips': ip },
      };
  const options = { upsert: false, new: true };
  const redisKey = `post:${postId}`;
  const [result] = await Promise.all([
    Question.findOneAndUpdate(filter, update, options)
      .select({ _id: 1, uploadedBy: 1, noOfViews: 1 })
      .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
      .lean()
      .exec(),
    redisClient?.del(redisKey),
  ]);
  if (result === null) return res.status(SUCCESS_CODES['NO CONTENT']);
  const {
    uploadedBy: ownerId,
    noOfViews: { count },
  } = result as unknown as {
    uploadedBy: Types.ObjectId;
    noOfViews: { count: number };
  };
  const data = await sendNotification({
    ownerId,
    count,
    postId,
    type: 'views',
    workflowIndentifier: NOVU_MILESTONE_ACHIEVED,
  });
  if (data === null) {
    throw new ErrorHandler(
      'Something went wrong.',
      SERVER_ERROR['INTERNAL SERVER ERROR']
    );
  }
  return res.status(SUCCESS_CODES['NO CONTENT']).json({
    message: 'No message',
  });
});

export default ViewCount;
