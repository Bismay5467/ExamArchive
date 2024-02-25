import { TRPCError } from '@trpc/server';
import mongoose from 'mongoose';

import Comment from '../../../models/comment';
import { MONGO_WRITE_QUERY_TIMEOUT } from '../../../constants/constants/shared';
import connectDB from '../../../config/dbConfig';

const DeleteComment = async ({
  userId,
  commentId,
  parentId,
}: {
  commentId: string;
  parentId?: string;
  userId: string;
}) => {
  const session = await mongoose.startSession();
  await connectDB();

  if (parentId && parentId === commentId) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Parent and child comment ids are the same',
    });
  }

  await session.withTransaction(async () => {
    const updatePromises: any[] = [
      Comment.findOneAndUpdate(
        { _id: commentId, userId, isDeleted: false },
        { isDeleted: true },
        { upsert: false, new: true }
      )
        .select({ _id: 1 })
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
  });

  await session.endSession();
};

export default DeleteComment;
