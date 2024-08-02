import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { ROLE } from '../../constants/constants/auth';
import { User } from '../../models';
import { addInsitituteNameInputSchema } from '../../router/superadmin/schema';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import redisClient from '../../config/redisConfig';
import { SERVER_ERROR, SUCCESS_CODES } from '../../constants/statusCode';

export const REDIS_KEY = 'INSTITUTE_NAME';

const AddInstituteName = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { instituteName } = req.body.data as z.infer<
      typeof addInsitituteNameInputSchema
    >;
    let result = await User.find({ role: ROLE.ADMIN })
      .select({ instituteName: 1 })
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .lean()
      .exec();
    result = [
      ...new Set([
        ...result.map(({ instituteName: name }) => name),
        instituteName,
      ]),
    ];
    if (redisClient === null) {
      throw new ErrorHandler(
        'Something went wrong. PLease try again later',
        SERVER_ERROR['INTERNAL SERVER ERROR']
      );
    }
    await redisClient.set(REDIS_KEY, JSON.stringify(result));
    return res
      .status(SUCCESS_CODES.OK)
      .json({ message: 'Institute name added to collection' });
  }
);

export default AddInstituteName;
