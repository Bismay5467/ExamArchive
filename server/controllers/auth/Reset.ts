/* eslint-disable no-case-declarations */
/* eslint-disable no-underscore-dangle */
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { render } from '@react-email/render';
import { z } from 'zod';
import { Request, Response } from 'express';

import {
  AUTH_TOKEN,
  JWT_MAX_AGE,
  RESET_LINK_EXP_TIME,
} from '../../constants/constants/auth';
import {
  ERROR_CODES,
  SERVER_ERROR,
  SUCCESS_CODES,
} from '../../constants/statusCode';
import {
  MAIL_EVENT_NAME,
  MONGO_READ_QUERY_TIMEOUT,
  MONGO_WRITE_QUERY_TIMEOUT,
} from '../../constants/constants/shared';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { IUser } from '../../types/auth/types';
import ResetPasswordEmail from '../../emails/ResetPassword';
import User from '../../models/user';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import { resetInputSchema } from '../../router/auth/schema';
import sendMail from '../../utils/emails/sendMail';
import { signTokens, verifyTokens } from '../../utils/auth/jsonwebtokens';

dotenv.config({
  path:
    (process.env.NODE_ENV as string).trim() === 'production'
      ? './.env.production.local'
      : './.env.development.local',
});

const Reset = asyncErrorHandler(async (req: Request, res: Response) => {
  const params = req.body.data as z.infer<typeof resetInputSchema>;
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
        throw new ErrorHandler('User not registered', ERROR_CODES['NOT FOUND']);
      }
      if (resetToken === null) {
        throw new ErrorHandler(
          'Something went wrong. Please try again later',
          SERVER_ERROR['INTERNAL SERVER ERROR']
        );
      }
      if (process.env.DOMAIN_URL === undefined) {
        console.error('Error: Specify your domain to generate a reset link');
        throw new ErrorHandler(
          'Something went wrong. Please try again later',
          SERVER_ERROR['INTERNAL SERVER ERROR']
        );
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
      return res.status(SUCCESS_CODES.OK).json({ message: 'Check your mail' });
    case 'RESET':
      const { authToken, email: userEmail, password } = params;
      const jwtPayload = (await verifyTokens({
        token: authToken,
      })) as IUser | null;
      if (jwtPayload === null || jwtPayload.email !== userEmail) {
        throw new ErrorHandler(
          'You are not authorized to reset the password',
          ERROR_CODES.FORBIDDEN
        );
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
        throw new ErrorHandler(
          "Email address doesn't exists",
          ERROR_CODES['NOT FOUND']
        );
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
        throw new ErrorHandler(
          "Couldn't generate reset token",
          SERVER_ERROR['INTERNAL SERVER ERROR']
        );
      }
      // res.cookie(AUTH_TOKEN, token, {
      //   secure: process.env.NODE_ENV === 'production',
      //   sameSite: 'strict',
      //   maxAge: COOKIES_TTL,
      //   path: '/',
      // });
      return res
        .status(SUCCESS_CODES.CREATED)
        .json({ message: 'Password successfully changed', token });
    default:
      throw new ErrorHandler('Invalid action type', ERROR_CODES['BAD REQUEST']);
  }
});

export default Reset;
