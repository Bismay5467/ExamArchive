import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { FILE_TYPE } from '../../constants/constants/upload';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import { getFolderNamesSchema } from '../../router/folder/schema';
import { BookMarkedFile, UploadedFiles } from '../../models';
import { ERROR_CODES, SUCCESS_CODES } from '../../constants/statusCode';

const GetFolderNames = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.body as { userId: string };
    const { action } = req.query as z.infer<typeof getFolderNamesSchema>;
    let Collection;
    if (action === 'BOOKMARK') {
      Collection = BookMarkedFile;
    } else if (action === 'UPLOAD') {
      Collection = UploadedFiles;
    } else {
      throw new ErrorHandler('Invalid action type', ERROR_CODES['BAD REQUEST']);
    }
    const result = await Collection.find({
      userId,
      fileType: FILE_TYPE.DIRECTORY,
    })
      .select({ _id: 1, name: 1 })
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .lean()
      .exec();
    return res.status(SUCCESS_CODES.OK).json({ data: result });
  }
);

export default GetFolderNames;
