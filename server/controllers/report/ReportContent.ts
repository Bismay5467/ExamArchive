import { TRPCError } from '@trpc/server';
import mongoose from 'mongoose';
import { render } from '@react-email/render';

import ReportNotificationEmail from '../../emails/ReportNotification';
import getAdminInfo from '../../utils/admin/getAdminInfo';
import notifyMutipleUsers from '../../utils/notification/notifyMultipleUser';
import sendMail from '../../utils/emails/sendMail';
import { Comment, Question, Report } from '../../models';
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

const ReportContent = async ({
  postId,
  reason,
  contentType,
}: {
  postId: string;
  reason: { rank: number; reason: (typeof reasonsForReport)[number] };
  contentType: 'COMMENT' | 'POST';
}) => {
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    const Collection: any = contentType === 'COMMENT' ? Comment : Question;
    const docModel = contentType === 'COMMENT' ? 'Comment' : 'Question';
    const [doesPostExists, reportInfo] = await Promise.all([
      Collection.findOne({ _id: postId, isFlagged: false })
        .select({ _id: 1 })
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
    if (doesPostExists === null) {
      await session.abortTransaction();
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Post not found or the post is already flagged for violation',
      });
    }
    if (reportInfo === null) {
      await session.abortTransaction();
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong. Please try again later',
      });
    }
    const { totalReport, reasons } = reportInfo as unknown as {
      totalReport: number;
      reasons: typeof reasonsForReport;
    };
    if (
      totalReport !== SENDING_MAIL_FREQUENCY &&
      totalReport % SENDING_MAIL_FREQUENCY === 0
    ) {
      // TODO: Create the redirect URL.
      const info = await getAdminInfo();
      if (info === null) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong. Please try again later',
        });
      }
      const { adminIds, adminEmailIds } = info;
      const emailHTML = render(
        ReportNotificationEmail({
          postId,
          totalNoOfReports: totalReport,
          reasons,
        }),
        { pretty: true }
      );
      await Promise.all([
        sendMail({
          eventName: MAIL_EVENT_NAME,
          payload: {
            to: adminEmailIds,
            subject: 'Violation of Code of Conduct',
            html: emailHTML,
          },
        }),
        notifyMutipleUsers({
          topic: { key: NOVU_TOPIC.KEY, name: NOVU_TOPIC.NAME },
          subscribers: adminIds,
          workflowIndentifier: NOVU_WORKFLOW_IDENTIFIER,
          payload: { contentType, redirectURL: 'https://example.com' },
        }),
      ]);
    }
  });
  await session.endSession();
};

export default ReportContent;
