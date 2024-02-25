import { TRPCError } from '@trpc/server';

import { MONGO_WRITE_QUERY_TIMEOUT } from '../../../constants/constants/shared';
import Question from '../../../models/question';
import connectDB from '../../../config/dbConfig';

const EditTags = async ({
  postId,
  newTags,
}: {
  postId: string;
  newTags: string[];
}) => {
  await connectDB();

  const res = await Question.findByIdAndUpdate(
    { _id: postId },
    { $addToSet: { tags: { $each: newTags } } },
    { upsert: false, new: true }
  )
    .select({ _id: 1 })
    .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
    .lean()
    .exec();

  if (res === null) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `No question paper found with the id ${postId}`,
    });
  }
};

export default EditTags;
