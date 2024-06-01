/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { FILE_TYPE } from '../../constants/constants/upload';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import { createFolderInputSchema } from '../../router/folder/schema';
import { BookMarkedFile, UploadedFiles } from '../../models/files';
import {
  ERROR_CODES,
  SERVER_ERROR,
  SUCCESS_CODES,
} from '../../constants/statusCode';

const CreateFolder = asyncErrorHandler(async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: string };
  const { folderName, action } = req.body.data as z.infer<
    typeof createFolderInputSchema
  >;
  let Collection;
  if (action === 'BOOKMARK') {
    Collection = BookMarkedFile;
  } else if (action === 'UPLOAD') {
    Collection = UploadedFiles;
  } else {
    throw new ErrorHandler('invalid action type', ERROR_CODES['BAD REQUEST']);
  }
  const doesFolderExists = await Collection.findOne({
    userId,
    name: folderName,
  })
    .select({ _id: 1 })
    .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
    .lean()
    .exec();
  if (doesFolderExists) {
    throw new ErrorHandler('Folder already exists', ERROR_CODES.CONFLICT);
  }
  const _id = new mongoose.Types.ObjectId();
  const folder = new Collection({
    _id,
    userId,
    name: folderName,
    fileType: FILE_TYPE.DIRECTORY,
  });
  const result = await folder.save();
  if (!result) {
    throw new ErrorHandler(
      'Something went  wrong. Please try again later',
      SERVER_ERROR['INTERNAL SERVER ERROR']
    );
  }
  return res.status(SUCCESS_CODES.CREATED).json({ data: result });
});

export default CreateFolder;
