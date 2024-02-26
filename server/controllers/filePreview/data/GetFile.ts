import { TRPCError } from '@trpc/server';

import { MONGO_READ_QUERY_TIMEOUT } from '../../../constants/constants/shared';
import Question from '../../../models/question';
import Rating from '../../../models/rating';

const GetFile = async ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) => {
  const readFromDBPromises = [
    Question.findOne({ _id: postId })
      .populate({ path: 'uploadedBy', select: { username: 1, _id: 0 } })
      .select({
        noOfDownloads: 0,
        noOfViews: 0,
        'filename.filename': 0,
        'filename.publicId': 0,
        'uploadedBy._id': 0,
      })
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .lean()
      .exec(),
    Rating.findOne({ userId })
      .select({ _id: 1 })
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .lean()
      .exec(),
  ];

  const [docInfo, ratingInfo] = await Promise.all(readFromDBPromises);

  if (!docInfo) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'No document found with the given postId',
    });
  }

  return {
    docInfo: JSON.stringify(docInfo),
    hasUserRated: ratingInfo !== null,
  };
};

export default GetFile;
