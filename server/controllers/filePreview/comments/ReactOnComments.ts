/* eslint-disable no-unused-expressions */
/* eslint-disable indent */

import { z } from 'zod';
import { Request, Response } from 'express';

import Comment from '../../../models/comment';
import { ErrorHandler } from '../../../utils/errors/errorHandler';
import { MONGO_WRITE_QUERY_TIMEOUT } from '../../../constants/constants/shared';
import asyncErrorHandler from '../../../utils/errors/asyncErrorHandler';
import { reactCommentInputSchema } from '../../../router/filePreview/comments/schema';
import { ERROR_CODES, SUCCESS_CODES } from '../../../constants/statusCode';

const ReactOnComments = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { userId: voterId } = req.body as { userId: string };
    const { commentId, action, reaction } = req.body.data as z.infer<
      typeof reactCommentInputSchema
    >;
    const filter = { id: commentId, isFlagged: false, isDeleted: false };
    if (reaction === 'RETRACE') {
      if (action === 'DOWNVOTE') {
        Object.assign(filter, { 'downVotes.voters': { $in: [voterId] } });
      }
    } else {
      action === 'DOWNVOTE'
        ? Object.assign(filter, { 'downVotes.voters': { $ne: voterId } })
        : Object.assign(filter, { 'upVotes.voters': { $ne: voterId } });
    }

    let updateOperator;

    if (reaction === 'VOTE') {
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

    const result = await Comment.findOneAndUpdate(
      filter,
      updateOperator,
      updateOptions
    )
      .select({ _id: 1 })
      .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
      .lean()
      .exec();

    if (result === null) {
      throw new ErrorHandler(
        'No comments found with the given comment id or the vote already exists',
        ERROR_CODES['NOT FOUND']
      );
    }

    return res.status(SUCCESS_CODES.OK).json({ hasVoted: reaction === 'VOTE' });
  }
);

export default ReactOnComments;
