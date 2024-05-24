import mongoose from 'mongoose';
import { z } from 'zod';
import { Request, Response } from 'express';

import Comment from '../../../models/comment';
import { ErrorHandler } from '../../../utils/errors/errorHandler';
import { MONGO_WRITE_QUERY_TIMEOUT } from '../../../constants/constants/shared';
import asyncErrorHandler from '../../../utils/errors/asyncErrorHandler';
import { postCommentsInputSchema } from '../../../router/filePreview/comments/schema';
import {
  ERROR_CODES,
  SERVER_ERROR,
  SUCCESS_CODES,
} from '../../../constants/statusCode';

const PostComment = asyncErrorHandler(async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: string };
  const { parentId, postId, isEdited, message } = req.body.data as z.infer<
    typeof postCommentsInputSchema
  >;
  const sanitizedMessage = message.trim();

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
    const [[response], updateRes] = await Promise.all(writeToDBPromises);
    if (!updateRes && parentId) {
      await session.abortTransaction();
      throw new ErrorHandler(
        'No comment found with the given id',
        ERROR_CODES['NOT FOUND']
      );
    }
    if (!response) {
      await session.abortTransaction();
      throw new ErrorHandler(
        'Something went wrong. Please try again later',
        SERVER_ERROR['INTERNAL SERVER ERROR']
      );
    }
    // eslint-disable-next-line no-underscore-dangle
    commentId = response._id;
  });

  await session.endSession();
  return res
    .status(SUCCESS_CODES.CREATED)
    .json({ parentId, commentId: commentId?.toString() });
});

export default PostComment;
