import { Types } from 'mongoose';
import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../../utils/errors/errorHandler';
import { MONGO_WRITE_QUERY_TIMEOUT } from '../../../constants/constants/shared';
import { NOVU_MILESTONE_ACHIEVED } from '../../../constants/constants/filePreview';
import Question from '../../../models/question';
import asyncErrorHandler from '../../../utils/errors/asyncErrorHandler';
import sendNotification from '../../../utils/notification/sendNotification';
import { updateViewCountInputSchema } from '../../../router/filePreview/data/schema';
import { SERVER_ERROR, SUCCESS_CODES } from '../../../constants/statusCode';

const ViewCount = asyncErrorHandler(async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: string };
  const { postId } = req.body.data as z.infer<
    typeof updateViewCountInputSchema
  >;
  const result = await Question.findByIdAndUpdate(
    { _id: postId, 'noOfViews.userIds': { $ne: userId } },
    {
      $inc: { 'noOfViews.count': 1 },
      $addToSet: { 'noOfViews.userIds': userId },
    },
    { upsert: false, new: true }
  )
    .select({ _id: 1, uploadedBy: 1, noOfViews: 1 })
    .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
    .lean()
    .exec();
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
  return res.status(SUCCESS_CODES['NO CONTENT']);
});

export default ViewCount;
