/* eslint-disable no-magic-numbers */
/* eslint-disable prefer-destructuring */
import { Request, Response } from 'express';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { MONGO_WRITE_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { Question } from '../../models';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import { ERROR_CODES, SUCCESS_CODES } from '../../constants/statusCode';

const NotificationWebhook = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { public_id: publicId, secure_url: url } = req.body.data as {
      public_id: string;
      secure_url: string;
    };
    // eslint-disable-next-line no-console
    console.log(publicId, url);
    if (!(publicId && url)) {
      throw new ErrorHandler(
        'Record updation failed',
        ERROR_CODES['NOT FOUND']
      );
    }
    const sanitizedFileName = publicId.split('/').slice(-1)[0];
    await Question.findOneAndUpdate(
      { 'file.filename': sanitizedFileName },
      { 'file.publicId': publicId, 'file.url': url },
      { upsert: false, new: true }
    )
      .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
      .lean()
      .exec();
    return res
      .status(SUCCESS_CODES.OK)
      .json({ message: 'Record updated successfully' });
  }
);

export default NotificationWebhook;
