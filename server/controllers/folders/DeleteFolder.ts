/* eslint-disable indent */
import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { FILE_TYPE } from '../../constants/constants/upload';
import { MONGO_WRITE_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { SUCCESS_CODES } from '../../constants/statusCode';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import { deleteFolderInputSchema } from '../../router/folder/schema';
import { BookMarkedFile, UploadedFiles } from '../../models/files';

const DeleteFolder = asyncErrorHandler(async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: string };
  const { folderId, action } = req.body.data as z.infer<
    typeof deleteFolderInputSchema
  >;
  const Collection = action === 'BOOKMARK' ? BookMarkedFile : UploadedFiles;
  const deleteQuery =
    action === 'BOOKMARK'
      ? {
          userId,
          $or: [{ _id: folderId }, { parentId: folderId }],
        }
      : { userId, _id: folderId, noOfFiles: 0, fileType: FILE_TYPE.DIRECTORY };
  const { deletedCount } = await Collection.deleteMany(deleteQuery)
    .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
    .lean()
    .exec();
  if (deletedCount === 0) {
    throw new ErrorHandler('No matching records found', SUCCESS_CODES.OK);
  }
  return res.status(SUCCESS_CODES.OK).json({ message: 'Folder deleted' });
});

export default DeleteFolder;
