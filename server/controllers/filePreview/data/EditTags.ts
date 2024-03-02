import { TRPCError } from '@trpc/server';

import { DOC_INFO_TTL_IN_SECONDS } from '../../../constants/constants/filePreview';
import { MONGO_WRITE_QUERY_TIMEOUT } from '../../../constants/constants/shared';
import Question from '../../../models/question';
import redisClient from '../../../config/redisConfig';

const EditTags = async ({
  postId,
  newTags,
}: {
  postId: string;
  newTags: string[];
}) => {
  const docInfo = await Question.findByIdAndUpdate(
    { _id: postId },
    { $addToSet: { tags: { $each: newTags } } },
    { upsert: false, new: true }
  )
    .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
    .lean()
    .exec();
  if (docInfo === null) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `No question paper found with the id ${postId}`,
    });
  }
  const redisKey = `post:${postId}`;
  if (redisClient) {
    await redisClient.set(
      redisKey,
      JSON.stringify(docInfo),
      'EX',
      DOC_INFO_TTL_IN_SECONDS
    );
  }
};

export default EditTags;
