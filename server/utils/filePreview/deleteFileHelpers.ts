import mongoose from 'mongoose';
import { render } from '@react-email/render';

import ContentTakeDownEmail from '../../emails/ContentTakeDown';
import { FILE_TYPE } from '../../constants/constants/upload';
import sendMail from '../emails/sendMail';
import {
  BookMarkedFile,
  Comment,
  Question,
  Rating,
  Report,
  UploadedFiles,
} from '../../models';
import {
  MAIL_EVENT_NAME,
  MONGO_READ_QUERY_TIMEOUT,
  MONGO_WRITE_QUERY_TIMEOUT,
} from '../../constants/constants/shared';

export const getFolderIds = async ({
  postId,
  session,
}: {
  postId: string;
  session: mongoose.mongo.ClientSession;
}) => {
  let [uploadFolderIds, bookmarkFolderIds] = (await Promise.all([
    UploadedFiles.find({ metadata: postId, fileType: FILE_TYPE.FILE })
      .select({ _id: 0, parentId: 1 })
      .session(session)
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .lean()
      .exec(),
    BookMarkedFile.find({ metadata: postId, fileType: FILE_TYPE.FILE })
      .select({ _id: 0, parentId: 1 })
      .session(session)
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .lean()
      .exec(),
  ])) as [any[], any[]];
  uploadFolderIds = uploadFolderIds.map(({ parentId }) => parentId);
  bookmarkFolderIds = bookmarkFolderIds.map(({ parentId }) => parentId);
  return { uploadFolderIds, bookmarkFolderIds };
};

export const decreaseFileCountInFolder = ({
  uploadFolderIds,
  bookmarkFolderIds,
  session,
}: {
  uploadFolderIds: any[];
  bookmarkFolderIds: any[];
  session: mongoose.mongo.ClientSession;
}) => [
  ...uploadFolderIds.map((folderId) =>
    UploadedFiles.findOneAndUpdate(
      { _id: folderId, fileType: FILE_TYPE.DIRECTORY },
      { $inc: { noOfFiles: -1 } },
      { upsert: false, new: false }
    )
      .select({ _id: 1 })
      .session(session)
      .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
      .lean()
  ),
  ...bookmarkFolderIds.map((folderId) =>
    BookMarkedFile.findOneAndUpdate(
      { _id: folderId, fileType: FILE_TYPE.DIRECTORY },
      { $inc: { noOfFiles: -1 } },
      { upsert: false, new: false }
    )
      .select({ _id: 1 })
      .session(session)
      .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
      .lean()
  ),
];

export const sendMailToOwner = async ({
  questionInfo,
}: {
  questionInfo: any;
}) => {
  const {
    file: { url },
    uploadedBy,
  } = questionInfo as unknown as {
    file: { url: string };
    uploadedBy: { username: string; email: string };
  };
  if (typeof uploadedBy === 'object' && uploadedBy !== null) {
    const { username, email } = uploadedBy;
    const emailHTML = render(
      ContentTakeDownEmail({
        userFirstname: username,
        fileLink: url,
      }),
      { pretty: true }
    );
    await sendMail({
      eventName: MAIL_EVENT_NAME,
      payload: {
        to: [email],
        subject: 'Your post was reported',
        html: emailHTML,
      },
    });
  }
};

export const deleteFileFromDBPromises = ({
  postId,
  session,
}: {
  postId: string;
  session: mongoose.mongo.ClientSession;
}) => [
  Question.findByIdAndDelete({ _id: postId })
    .populate({ path: 'uploadedBy', select: { email: 1, username: 1 } })
    .select({ 'file.url': 1, uploadedBy: 1 })
    .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
    .session(session)
    .lean()
    .exec(),
  Rating.deleteMany({ postId })
    .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
    .session(session)
    .lean()
    .exec(),
  Comment.deleteMany({ postId })
    .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
    .session(session)
    .lean()
    .exec(),
  BookMarkedFile.deleteMany({ metadata: postId })
    .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
    .session(session)
    .lean()
    .exec(),
  UploadedFiles.deleteMany({ metadata: postId })
    .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
    .session(session)
    .lean()
    .exec(),
  Report.deleteMany({ postId })
    .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
    .session(session)
    .lean()
    .exec(),
];
