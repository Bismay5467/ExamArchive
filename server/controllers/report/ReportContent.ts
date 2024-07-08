import mongoose from 'mongoose';
import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import { reportContentInputSchema } from '../../router/report/schema';
import { Comment, Question, Report } from '../../models';
import { ERROR_CODES, SUCCESS_CODES } from '../../constants/statusCode';
import { getReasons, sendNotificationHelper } from '../../utils/report/getter';

const ReportContent = asyncErrorHandler(async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: string };
  const { postId, reason, contentType } = req.body.data as z.infer<
    typeof reportContentInputSchema
  >;
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    const Collection: any = contentType === 'COMMENT' ? Comment : Question;
    const docModel = contentType === 'COMMENT' ? 'Comment' : 'Question';
    const projection = { _id: 1 };
    const [post, reportInfo] = await Promise.all([
      Collection.findOne({ _id: postId, isFlagged: false })
        .select(projection)
        .session(session)
        .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
        .lean()
        .exec(),
      Report.findOne({
        docModel,
        postId: new mongoose.Types.ObjectId(postId),
      })
        .select({ totalReport: 1, reasons: 1, userIds: 1 })
        .session(session)
        .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
        .exec() as any,
    ]);
    if (post === null) {
      await session.abortTransaction();
      throw new ErrorHandler(
        'Post not found or the post is already flagged for violation',
        ERROR_CODES['NOT FOUND']
      );
    }
    let info;
    if (reportInfo === null) {
      const newReportObj = {
        docModel,
        postId,
        userIds: [userId],
        totalReport: reason.rank,
        reasons: [{ reason: reason.reason, count: 1 }],
      };
      info = await Report.create([newReportObj], { session });
    } else {
      const hasUserReportedBefore =
        reportInfo.userIds.find(
          (id: any) => id.toString() === userId.toString()
        ) ?? false;
      if (hasUserReportedBefore !== false) {
        throw new ErrorHandler(
          'Seems like you have reported this post before. Anyway thanks for bringing it to our notice.',
          ERROR_CODES.CONFLICT
        );
      }
      reportInfo.userIds.push(new mongoose.Types.ObjectId(userId));
      reportInfo.totalReport += reason.rank;
      let isPresent = false;
      for (let i = 0; i < reportInfo.reasons.length; i++) {
        if (
          reportInfo.reasons[i].reason.trim().toLowerCase() ===
          reason.reason.trim().toLowerCase()
        ) {
          isPresent = true;
          reportInfo.reasons[i].count += 1;
        }
      }
      if (isPresent === false) {
        reportInfo.reasons.push({ reason: reason.reason, count: 1 });
      }
      info = await reportInfo.save();
    }
    const { totalReport, reasons } = info;
    await sendNotificationHelper({
      contentType,
      postId,
      totalNoOfReports: totalReport,
      reasons: getReasons(reasons),
    });
  });
  await session.endSession();
  res.status(SUCCESS_CODES.OK).json({
    message:
      "Thanks for flagging the post. We'll take a look at it and take the neccsary steps",
  });
});

export default ReportContent;
