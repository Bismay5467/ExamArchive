import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { MONGO_WRITE_QUERY_TIMEOUT } from '../../constants/constants/shared';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import { deleteFolderInputSchema } from '../../router/folder/schema';
import { BookMarkedFile, UploadedFiles } from '../../models/files';
import { ERROR_CODES, SUCCESS_CODES } from '../../constants/statusCode';

const DeleteFolder = asyncErrorHandler(async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: string };
  const { folderId, action } = req.body.data as z.infer<
    typeof deleteFolderInputSchema
  >;
  const Collection = action === 'BOOKMARK' ? BookMarkedFile : UploadedFiles;
  const deleteQuery = {
    userId,
    $or: [{ _id: folderId }, { parentId: folderId }],
  };
  const { deletedCount } = await Collection.deleteMany(deleteQuery)
    .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
    .lean()
    .exec();
  if (deletedCount === 0) {
    throw new ErrorHandler(
      'No matching records found',
      ERROR_CODES['NOT FOUND']
    );
  }
  return res.status(SUCCESS_CODES.OK).json({ message: 'Folder deleted' });
});

export default DeleteFolder;
