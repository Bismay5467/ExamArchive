import { TRPCError } from '@trpc/server';
import mongoose from 'mongoose';
import { render } from '@react-email/render';

import ContentTakeDownEmail from '../../../emails/ContentTakeDown';
import { ROLE } from '../../../constants/constants/auth';
import sendMail from '../../../utils/emails/sendMail';
import { Comment, User } from '../../../models';
import {
  MAIL_EVENT_NAME,
  MONGO_READ_QUERY_TIMEOUT,
  MONGO_WRITE_QUERY_TIMEOUT,
} from '../../../constants/constants/shared';

const DeleteComment = async ({
  userId,
  commentId,
  parentId,
  role,
}: {
  commentId: string;
  parentId?: string;
  userId: string;
  role: keyof typeof ROLE;
}) => {
  const session = await mongoose.startSession();
  if (parentId && parentId === commentId) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Parent and child comment ids are the same',
    });
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
        .select({ _id: 1, message: 1 })
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
    if (role === 'ADMIN') {
      updatePromises.push(
        User.findById({ _id: userId })
          .select({ username: 1, email: 1 })
          .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
          .session(session)
          .lean()
          .exec()
      );
    }
    const [updateState, updateReplyCount, user] =
      await Promise.all(updatePromises);
    if (!updateState) {
      await session.abortTransaction();
      throw new TRPCError({
        code: 'NOT_FOUND',
        message:
          'Comment was either already deleted or no comment exists with the given id',
      });
    }
    if (!updateReplyCount) {
      await session.abortTransaction();
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No comment found with the given id',
      });
    }
    if (role === 'ADMIN') {
      if (user === null) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }
      const emailHTML = render(
        ContentTakeDownEmail({
          userFirstname: (user as any).username,
          comment: (updateState as any).message,
        }),
        { pretty: true }
      );
      await sendMail({
        eventName: MAIL_EVENT_NAME,
        payload: {
          to: [(user as any).email],
          subject: 'Your comment was reported',
          html: emailHTML,
        },
      });
    }
  });

  await session.endSession();
};

export default DeleteComment;
