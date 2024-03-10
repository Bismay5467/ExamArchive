import { TRPCError } from '@trpc/server';

import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { ROLE } from '../../constants/constants/auth';
import { User } from '../../models';
import { getRedisKey } from '.';
import redisClient from '../../config/redisConfig';

const GetAllAdmins = async () => {
  if (redisClient === null) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong. PLease try again later',
    });
  }
  const redisKey = getRedisKey();
  let adminInfo: any[] = await redisClient.smembers(redisKey);
  if (adminInfo.length > 0) {
    const parsedInfo = adminInfo.map((info) => JSON.parse(info));
    return parsedInfo;
  }
  adminInfo = await User.find({ role: ROLE.ADMIN })
    .select({ username: 1, email: 1 })
    .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
    .lean()
    .exec();
  const sanitizedInfo = adminInfo.map((info) => {
    const { _id: userId, email, username } = info;
    return { userId, email, username };
  });

  const saveInfoToCachePromises = sanitizedInfo.map((info) =>
    redisClient?.sadd(redisKey, JSON.stringify(info))
  );
  await Promise.all(saveInfoToCachePromises);
  return sanitizedInfo;
};

export default GetAllAdmins;
