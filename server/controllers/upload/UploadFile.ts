/* eslint-disable no-case-declarations */
import { TRPCError } from '@trpc/server';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';

import { EXAM_TYPES } from '../../constants/constants/shared';
import { Question } from '../../models';
import {
  TCache,
  TExamTypeExtended,
  TFile,
  TUploadFile,
} from '../../types/upload/types';
import {
  addDetailsToCache,
  getExamGroup,
  sanitizeInput,
  uploadToCloudinary,
} from '../../utils/upload/utils';

const uploadFilesToCloudinary = async (fileDataURIArray: TFile[]) => {
  const { status } = await cloudinary.api.ping();
  if (status !== 'ok') {
    console.error("Couldn't connect to cloudinary instance");
    throw new TRPCError({
      message: 'Something went wrong. Please try again later',
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
  const uploadFilePromises = fileDataURIArray.map((file) =>
    uploadToCloudinary(file.dataURI, file.name)
  );
  const result = await Promise.all(uploadFilePromises);
  return result;
};

const UploadFile = async (
  params: Array<TUploadFile<keyof typeof EXAM_TYPES>>,
  userId: string
) => {
  const paramsWithId: TExamTypeExtended<keyof typeof EXAM_TYPES> = [];
  const cacheInfo: TCache[] = [];
  // eslint-disable-next-line no-unused-vars
  Object.entries(params).forEach(([_, value]) => {
    const { examType, year } = value;
    const examGroup = getExamGroup(examType);
    paramsWithId.push({ ...value, userId });
    switch (examGroup) {
      case 'INSTITUTIONAL':
        const { institution, branch, semester, subjectCode } =
          value as TUploadFile<'INSTITUTIONAL'>;
        cacheInfo.push({
          key: `upload:${examType}-${year}-${institution}`,
          payload: { semester, subjectCode, branch },
        });
        break;
      default:
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `We are still to integrate the case for ${examType}. You may try again after a couple of weeks`,
        });
    }
  });
  const fileDataURIArray = paramsWithId.map((fileObj) => fileObj.file);
  const sanitizedFileArray = sanitizeInput(paramsWithId);
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    const writeToDBPromises = sanitizedFileArray.map((file) =>
      Question.create([file], { session })
    );
    await Promise.all([
      uploadFilesToCloudinary(fileDataURIArray),
      ...writeToDBPromises,
    ]).catch(async (error: Error) => {
      console.error(`Logging Error: ${error}`);
      await session.abortTransaction();
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong. Please try again later',
      });
    });
    const checkCache = cacheInfo.map((info) => addDetailsToCache({ ...info }));
    const res = await Promise.all(checkCache);
    res.forEach((result) => {
      if (result === null) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong.Please try again later',
        });
      } else if (result === 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message:
            'Similar paper already exists in your collection. Thanks for your contribution',
        });
      }
    });
  });
  await session.endSession();
};

export default UploadFile;
