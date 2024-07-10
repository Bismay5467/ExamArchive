/* eslint-disable indent */
import mongoose from 'mongoose';
import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { MONGO_WRITE_QUERY_TIMEOUT } from '../../constants/constants/shared';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import { markAsUnresolvedInputSchema } from '../../router/report/schema';
import { Comment, Question, Report } from '../../models';
import { ERROR_CODES, SUCCESS_CODES } from '../../constants/statusCode';

const MarkAsUnresolved = asyncErrorHandler(
  async (req: Request, res: Response) => {
    // const { userId: adminId } = req.body as { userId: string };
    const { reportId, postId, contentType } = req.body.data as z.infer<
      typeof markAsUnresolvedInputSchema
    >;
    const Collection: any = contentType === 'COMMENT' ? Comment : Question;
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const populate =
        contentType === 'COMMENT'
          ? {
              path: 'userId',
              select: { username: 1, email: 1, _id: 0 },
              strictPopulate: false,
            }
          : {
              path: 'uploadedBy',
              select: { username: 1, email: 1, _id: 0 },
              strictPopulate: false,
            };
      const projection =
        contentType === 'COMMENT'
          ? { _id: 1, userId: 1, postId: 1, message: 1 }
          : { _id: 1, uploadedBy: 1, 'file.url': 1 };
      const [isReportMarkedUnresolved, isContentUnflagged] = await Promise.all([
        Report.findOneAndUpdate(
          {
            _id: reportId,
            resolved: { isResolved: true },
          },
          { resolved: { isResolved: false, adminId: null } },
          { upsert: false, new: true }
        )
          .select({ _id: 1 })
          .session(session)
          .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
          .lean()
          .exec(),
        Collection.findOneAndUpdate(
          { _id: postId, isFlagged: true },
          { isFlagged: false },
          { upsert: false, new: true }
        )
          .populate(populate)
          .select(projection)
          .session(session)
          .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
          .lean()
          .exec(),
      ]);
      if (!(isReportMarkedUnresolved && isContentUnflagged)) {
        await session.abortTransaction();
        throw new ErrorHandler(
          'No document found matching the specified id',
          ERROR_CODES['NOT FOUND']
        );
      }
    });
    await session.endSession();
    return res
      .status(SUCCESS_CODES['NO CONTENT'])
      .json({ message: 'Marked unresolved' });
  }
);

export default MarkAsUnresolved;
