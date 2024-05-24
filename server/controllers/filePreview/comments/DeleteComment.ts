import mongoose from 'mongoose';
import { render } from '@react-email/render';
import { z } from 'zod';
import { Request, Response } from 'express';

import { Comment } from '../../../models';
import ContentTakeDownEmail from '../../../emails/ContentTakeDown';
import { ErrorHandler } from '../../../utils/errors/errorHandler';
import { TRole } from '../../../types/auth/types';
import asyncErrorHandler from '../../../utils/errors/asyncErrorHandler';
import { deleteCommentInputSchema } from '../../../router/filePreview/comments/schema';
import getComment from '../../../utils/filePreview/getComment';
import sendMail from '../../../utils/emails/sendMail';
import { ERROR_CODES, SUCCESS_CODES } from '../../../constants/statusCode';
import {
  MAIL_EVENT_NAME,
  MONGO_WRITE_QUERY_TIMEOUT,
} from '../../../constants/constants/shared';

const DeleteComment = asyncErrorHandler(async (req: Request, res: Response) => {
  const { userId, role } = req.body as { userId: string; role: TRole };
  const { commentId, parentId } = req.body.data as z.infer<
    typeof deleteCommentInputSchema
  >;
  const session = await mongoose.startSession();
  if (parentId && parentId === commentId) {
    throw new ErrorHandler('Invalid ids', ERROR_CODES.CONFLICT);
  }
  await session.withTransaction(async () => {
    const filter =
      role === 'USER'
        ? { _id: commentId, userId, isDeleted: false }
        : { _id: commentId, isDeleted: false };
    const updatePromises: any[] = [
      Comment.findOneAndUpdate(
        filter,
        { isDeleted: true },
        { upsert: false, new: true }
      )
        .populate({
          path: 'userId',
          select: { username: 1, email: 1 },
          strictPopulate: false,
        })
        .select({ _id: 1, message: 1, postId: 1 })
        .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
        .session(session)
        .lean()
        .exec(),
    ];
    if (parentId) {
      updatePromises.push(
        Comment.findByIdAndUpdate(
          { _id: parentId },
          { $inc: { replyCount: -1 } },
          { upsert: false, new: true }
        )
          .select({ _id: 1 })
          .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
          .session(session)
          .lean()
          .exec()
      );
    }
    const [updateState, updateReplyCount] = await Promise.all(updatePromises);
    if (!updateState) {
      await session.abortTransaction();
      throw new ErrorHandler(
        'Comment was either already deleted or no comment exists with the given id',
        ERROR_CODES['NOT FOUND']
      );
    }
    if (!updateReplyCount && parentId) {
      await session.abortTransaction();
      throw new ErrorHandler(
        'No comment found with the given id',
        ERROR_CODES['NOT FOUND']
      );
    }
    if (role === 'ADMIN') {
      const { userId: commenterId, message, postId } = updateState;
      if (userId !== null && Object.keys(userId).length > 0) {
        const { username, email } = commenterId as {
          username: string;
          email: string;
        };
        const emailHTML = render(
          ContentTakeDownEmail({
            userFirstname: username,
            comment: getComment({ message, postId, commentId }),
          }),
          { pretty: true }
        );
        await sendMail({
          eventName: MAIL_EVENT_NAME,
          payload: {
            to: [email],
            subject: 'Your comment was reported',
            html: emailHTML,
          },
        });
      }
    }
  });

  await session.endSession();
  return res
    .status(SUCCESS_CODES['NO CONTENT'])
    .json({ message: 'Comment deleted' });
});

export default DeleteComment;
