/* eslint-disable no-nested-ternary */
import { SortOrder } from 'mongoose';
import { render } from '@react-email/render';

import { MAIL_EVENT_NAME } from '../../constants/constants/shared';
import ReportNotificationEmail from '../../emails/ReportNotification';
import { getFilePreviewLink } from '../../constants/constants/filePreview';
import getSuperAdminInfo from '../superadmin/getSuperAdminInfo';
import notifyMutipleUsers from '../notification/notifyMultipleUser';
import sendMail from '../emails/sendMail';
import {
  CONTENT_TYPE,
  NOVU_TOPIC,
  NOVU_WORKFLOW_IDENTIFIER,
  REPORT_COUNT,
  SENDING_MAIL_FREQUENCY,
  SORT_FILTERS,
  reasonsForReport,
} from '../../constants/constants/report';

export const getQuery = ({
  action,
  contentType,
}: {
  action: 'PENDING' | 'RESOLVED';
  contentType?: (typeof CONTENT_TYPE)[number];
}) => ({
  ...(contentType === 'COMMENT'
    ? { docModel: 'Comment' }
    : contentType === 'POST'
      ? { docModel: 'Question' }
      : { docModel: { $in: ['Comment', 'Question'] } }),
  ...(action === 'PENDING'
    ? { 'resolved.isResolved': false }
    : { 'resolved.isResolved': true }),
});

export const getSortOptions = ({
  sortFilters,
  countOfReports,
}: {
  sortFilters?: (typeof SORT_FILTERS)[number];
  countOfReports?: (typeof REPORT_COUNT)[number];
}) =>
  ({
    ...(sortFilters === 'LEAST RECENT'
      ? { updatedAt: 'asc' }
      : { updatedAt: 'desc' }),
    ...(countOfReports === 'LEAST COUNT'
      ? { totalReports: 'asc' }
      : { totalReports: 'desc' }),
  }) as { [key: string]: SortOrder | { $meta: any } };

export const getReasons = (reasons: any) =>
  reasons.map((r: any) => r.reason) as typeof reasonsForReport;

export const sendNotificationHelper = async ({
  contentType,
  postId,
  totalNoOfReports,
  reasons,
}: {
  postId: string;
  totalNoOfReports: number;
  reasons: typeof reasonsForReport;
  contentType: 'POST' | 'COMMENT';
}) => {
  if (
    totalNoOfReports === 0 ||
    totalNoOfReports % SENDING_MAIL_FREQUENCY !== 0
  ) {
    return;
  }
  const postLink =
    contentType === 'POST'
      ? `${process.env.DOMAIN_URL}${getFilePreviewLink(postId)}`
      : '';
  const content =
    contentType === 'POST'
      ? { type: 'POST', link: postLink }
      : { type: 'COMMENT', message: '' };
  const info = await getSuperAdminInfo();
  if (info !== null) {
    const { ids, emailIds } = info;
    const emailHTML = render(
      ReportNotificationEmail({
        content,
        totalNoOfReports,
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
};
