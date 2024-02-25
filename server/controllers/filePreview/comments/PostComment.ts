import { TRPCError } from '@trpc/server';
import mongoose from 'mongoose';

import Comment from '../../../models/comment';
import { MONGO_WRITE_QUERY_TIMEOUT } from '../../../constants/constants/shared';
import connectDB from '../../../config/dbConfig';

const PostComment = async ({
  parentId,
  postId,
  isEdited,
  userId,
  message,
}: {
  parentId?: string;
  postId: string;
  isEdited?: boolean;
  userId: string;
  message: string;
}) => {
  const sanitizedMessage = message.trim();

  await connectDB();
  const session = await mongoose.startSession();

  let commentId: any;

  await session.withTransaction(async () => {
    const docs = {
      postId,
      isEdited: isEdited ?? false,
      userId,
      message: sanitizedMessage,
    };

    if (parentId) Object.assign(docs, { parentId });
    const writeToDBPromises: any[] = [Comment.create([docs], { session })];

    if (parentId) {
      writeToDBPromises.push(
        Comment.findOneAndUpdate(
          { _id: parentId, isDeleted: false },
          { $inc: { replyCount: 1 } },
          { upsert: false, new: true }
        )
          .select({ _id: 1 })
          .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
          .session(session)
          .lean()
          .exec()
      );
    }
    const [[res], updateRes] = await Promise.all(writeToDBPromises);

    if (!updateRes) {
      await session.abortTransaction();
      throw new TRPCError({
        message: 'No comment found with the given id',
        code: 'NOT_FOUND',
      });
    }
    if (!res) {
      await session.abortTransaction();
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong. Please try again later',
      });
    }
    // eslint-disable-next-line no-underscore-dangle
    commentId = res._id;
  });

  await session.endSession();

  return { parentId, commentId: commentId?.toString() };
};

export default PostComment;
