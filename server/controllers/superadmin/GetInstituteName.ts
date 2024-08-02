import { Request, Response } from 'express';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { REDIS_KEY } from './AddInstituteName';
import { ROLE } from '../../constants/constants/auth';
import { User } from '../../models';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import redisClient from '../../config/redisConfig';
import { SERVER_ERROR, SUCCESS_CODES } from '../../constants/statusCode';

const GetInstituteNames = asyncErrorHandler(
  async (req: Request, res: Response) => {
    if (redisClient === null) {
      throw new ErrorHandler(
        'Something went wrong. Please try again later',
        SERVER_ERROR['INTERNAL SERVER ERROR']
      );
    }
    const data = await redisClient.get(REDIS_KEY);
    if (data) {
      return res.status(SUCCESS_CODES.OK).json({ data: JSON.parse(data) });
    }
    let result = await User.find({ role: ROLE.ADMIN })
      .select({ insituteName: 1, _id: 0 })
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .lean()
      .exec();
    result = result.map(({ insituteName }) => insituteName);
    if (result.length > 0) {
      await redisClient.set(REDIS_KEY, JSON.stringify(result));
    }
    return res.status(SUCCESS_CODES.OK).json({ data: result });
  }
);

export default GetInstituteNames;
