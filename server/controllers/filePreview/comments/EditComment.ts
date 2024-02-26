import { TRPCError } from '@trpc/server';

import Comment from '../../../models/comment';
import { MONGO_WRITE_QUERY_TIMEOUT } from '../../../constants/constants/shared';

const EditComment = async ({
  commentId,
  message,
  userId,
}: {
  commentId: string;
  message: string;
  userId: string;
}) => {
  const res = await Comment.findOneAndUpdate(
    { _id: commentId, userId },
    { isEdited: true, message },
    { upsert: false, new: true }
  )
    .select({ _id: 1 })
    .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
    .lean()
    .exec();

  if (!res) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `No comments found with the given comment id: ${commentId}`,
    });
  }
};

export default EditComment;
