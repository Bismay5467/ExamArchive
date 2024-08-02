import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { FILE_TYPE } from '../../constants/constants/upload';
import { MONGO_WRITE_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { TRole } from '../../types/auth/types';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import { renameFolderSchema } from '../../router/folder/schema';
import { BookMarkedFile, UploadedFiles } from '../../models';
import { ERROR_CODES, SUCCESS_CODES } from '../../constants/statusCode';

const RenameFolder = asyncErrorHandler(async (req: Request, res: Response) => {
  const { userId, role } = req.body as { userId: string; role: TRole };
  const { folderId, newName, action } = req.body.data as z.infer<
    typeof renameFolderSchema
  >;
  if (role !== 'ADMIN' && action === 'UPLOAD') {
    throw new ErrorHandler(
      'Something went wrong.Please try again later',
      ERROR_CODES.FORBIDDEN
    );
  }
  const Collection = action === 'UPLOAD' ? UploadedFiles : BookMarkedFile;
  const result = await Collection.findOneAndUpdate(
    {
      userId,
      fileType: FILE_TYPE.DIRECTORY,
      _id: folderId,
    },
    { name: newName },
    { upsert: false, new: true }
  )
    .select({ _id: 1 })
    .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
    .lean()
    .exec();
  if (result === null) {
    throw new ErrorHandler('No folder found', ERROR_CODES['NOT FOUND']);
  }
  return res
    .status(SUCCESS_CODES.OK)
    .json({ newName, message: 'Folder was renamed' });
});

export default RenameFolder;
