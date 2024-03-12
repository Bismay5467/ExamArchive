import { TRPCError } from '@trpc/server';
import { Types } from 'mongoose';

import { MONGO_WRITE_QUERY_TIMEOUT } from '../../../constants/constants/shared';
import { NOVU_MILESTONE_ACHIEVED } from '../../../constants/constants/filePreview';
import { Question } from '../../../models';
import sendNotification from '../../../utils/notification/sendNotification';

const DownloadCount = async ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) => {
  const res = await Question.findByIdAndUpdate(
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
  if (res === null) return;
  const {
    uploadedBy: ownerId,
    noOfDownloads: { count },
  } = res as unknown as {
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
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    });
  }
};

export default DownloadCount;
