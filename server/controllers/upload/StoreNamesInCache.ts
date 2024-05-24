/* eslint-disable no-magic-numbers */
import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { addNamesInputSchema } from '../../router/upload/schema';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import redisClient from '../../config/redisConfig';
import { SERVER_ERROR, SUCCESS_CODES } from '../../constants/statusCode';

const REDIS_KEY = 'INSTITUTIONS';

const AddNameToCache = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body.data as z.infer<typeof addNamesInputSchema>;
    if (redisClient === null) {
      throw new ErrorHandler(
        'Something went wrong.Please try again later',
        SERVER_ERROR['INTERNAL SERVER ERROR']
      );
    }
    await redisClient.sadd(REDIS_KEY, name);
    return res
      .status(SUCCESS_CODES.OK)
      .json({ message: 'New institution name added' });
  }
);

export default AddNameToCache;

// TODO : Figure out a way to show suggestions for institution names while uploading files
