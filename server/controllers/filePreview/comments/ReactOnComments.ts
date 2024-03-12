/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
import { TRPCError } from '@trpc/server';

import Comment from '../../../models/comment';
import { MONGO_WRITE_QUERY_TIMEOUT } from '../../../constants/constants/shared';
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
      ? { _id: commentId, isFlagged: false, isDeleted: false }
      : action === 'DOWNVOTE'
        ? {
            _id: commentId,
            'downVotes.voters': { $ne: voterId },
            isFlagged: false,
            isDeleted: false,
          }
        : {
            _id: commentId,
            'upVotes.voters': { $ne: voterId },
            isFlagged: false,
            isDeleted: false,
          };

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
      message:
        'No comments found with the given comment id or the vote already exists',
    });
  }

  return { hasLiked: reaction === 'LIKE' };
};

export default ReactOnComments;
