import { TRPCError } from '@trpc/server';
import mongoose from 'mongoose';
import { render } from '@react-email/render';

import {
  MAIL_EVENT_NAME,
  MONGO_READ_QUERY_TIMEOUT,
} from '../../constants/constants/shared';

import NotifyUserOnBeingAdminEmail from '../../emails/NotifyUserOnBeingAdmin';
import { ROLE } from '../../constants/constants/auth';
import { User } from '../../models';
import getRandomPassword from '../../utils/admin/getPassword';
import { getRedisKey } from '.';
import redisClient from '../../config/redisConfig';
import sendMail from '../../utils/emails/sendMail';

const AddAdmin = async ({
  username,
  email,
}: {
  username: string;
  email: string;
}) => {
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    const doesUserExists = await User.findOne({
      $or: [{ username }, { email }],
    })
      .select({ _id: 1 })
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .session(session)
      .lean()
      .exec();
    if (doesUserExists) {
      await session.abortTransaction();
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Username or email already exists',
      });
    }
    if (redisClient === null) {
      await session.abortTransaction();
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong. Please try again later',
      });
    }
    const userId = new mongoose.Types.ObjectId();
    const password = getRandomPassword();
    const userInfo = {
      username,
      email,
      password,
      _id: userId,
      role: ROLE.ADMIN,
    };
    const redisKey = getRedisKey();
    const payload = { userId, email, username };
    const emailHTML = render(
      NotifyUserOnBeingAdminEmail({ username, email, password }),
      { pretty: true }
    );
    const [isMailSent] = await Promise.all([
      sendMail({
        eventName: MAIL_EVENT_NAME,
        payload: {
          to: [email],
          subject: 'Admin login credentials for Exam Archive',
          html: emailHTML,
        },
      }),
      User.create([userInfo], { session }),
      redisClient.sadd(redisKey, JSON.stringify(payload)),
    ]);
    if (isMailSent === null) {
      await session.abortTransaction();
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong. Please try again later',
      });
    }
  });
  await session.endSession();
};

export default AddAdmin;
