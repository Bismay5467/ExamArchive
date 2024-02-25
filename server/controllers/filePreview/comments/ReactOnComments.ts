/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
import { TRPCError } from '@trpc/server';

import Comment from '../../../models/comment';
import { MONGO_WRITE_QUERY_TIMEOUT } from '../../../constants/constants/shared';
import connectDB from '../../../config/dbConfig';
import { TCommentReact, TReaction } from '../../../types/filePreview/types';

const ReactOnComments = async ({
  commentId,
  voterId,
  action,
  reaction,
}: {
  commentId: string;
  voterId: string;
  action: TCommentReact;
  reaction: TReaction;
}) => {
  const filter =
    reaction === 'UNLIKE'
      ? { _id: commentId }
      : action === 'DOWNVOTE'
        ? { _id: commentId, 'downVotes.voters': { $ne: voterId } }
        : { _id: commentId, 'upVotes.voters': { $ne: voterId } };

  let updateOperator;

  if (reaction === 'LIKE') {
    updateOperator =
      action === 'DOWNVOTE'
        ? {
            $addToSet: { 'downVotes.voters': voterId },
            $inc: { 'downVotes.count': 1 },
          }
        : {
            $addToSet: { 'upVotes.voters': voterId },
            $inc: { 'upVotes.count': 1 },
          };
  } else {
    updateOperator =
      action === 'DOWNVOTE'
        ? {
            $pull: { 'downVotes.voters': voterId },
            $inc: { 'downVotes.count': -1 },
          }
        : {
            $pull: { 'upVotes.voters': voterId },
            $inc: { 'upVotes.count': -1 },
          };
  }

  const updateOptions = { new: true, upsert: false };

  await connectDB();

  const res = await Comment.findOneAndUpdate(
    filter,
    updateOperator,
    updateOptions
  )
    .select({ _id: 1 })
    .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
    .lean()
    .exec();

  if (res === null) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `No comments found with the given comment id: ${commentId} or the vote already exists`,
    });
  }

  return { hasLiked: reaction === 'LIKE' };
};

export default ReactOnComments;
