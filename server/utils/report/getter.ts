/* eslint-disable no-magic-numbers */
/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
import { render } from '@react-email/render';
import mongoose, { SortOrder } from 'mongoose';

import ContentTakeDownEmail from '../../emails/ContentTakeDown';
import { FILE_TYPE } from '../../constants/constants/upload';
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
import { Comment, Question, Report, UploadedFiles } from '../../models';
import {
  MAIL_EVENT_NAME,
  MONGO_READ_QUERY_TIMEOUT,
  MONGO_WRITE_QUERY_TIMEOUT,
} from '../../constants/constants/shared';

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

export const getEmailPayload = (data: any, contentType: 'COMMENT' | 'POST') => {
  if (contentType === 'POST') {
    const {
      uploadedBy,
      file: { url },
    } = data;
    if (!uploadedBy) return null;
    const { username, email } = uploadedBy;
    const emailHTML = render(
      ContentTakeDownEmail({ userFirstname: username, fileLink: url }),
      { pretty: true }
    );
    return { to: [email], subject: 'Your post was reported', html: emailHTML };
  }
  const { _id, userId, postId, message } = data;
  if (!userId) return null;
  const { username, email } = userId;
  const postLink = `${process.env.DOMAIN_URL}/filePreview/${postId}#${_id.toString()}`;
  const emailHTML = render(
    ContentTakeDownEmail({
      userFirstname: username,
      comment: { message, postLink },
    }),
    { pretty: true }
  );
  return { to: [email], subject: 'Your post was reported', html: emailHTML };
};

export const GET = ({
  contentType,
  action,
  adminId,
}: {
  contentType: (typeof CONTENT_TYPE)[number];
  action: 'RESOLVE' | 'UNRESOLVE';
  adminId: string;
}) => ({
  dataPopulation:
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
        },
  projection:
    contentType === 'COMMENT'
      ? { _id: 1, userId: 1, postId: 1, message: 1 }
      : { _id: 1, uploadedBy: 1, 'file.url': 1 },
  reportUpdate:
    action === 'RESOLVE'
      ? { resolved: { isResolved: true, adminId } }
      : { resolved: { isResolved: false } },
});

export const readDBPromises = async ({ postId }: { postId: string }) => {
  const info = await UploadedFiles.findOne({ metadata: postId })
    .select({ _id: 0, parentId: 1 })
    .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
    .lean()
    .exec();
  if (info === null) return undefined;
  return info.parentId;
};

export const writeDBPromises = ({
  action,
  reportId,
  contentType,
  adminId,
  session,
  postId,
  folderId,
}: {
  action: 'RESOLVE' | 'UNRESOLVE';
  reportId: string;
  contentType: (typeof CONTENT_TYPE)[number];
  adminId: string;
  postId: string;
  session: mongoose.ClientSession;
  folderId?: string;
}) => {
  const { dataPopulation, projection, reportUpdate } = GET({
    contentType,
    action,
    adminId,
  });
  const Collection: any = contentType === 'COMMENT' ? Comment : Question;
  const writePromises = [
    Report.findOneAndUpdate(
      {
        _id: reportId,
      },
      reportUpdate,
      {
        upsert: false,
        new: true,
      }
    )
      .select({ _id: 1 })
      .session(session)
      .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
      .lean()
      .exec(),
    Collection.findOneAndUpdate(
      { _id: postId, isFlagged: action === 'UNRESOLVE' },
      { isFlagged: action === 'RESOLVE' },
      { upsert: false, new: true }
    )
      .populate(dataPopulation)
      .select(projection)
      .session(session)
      .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
      .lean()
      .exec(),
  ];
  if (contentType === 'POST') {
    writePromises.push(
      UploadedFiles.findOneAndUpdate(
        { _id: folderId, fileType: FILE_TYPE.DIRECTORY },
        { $inc: { noOfFiles: action === 'RESOLVE' ? -1 : 1 } },
        { upsert: false, new: true }
      )
        .select({ _id: 1 })
        .session(session)
        .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
        .lean()
        .exec()
    );
  }
  return writePromises;
};
