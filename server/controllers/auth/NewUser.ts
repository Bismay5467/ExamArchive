/* eslint-disable no-case-declarations */
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { render } from '@react-email/render';
import { z } from 'zod';
import { Request, Response } from 'express';

import {
  AUTH_TOKEN,
  COOKIES_TTL,
  JWT_MAX_AGE,
  REGISTRATION_OTP_TTL_SECONDS,
} from '../../constants/constants/auth';

import {
  MAIL_EVENT_NAME,
  MONGO_READ_QUERY_TIMEOUT,
} from '../../constants/constants/shared';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import RegistrationOTPEmail from '../../emails/RegistrationOTP';
import User from '../../models/user';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import generateOTP from '../../utils/auth/generateOTP';
import { newUserInputSchema } from '../../router/auth/schema';
import redisClient from '../../config/redisConfig';
import sendMail from '../../utils/emails/sendMail';
import { signTokens } from '../../utils/auth/jsonwebtokens';
import {
  ERROR_CODES,
  SERVER_ERROR,
  SUCCESS_CODES,
} from '../../constants/statusCode';

const NewUser = asyncErrorHandler(async (req: Request, res: Response) => {
  const { email, username, password, actionType, enteredOTP, role } = req.body
    .data as z.infer<typeof newUserInputSchema>;
  const redisKey = `otp:${email}`;
  const saltStrength = 10;
  const salt = await bcrypt.genSalt(saltStrength);
  switch (actionType) {
    case 'GENERATE':
      const doesUserExists = await User.findOne({
        $or: [{ username }, { email }],
      })
        .select({ _id: 1 })
        .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
        .lean()
        .exec();
      if (doesUserExists) {
        throw new ErrorHandler(
          'Username or email already exists',
          ERROR_CODES.CONFLICT
        );
      }
      if (redisClient === null) {
        throw new ErrorHandler(
          'Something went wrong. Please try again later',
          SERVER_ERROR['INTERNAL SERVER ERROR']
        );
      }
      let otp = generateOTP();
      const emailHTML = render(
        RegistrationOTPEmail({
          userFirstname: username,
          verificationCode: otp,
        }),
        { pretty: true }
      );
      otp = await bcrypt.hash(otp, salt);
      const [response, job] = await Promise.all([
        redisClient.setex(redisKey, REGISTRATION_OTP_TTL_SECONDS, otp),
        sendMail({
          eventName: MAIL_EVENT_NAME,
          payload: {
            to: [email],
            subject: 'Verification code for Exam Archive account',
            html: emailHTML,
          },
        }),
      ]);
      if (response !== 'OK' || job === null) {
        console.error(`Error: ${response}, ${JSON.stringify(job)}`);
        throw new ErrorHandler(
          'Something went wrong. Please try again later',
          SERVER_ERROR['INTERNAL SERVER ERROR']
        );
      }
      return res.status(SUCCESS_CODES.OK).json({ message: 'OTP generated' });
    case 'VERIFY':
      if (redisClient === null) {
        throw new ErrorHandler(
          'Something went wrong. Please try again later',
          SERVER_ERROR['INTERNAL SERVER ERROR']
        );
      }
      if (enteredOTP === undefined) {
        throw new ErrorHandler(
          'Check your inbox for the OTP',
          ERROR_CODES.FORBIDDEN
        );
      }
      const storedOTP = await redisClient.get(redisKey);
      const isEnteredOTPCorrect = storedOTP
        ? bcrypt.compareSync(enteredOTP.toString(), storedOTP)
        : false;
      if (isEnteredOTPCorrect === false) {
        throw new ErrorHandler('Invalid OTP', ERROR_CODES.FORBIDDEN);
      }
      const userId = new mongoose.Types.ObjectId();
      const payload = { username, email, userId: userId.toString(), role };
      const user = new User({ username, email, password, _id: userId, role });
      const token = await signTokens({ payload, JWT_MAX_AGE });
      if (token === null) {
        throw new ErrorHandler(
          "Couldn't generate a JWT token",
          SERVER_ERROR['INTERNAL SERVER ERROR']
        );
      }
      await Promise.all([user.save(), redisClient.del(redisKey)]);
      res.cookie(AUTH_TOKEN, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: COOKIES_TTL,
        path: '/',
      });
      return res
        .status(SUCCESS_CODES.CREATED)
        .json({ message: 'Welcome onboard' });
    default:
      throw new ErrorHandler('Invalid action type', ERROR_CODES['BAD REQUEST']);
  }
});

export default NewUser;
