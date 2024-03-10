import { TRPCError } from '@trpc/server';
import mongoose from 'mongoose';

import { MONGO_WRITE_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { User } from '../../models';
import { getRedisKey } from '.';
import redisClient from '../../config/redisConfig';

const RemoveAdmin = async ({
  email,
  adminId,
  username,
}: {
  email: string;
  adminId: string;
  username: string;
}) => {
  const query = { email };
  const redisKey = getRedisKey();
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    if (redisClient === null) {
      await session.abortTransaction();
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong. Please try agian later',
      });
    }
    const [isAdminRemoved] = await Promise.all([
      User.findOneAndDelete(query)
        .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
        .session(session)
        .lean()
        .exec(),
      redisClient.srem(
        redisKey,
        JSON.stringify({ userId: adminId, email, username })
      ),
    ]);
    if (isAdminRemoved === null) {
      await session.abortTransaction();
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong. Please try again later',
      });
    }
  });
  await session.endSession();
};

export default RemoveAdmin;
