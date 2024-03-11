import { TRPCError } from '@trpc/server';

import { DOC_INFO_TTL_IN_SECONDS } from '../../../constants/constants/filePreview';
import { MONGO_READ_QUERY_TIMEOUT } from '../../../constants/constants/shared';
import Question from '../../../models/question';
import redisClient from '../../../config/redisConfig';

const GetFile = async ({ postId }: { postId: string }) => {
  const redisKey = `post:${postId}`;
  if (redisClient) {
    const docInfo = await redisClient.get(redisKey);
    if (docInfo !== null) return { docInfo: JSON.parse(docInfo) };
  }
  const docInfo = await Question.findOne({ _id: postId })
    .populate({ path: 'uploadedBy', select: { username: 1, _id: 0 } })
    .select({
      noOfDownloads: 0,
      noOfViews: 0,
      'file.filename': 0,
      'file.publicId': 0,
      'uploadedBy._id': 0,
      isFlagged: 0,
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
  if ((docInfo as any).isFlagged === true) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message:
        'The content on this page was taken down by the team due to the violation of terms',
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
  return { docInfo };
};

export default GetFile;
