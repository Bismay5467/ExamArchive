/* eslint-disable no-case-declarations */
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import {
  AUTH_TOKEN,
  JWT_MAX_AGE,
  RESET_LINK_EXP_TIME,
} from '../../constants/constants/auth';
import {
  MONGO_READ_QUERY_TIMEOUT,
  MONGO_WRITE_QUERY_TIMEOUT,
} from '../../constants/constants/shared';

import ResetPasswordEmail from '../../emails/ResetPassword';
import User from '../../models/user';
import sendMail from '../../utils/emails/sendMail';
import { signTokens } from '../../utils/auth/jsonwebtokens';

dotenv.config({
  path:
    (process.env.NODE_ENV as string).trim() === 'production'
      ? './.env.production.local'
      : './.env.development.local',
});

const Reset = async ({
  action,
  email,
  password,
}: {
  action: 'EMAIL' | 'RESET';
  email: string;
  password?: string;
}) => {
  switch (action) {
    case 'EMAIL':
      const [doesUserExists, resetToken] = await Promise.all([
        User.findOne({ email })
          .select({ _id: 1, username: 1 })
          .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
          .lean()
          .exec(),
        signTokens({
          payload: { email },
          JWT_MAX_AGE: RESET_LINK_EXP_TIME,
        }),
      ]);
      if (!doesUserExists) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not registered',
        });
      }
      if (resetToken === null) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong. Please try again later',
        });
      }
      if (process.env.DOMAIN_URL === undefined) {
        console.error('Error: Specify your domain to generate a reset link');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong. Please try again later',
        });
      }
      const resetLink = `${process.env.DOMAIN_URL}${'/auth/reset'}?${AUTH_TOKEN}=${resetToken}`;
      const react = ResetPasswordEmail({
        userFirstname: (doesUserExists as any).username,
        resetPasswordLink: resetLink,
      });
      const data = await sendMail({
        receiver: [email],
        subject: 'Reset your password',
        react,
      });
      if (data === null || data.error) {
        console.error(`Error: ${JSON.stringify(data)}`);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong. PLease try again later',
        });
      }
      return undefined;
    case 'RESET':
      const saltStrength = 10;
      const salt = await bcrypt.genSalt(saltStrength);
      const hashedPassword = await bcrypt.hash(password as string, salt);
      const user = await User.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true, upsert: false }
      )
        .select({ _id: 1, username: 1 })
        .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
        .lean()
        .exec();
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: "Email address doesn't exists",
        });
      }
      const token = await signTokens({
        payload: {
          email,
          // eslint-disable-next-line no-underscore-dangle
          userId: (user as any)._id.toString(),
          username: (user as any).username,
        },
        JWT_MAX_AGE,
      });
      if (token === null) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: "Couldn't generate reset token",
        });
      }
      return token;
    default:
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid action type',
      });
  }
};

export default Reset;
