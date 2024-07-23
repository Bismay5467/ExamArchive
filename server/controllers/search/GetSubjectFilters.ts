/* eslint-disable no-magic-numbers */
import { Request, Response } from 'express';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { Question } from '../../models';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import redisClient from '../../config/redisConfig';
import { SERVER_ERROR, SUCCESS_CODES } from '../../constants/statusCode';

const REDIS_KEY = 'SUBJECT_FILTERS';

const REDIS_TTL = 24 * 60 * 60;

const GetSubjectFilters = asyncErrorHandler(
  async (_req: Request, res: Response) => {
    if (redisClient === null) {
      throw new ErrorHandler(
        'Something went wrong.Please try again later',
        SERVER_ERROR['INTERNAL SERVER ERROR']
      );
    }
    const data = await redisClient.get(REDIS_KEY);
    if (data) {
      return res.status(SUCCESS_CODES.OK).json({ data: JSON.parse(data) });
    }
    const result = await Question.find({})
      .select({ _id: 0, subjectName: 1 })
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .lean()
      .exec();
    await redisClient.set(REDIS_KEY, JSON.stringify(result), 'EX', REDIS_TTL);
    return res.status(SUCCESS_CODES.OK).json({ data: result });
  }
);

export default GetSubjectFilters;
