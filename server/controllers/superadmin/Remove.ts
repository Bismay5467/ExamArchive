import mongoose from 'mongoose';
import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { REDIS_KEY } from './AddInstituteName';
import { ROLE } from '../../constants/constants/auth';
import { User } from '../../models';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import redisClient from '../../config/redisConfig';
import { removeInputSchema } from '../../router/superadmin/schema';
import {
  ERROR_CODES,
  SERVER_ERROR,
  SUCCESS_CODES,
} from '../../constants/statusCode';

const Remove = asyncErrorHandler(async (req: Request, res: Response) => {
  const { email: adminEmail } = req.body as { email: string };
  const { username, email, role } = req.body.data as z.infer<
    typeof removeInputSchema
  >;
  if (email === adminEmail) {
    throw new ErrorHandler(
      'You cant remove yourself as a super admin',
      ERROR_CODES.CONFLICT
    );
  }
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    if (redisClient === null) {
      await session.abortTransaction();
      throw new ErrorHandler(
        'Something went wrong. Please try again later',
        SERVER_ERROR['INTERNAL SERVER ERROR']
      );
    }
    const result = await User.findOneAndUpdate(
      { username, email },
      { role: ROLE.USER, $unset: { instituteName: '' } },
      { upsert: false, new: true }
    )
      .select({ _id: 1 })
      .session(session)
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .lean()
      .exec();
    if (result === null) {
      await session.abortTransaction();
      throw new ErrorHandler(
        'Something went wrong. Please try again later',
        SERVER_ERROR['INTERNAL SERVER ERROR']
      );
    }
    await Promise.all([redisClient.del(REDIS_KEY), redisClient.del(role)]);
  });
  await session.endSession();
  res.status(SUCCESS_CODES['NO CONTENT']).json({ message: 'Role changed' });
});

export default Remove;
