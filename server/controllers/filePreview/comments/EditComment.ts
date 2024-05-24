import { z } from 'zod';
import { Request, Response } from 'express';

import Comment from '../../../models/comment';
import { ErrorHandler } from '../../../utils/errors/errorHandler';
import { MONGO_WRITE_QUERY_TIMEOUT } from '../../../constants/constants/shared';
import asyncErrorHandler from '../../../utils/errors/asyncErrorHandler';
import { editCommentInputSchema } from '../../../router/filePreview/comments/schema';
import { ERROR_CODES, SUCCESS_CODES } from '../../../constants/statusCode';

const EditComment = asyncErrorHandler(async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: string };
  const { commentId, message } = req.body.data as z.infer<
    typeof editCommentInputSchema
  >;
  const result = await Comment.findOneAndUpdate(
    { _id: commentId, userId, isFlagged: false, isDeleted: false },
    { isEdited: true, message },
    { upsert: false, new: true }
  )
    .select({ _id: 1 })
    .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
    .lean()
    .exec();

  if (result === null) {
    throw new ErrorHandler(
      'No comments found with the given comment Id',
      ERROR_CODES['NOT FOUND']
    );
  }
  return res.status(SUCCESS_CODES.OK).json({ message: 'Comment was edited' });
});

export default EditComment;
