import { TRPCError } from '@trpc/server';

import { DOC_INFO_TTL_IN_SECONDS } from '../../../constants/constants/filePreview';
import { MONGO_READ_QUERY_TIMEOUT } from '../../../constants/constants/shared';
import Question from '../../../models/question';
import redisClient from '../../../config/redisConfig';

const GetFile = async ({ postId }: { postId: string }) => {
  const redisKey = `post:${postId}`;
  if (redisClient) {
    const docInfo = await redisClient.get(redisKey);
    if (docInfo !== null) return { docInfo };
  }
  const docInfo = await Question.findOne({ _id: postId })
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
    .exec();
  if (!docInfo) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'No document found with the given postId',
    });
  }
  if (redisClient) {
    await redisClient.set(
      redisKey,
      JSON.stringify(docInfo),
      'EX',
      DOC_INFO_TTL_IN_SECONDS
    );
  }
  return { docInfo: JSON.stringify(docInfo) };
};

export default GetFile;
