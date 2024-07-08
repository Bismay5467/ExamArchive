import { FILE_UPLOAD_STATUS } from '../../constants/constants/upload';

/* eslint-disable prefer-destructuring */
export default ({
  files,
  action,
}: {
  files: any[];
  action: 'BOOKMARK' | 'UPLOAD';
}) =>
  files.map(
    ({
      _id: fileId,
      metadata,
      name,
      isPinned,
    }: {
      _id: string;
      metadata: any[];
      name?: string;
      isPinned?: boolean;
    }) => {
      if (action === 'BOOKMARK') {
        if (Array.isArray(metadata) && metadata.length === 0) return {};
        const { createdAt, updatedAt, _id: questionId } = metadata[0];
        return {
          fileId,
          questionId,
          filename: name,
          createdAt,
          updatedAt,
          isPinned: isPinned ?? false,
        };
      }
      if (action === 'UPLOAD') {
        if (Array.isArray(metadata) && metadata.length === 0) return {};
        const {
          _id: questionId,
          file: { filename },
          createdAt,
          updatedAt,
          status,
        } = metadata[0];
        return {
          fileId,
          questionId,
          filename,
          createdAt,
          updatedAt,
          status: status ?? FILE_UPLOAD_STATUS.UPLOADED,
        };
      }
      return {};
    }
  );

export const sanitizePinnedFilesInfo = ({ files }: { files: any[] }) =>
  files.map(
    ({
      metadata,
      name,
      updatedAt,
    }: {
      metadata: any[];
      name: string;
      updatedAt: string;
    }) => {
      const { _id: questionId } = metadata[0];
      return { questionId, name, updatedAt };
    }
  );
