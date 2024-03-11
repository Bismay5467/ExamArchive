import { TRPCError } from '@trpc/server';
import { Types } from 'mongoose';

import { MONGO_WRITE_QUERY_TIMEOUT } from '../../../constants/constants/shared';
import { NOVU_MILESTONE_ACHIEVED } from '../../../constants/constants/filePreview';
import Question from '../../../models/question';
import sendNotification from '../../../utils/notification/sendNotification';

const ViewCount = async ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) => {
  const res = await Question.findByIdAndUpdate(
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
  const {
    uploadedBy: ownerId,
    noOfViews: { count },
  } = res as unknown as {
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
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    });
  }
};

export default ViewCount;
