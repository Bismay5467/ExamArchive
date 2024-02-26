import { MONGO_WRITE_QUERY_TIMEOUT } from '../../../constants/constants/shared';
import Question from '../../../models/question';

const DownloadCount = async ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) => {
  await Question.findByIdAndUpdate(
    { _id: postId, 'noOfDownloads.userIds': { $ne: userId } },
    {
      $inc: { 'noOfDownloads.count': 1 },
      $addToSet: { 'noOfDownloads.userIds': userId },
    },
    { upsert: false, new: true }
  )
    .select({ _id: 1 })
    .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
    .lean()
    .exec();
};

export default DownloadCount;
