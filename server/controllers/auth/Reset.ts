/* eslint-disable no-case-declarations */
/* eslint-disable no-underscore-dangle */
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { render } from '@react-email/render';

import {
  AUTH_TOKEN,
  JWT_MAX_AGE,
  RESET_LINK_EXP_TIME,
} from '../../constants/constants/auth';
import {
  MAIL_EVENT_NAME,
  MONGO_READ_QUERY_TIMEOUT,
  MONGO_WRITE_QUERY_TIMEOUT,
} from '../../constants/constants/shared';

import { IUser } from '../../types/auth/types';
import ResetPasswordEmail from '../../emails/ResetPassword';
import User from '../../models/user';
import sendMail from '../../utils/emails/sendMail';
import { signTokens, verifyTokens } from '../../utils/auth/jsonwebtokens';

dotenv.config({
  path:
    (process.env.NODE_ENV as string).trim() === 'production'
      ? './.env.production.local'
      : './.env.development.local',
});

type TAction = 'EMAIL' | 'RESET';

type TResetParamsType<T extends TAction> = {
  action: T;
  email: string;
} & (T extends 'RESET' ? { password: string; authToken: string } : {});

const Reset = async (
  params: TResetParamsType<'EMAIL'> | TResetParamsType<'RESET'>
) => {
  switch (params.action) {
    case 'EMAIL':
      const { email } = params;
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
      const emailHTML = render(
        ResetPasswordEmail({
          userFirstname: (doesUserExists as any).username,
          resetPasswordLink: resetLink,
        }),
        { pretty: true }
      );
      await sendMail({
        eventName: MAIL_EVENT_NAME,
        payload: {
          to: [email],
          subject: 'Reset your password',
          html: emailHTML,
        },
      });
      return undefined;
    case 'RESET':
      const { authToken, email: userEmail, password } = params;
      const jwtPayload = (await verifyTokens({
        token: authToken,
      })) as IUser | null;
      if (jwtPayload === null || jwtPayload.email !== userEmail) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not authorized to reset the password',
        });
      }
      const saltStrength = 10;
      const salt = await bcrypt.genSalt(saltStrength);
      const hashedPassword = await bcrypt.hash(password as string, salt);
      const user = await User.findOneAndUpdate(
        { email: userEmail },
        { password: hashedPassword },
        { new: true, upsert: false }
      )
        .select({ _id: 1, username: 1, role: 1 })
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
          email: userEmail,
          userId: (user as any)._id.toString(),
          username: (user as any).username,
          role: (user as any).role,
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
