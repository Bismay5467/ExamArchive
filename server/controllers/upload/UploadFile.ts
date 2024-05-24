/* eslint-disable no-case-declarations */
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

import { EXAM_TYPES } from '../../constants/constants/shared';
import { ErrorHandler } from '../../utils/errors/errorHandler';
import { Question } from '../../models';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import { SERVER_ERROR, SUCCESS_CODES } from '../../constants/statusCode';
import {
  TExamTypeExtended,
  TFile,
  TUploadFile,
} from '../../types/upload/types';
import { sanitizeInput, uploadToCloudinary } from '../../utils/upload/utils';

const uploadFilesToCloudinary = async (fileDataURIArray: TFile[]) => {
  const { status } = await cloudinary.api.ping();
  if (status !== 'ok') {
    console.error("Couldn't connect to cloudinary instance");
    throw new ErrorHandler(
      'Something went wrong. Please try again later',
      SERVER_ERROR['INTERNAL SERVER ERROR']
    );
  }
  const uploadFilePromises = fileDataURIArray.map((file) =>
    uploadToCloudinary(file.dataURI, file.name)
  );
  const result = await Promise.all(uploadFilePromises);
  return result;
};

const UploadFile = asyncErrorHandler(async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: string };
  const params = req.body.data as Array<TUploadFile<keyof typeof EXAM_TYPES>>;
  const paramsWithId: TExamTypeExtended<keyof typeof EXAM_TYPES> = [];
  // eslint-disable-next-line no-unused-vars
  Object.entries(params).forEach(([_, value]) => {
    paramsWithId.push({ ...value, userId });
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
      throw new ErrorHandler(
        'Something went wrong. Please try again later',
        SERVER_ERROR['INTERNAL SERVER ERROR']
      );
    });
  });
  await session.endSession();
  return res.status(SUCCESS_CODES.OK).json({
    message: 'File(s) were uploaded successfully. Thanks for your contribution',
  });
});

export default UploadFile;
