import { z } from 'zod';
import { Request, Response } from 'express';

import { BookMarkedFile } from '../../models';
import { FILE_TYPE } from '../../constants/constants/upload';
import { MONGO_WRITE_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { SUCCESS_CODES } from '../../constants/statusCode';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import { pinFileSchema } from '../../router/folder/schema';

const PinFile = asyncErrorHandler(async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: string };
  const { fileId } = req.body.data as z.infer<typeof pinFileSchema>;
  await BookMarkedFile.findOneAndUpdate(
    { _id: fileId, userId, fileType: FILE_TYPE.FILE },
    { isPinned: true },
    { upsert: false, new: false }
  )
    .select({ _id: 1 })
    .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
    .lean()
    .exec();
  return res.status(SUCCESS_CODES.OK).json({ message: 'File pinned' });
});

export default PinFile;
