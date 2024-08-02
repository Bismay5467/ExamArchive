/* eslint-disable indent */
import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { ROLE } from '../../constants/constants/auth';
import { TRole } from '../../types/auth/types';
import { User } from '../../models';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import redisClient from '../../config/redisConfig';
import { updateSchema } from '../../router/superadmin/schema';
import { SERVER_ERROR, SUCCESS_CODES } from '../../constants/statusCode';

const updateHelper = async ({ role }: { role: TRole }) => {
  const projection = (
    role === 'ADMIN'
      ? {
          _id: 1,
          username: 1,
          email: 1,
          invitationStatus: 1,
          insituteName: 1,
        }
      : { _id: 1, username: 1, email: 1, invitationStatus: 1 }
  ) as Record<string, number>;
  const infoarr = await User.find({ role })
    .select(projection)
    .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
    .lean()
    .exec();
  const sanitizedInfo = infoarr.map((info) => {
    const {
      _id: userId,
      email,
      username,
      invitationStatus,
      insituteName,
    } = info;
    return {
      userId,
      email,
      username,
      invitationStatus,
      ...(role === 'ADMIN' && { insituteName }),
    };
  });

  const saveInfoToCachePromises = sanitizedInfo.map((info) =>
    redisClient?.sadd(role, JSON.stringify(info))
  );
  await Promise.all(saveInfoToCachePromises);
};

const UpdateCache = asyncErrorHandler(async (req: Request, res: Response) => {
  const { role } = req.body.data as z.infer<typeof updateSchema>;
  if (redisClient === null) {
    throw new ErrorHandler(
      'Something went wrong. Please try again later',
      SERVER_ERROR['INTERNAL SERVER ERROR']
    );
  }
  if (role) {
    await updateHelper({ role });
  } else {
    await Promise.all([
      updateHelper({ role: ROLE.ADMIN }),
      updateHelper({ role: ROLE.SUPERADMIN }),
    ]);
  }
  return res
    .status(SUCCESS_CODES['NO CONTENT'])
    .json({ message: 'Cache updated' });
});

export default UpdateCache;
