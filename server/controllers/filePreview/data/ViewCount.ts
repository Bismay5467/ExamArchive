import { MONGO_WRITE_QUERY_TIMEOUT } from '../../../constants/constants/shared';
import Question from '../../../models/question';
import connectDB from '../../../config/dbConfig';

const ViewCount = async ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) => {
  await connectDB();

  await Question.findByIdAndUpdate(
    { _id: postId, 'noOfViews.userIds': { $ne: userId } },
    {
      $inc: { 'noOfViews.count': 1 },
      $addToSet: { 'noOfViews.userIds': userId },
    },
    { upsert: false, new: true }
  )
    .select({ _id: 1 })
    .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
    .lean()
    .exec();
};

export default ViewCount;
