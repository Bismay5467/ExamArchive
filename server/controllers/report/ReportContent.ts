import mongoose from 'mongoose';
import { render } from '@react-email/render';
import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import ReportNotificationEmail from '../../emails/ReportNotification';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import getSuperAdminInfo from '../../utils/superadmin/getSuperAdminInfo';
import notifyMutipleUsers from '../../utils/notification/notifyMultipleUser';
import { reportContentInputSchema } from '../../router/report/schema';
import sendMail from '../../utils/emails/sendMail';
import { Comment, Question, Report } from '../../models';
import {
  ERROR_CODES,
  SERVER_ERROR,
  SUCCESS_CODES,
} from '../../constants/statusCode';
import {
  MAIL_EVENT_NAME,
  MONGO_READ_QUERY_TIMEOUT,
} from '../../constants/constants/shared';
import {
  NOVU_TOPIC,
  NOVU_WORKFLOW_IDENTIFIER,
  SENDING_MAIL_FREQUENCY,
  reasonsForReport,
} from '../../constants/constants/report';

const ReportContent = asyncErrorHandler(async (req: Request, res: Response) => {
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
      Report.findOneAndUpdate(
        { docModel, postId },
        {
          $addToSet: { reasons: reason.reason },
          $inc: { totalReport: reason.rank },
        },
        { upsert: true, new: true }
      )
        .select({ resolved: 0 })
        .session(session)
        .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
        .lean()
        .exec(),
    ]);
    if (post === null) {
      await session.abortTransaction();
      throw new ErrorHandler(
        'Post not found or the post is already flagged for violation',
        ERROR_CODES['NOT FOUND']
      );
    }
    if (reportInfo === null) {
      await session.abortTransaction();
      throw new ErrorHandler(
        'Something went wrong. Please try again later',
        SERVER_ERROR['INTERNAL SERVER ERROR']
      );
    }
    const { totalReport, reasons } = reportInfo as unknown as {
      totalReport: number;
      reasons: typeof reasonsForReport;
    };
    if (
      totalReport > SENDING_MAIL_FREQUENCY &&
      totalReport % SENDING_MAIL_FREQUENCY === 0
    ) {
      const postLink =
        contentType === 'POST'
          ? `${process.env.DOMAIN_URL}/filePreview/${postId}`
          : `${process.env.DOMAIN_URL}/filePreview/${post.postId}#${postId}`;
      const info = await getSuperAdminInfo();
      if (info !== null) {
        const { ids, emailIds } = info;
        const emailHTML = render(
          ReportNotificationEmail({
            postLink,
            totalNoOfReports: totalReport,
            reasons,
          }),
          { pretty: true }
        );
        await Promise.all([
          sendMail({
            eventName: MAIL_EVENT_NAME,
            payload: {
              to: emailIds,
              subject: 'Violation of Code of Conduct',
              html: emailHTML,
            },
          }),
          notifyMutipleUsers({
            topic: { key: NOVU_TOPIC.KEY, name: NOVU_TOPIC.NAME },
            subscribers: ids,
            workflowIndentifier: NOVU_WORKFLOW_IDENTIFIER,
            payload: { contentType, redirectURL: postLink },
          }),
        ]);
      }
    }
  });
  await session.endSession();
  res.status(SUCCESS_CODES.OK).json({
    message:
      "Thanks for flagging the post. We'll take a look at it and take the neccsary steps",
  });
});

export default ReportContent;
