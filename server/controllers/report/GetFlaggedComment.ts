import { z } from 'zod';
import { Request, Response } from 'express';

import { Comment } from '../../models';
import { ErrorHandler } from '../../utils/errors/errorHandler';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import { getCommentInputSchema } from '../../router/report/schema';
import { ERROR_CODES, SUCCESS_CODES } from '../../constants/statusCode';

const GetFlaggedComment = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { commentId } = req.body.data as z.infer<
      typeof getCommentInputSchema
    >;
    const result = await Comment.findOne({ _id: commentId })
      .select({ message: 1 })
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .lean()
      .exec();
    if (result === null) {
      throw new ErrorHandler(
        'No comment found with this ID',
        ERROR_CODES['NOT FOUND']
      );
    }
    return res.status(SUCCESS_CODES.OK).json({ data: result });
  }
);

export default GetFlaggedComment;
