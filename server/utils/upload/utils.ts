/* eslint-disable camelcase */
/* eslint-disable no-case-declarations */
import { v2 as cloudinary } from 'cloudinary';

import { ERROR_CODES } from '../../constants/statusCode';
import { EXAM_TYPES } from '../../constants/constants/shared';
import { ErrorHandler } from '../errors/errorHandler';
import { FILE_UPLOAD_STATUS } from '../../constants/constants/upload';
import {
  TExamType,
  TExamTypeExtended,
  TUploadFile,
} from '../../types/upload/types';

export const getExamGroup = (examType: TExamType<keyof typeof EXAM_TYPES>) =>
  // eslint-disable-next-line no-unused-vars
  Object.entries(EXAM_TYPES).find(([_, type]) =>
    Object.values(type).includes(examType)
  )?.[0] as keyof typeof EXAM_TYPES | undefined;

export const getFileName = (fileName: string) => {
  const [filename, extension] = fileName.split('.');
  return `${filename.split(' ').join('_')}_${Date.now()}.${extension}`;
};

export const sanitizeInput = (
  fileInfo: TExamTypeExtended<keyof typeof EXAM_TYPES>
) => {
  const sanitizedFileArray = fileInfo.map((file) => {
    const {
      userId,
      tags,
      year,
      examType,
      file: { name: filename },
      folderId,
    } = file;
    const fileObj = {
      tags: tags.split(','),
      uploadedBy: userId,
      year,
      examType,
      file: { filename },
      folderId,
      status: FILE_UPLOAD_STATUS.PROCESSING,
    };
    const examGroup = getExamGroup(examType);
    switch (examGroup) {
      case 'INSTITUTIONAL':
        const { institution, branch, semester, subjectCode, subjectName } =
          file as TUploadFile<'INSTITUTIONAL'>;
        Object.assign(fileObj, {
          institutionName: institution,
          branch,
          semester,
          subjectCode,
          subjectName,
        });
        break;
      default:
        throw new ErrorHandler(
          `We are still to integrate the case for ${examType}. You may try again after a couple of weeks`,
          ERROR_CODES['BAD REQUEST']
        );
    }
    return fileObj;
  });
  return sanitizedFileArray;
};

export const uploadToCloudinary = (dataURI: string, filename: string) =>
  cloudinary.uploader.upload(dataURI, {
    upload_preset: process.env.CLOUDINARY_PRESET,
    public_id: filename,
    resource_type: 'auto',
  });
