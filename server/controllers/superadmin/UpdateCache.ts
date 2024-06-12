import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { ROLE } from '../../constants/constants/auth';
import { User } from '../../models';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import redisClient from '../../config/redisConfig';
import { updateSchema } from '../../router/superadmin/schema';
import { SERVER_ERROR, SUCCESS_CODES } from '../../constants/statusCode';

const UpdateCache = asyncErrorHandler(async (req: Request, res: Response) => {
  const { role } = req.body.data as z.infer<typeof updateSchema>;
  if (redisClient === null) {
    throw new ErrorHandler(
      'Something went wrong. Please try again later',
      SERVER_ERROR['INTERNAL SERVER ERROR']
    );
  }
  if (role) {
    const infoarr = await User.find({ role })
      .select({ _id: 1, username: 1, email: 1, invitationStatus: 1 })
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .lean()
      .exec();
    const sanitizedInfo = infoarr.map((info) => {
      const { _id: userId, email, username, invitationStatus } = info;
      return { userId, email, username, invitationStatus };
    });

    const saveInfoToCachePromises = sanitizedInfo.map((info) =>
      redisClient?.sadd(role, JSON.stringify(info))
    );
    await Promise.all(saveInfoToCachePromises);
  } else {
    const [adminInfo, superadminInfo] = await Promise.all([
      User.find({ role: ROLE.ADMIN })
        .select({ _id: 1, username: 1, email: 1, invitationStatus: 1 })
        .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
        .lean()
        .exec(),
      User.find({ role: ROLE.SUPERADMIN })
        .select({ _id: 1, username: 1, email: 1, invitationStatus: 1 })
        .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
        .lean()
        .exec(),
    ]);
    const sanitizedAdminInfo = adminInfo.map((info) => {
      const { _id: userId, email, username, invitationStatus } = info;
      return { userId, email, username, invitationStatus };
    });
    const sanitizedSuperAdminInfo = superadminInfo.map((info) => {
      const { _id: userId, email, username, invitationStatus } = info;
      return { userId, email, username, invitationStatus };
    });
    const saveAdminInfoToCachePromises = sanitizedAdminInfo.map((info) =>
      redisClient?.sadd(ROLE.ADMIN, JSON.stringify(info))
    );
    const saveSuperAdminInfoToCachePromises = sanitizedSuperAdminInfo.map(
      (info) => redisClient?.sadd(ROLE.SUPERADMIN, JSON.stringify(info))
    );
    await Promise.all([
      ...saveAdminInfoToCachePromises,
      ...saveSuperAdminInfoToCachePromises,
    ]);
  }
  return res
    .status(SUCCESS_CODES['NO CONTENT'])
    .json({ message: 'Cache updated' });
});

export default UpdateCache;
