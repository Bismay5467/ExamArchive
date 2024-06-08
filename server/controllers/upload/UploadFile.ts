/* eslint-disable no-magic-numbers */
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { FILE_TYPE } from '../../constants/constants/upload';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import {
  EXAM_TYPES,
  MONGO_READ_QUERY_TIMEOUT,
} from '../../constants/constants/shared';
import { Question, UploadedFiles } from '../../models';
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

const writeToDBPromises = ({
  sanitizedFileArray,
  session,
}: {
  sanitizedFileArray: any[];
  session: mongoose.mongo.ClientSession;
}) => {
  const writePromises = sanitizedFileArray.map((file) => {
    const { folderId, ...newFileObj } = file;
    const fileId = new mongoose.Types.ObjectId();
    Object.assign(newFileObj, { _id: fileId });
    return [
      Question.create([newFileObj], { session }),
      UploadedFiles.findOneAndUpdate(
        {
          _id: folderId,
          fileType: FILE_TYPE.DIRECTORY,
          userId: file.uploadedBy,
        },
        { $inc: { noOfFiles: 1 } },
        { upsert: false, new: true }
      )
        .select({ _id: 1 })
        .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
        .session(session)
        .lean()
        .exec(),
      UploadedFiles.findOneAndUpdate(
        {
          metadata: fileId,
          userId: file.uploadedBy,
          fileType: FILE_TYPE.FILE,
        },
        { parentId: folderId, name: file.filename },
        { upsert: true, new: false }
      )
        .select({ _id: 1 })
        .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
        .session(session)
        .lean()
        .exec(),
    ];
  });
  return writePromises.flat(2);
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
    const writePromises = writeToDBPromises({ sanitizedFileArray, session });
    await Promise.all([
      uploadFilesToCloudinary(fileDataURIArray),
      ...writePromises,
    ]).catch(async (error: Error) => {
      console.error(`Logging Error: ${error}`);
      await session.abortTransaction();
      throw new ErrorHandler(
        JSON.stringify(error),
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
