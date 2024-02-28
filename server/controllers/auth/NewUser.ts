/* eslint-disable no-case-declarations */
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import {
  JWT_MAX_AGE,
  REGISTRATION_OTP_TTL_SECONDS,
} from '../../constants/constants/auth';

import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import RegistrationOTPEmail from '../../emails/RegistrationOTP';
import User from '../../models/user';
import generateOTP from '../../utils/auth/generateOTP';
import redisClient from '../../config/redisConfig';
import sendMail from '../../utils/emails/sendMail';
import { signTokens } from '../../utils/auth/jsonwebtokens';

const NewUser = async ({
  email,
  username,
  password,
  actionType,
  enteredOTP,
}: {
  email: string;
  username: string;
  password: string;
  actionType: 'GENERATE' | 'VERIFY';
  enteredOTP?: string;
}) => {
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
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Username or email already exists',
        });
      }
      if (redisClient === null) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong. Please try again later',
        });
      }
      let otp = generateOTP();
      const react = RegistrationOTPEmail({
        userFirstname: username,
        verificationCode: otp,
      });
      otp = await bcrypt.hash(otp, salt);
      const [response, data] = await Promise.all([
        redisClient.setex(redisKey, REGISTRATION_OTP_TTL_SECONDS, otp),
        sendMail({
          receiver: [email],
          react,
          subject: 'Verification code for Exam Archive account',
        }),
      ]);
      if (response !== 'OK' || data === null || data.error) {
        console.error(`Error: ${response}, ${JSON.stringify(data)}`);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong. PLease try again later',
        });
      }
      return undefined;
    case 'VERIFY':
      if (redisClient === null) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong. Please try again later',
        });
      }
      if (enteredOTP === undefined) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Check your inbox for the OTP',
        });
      }
      const storedOTP = await redisClient.get(redisKey);
      const isEnteredOTPCorrect = storedOTP
        ? bcrypt.compareSync(enteredOTP.toString(), storedOTP)
        : false;
      if (isEnteredOTPCorrect === false) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Invalid OTP' });
      }
      const userId = new mongoose.Types.ObjectId();
      const payload = { username, email, userId: userId.toString() };
      const user = new User({ username, email, password, _id: userId });
      const [token] = await Promise.all([
        signTokens({ payload, JWT_MAX_AGE }),
        user.save(),
        redisClient.del(redisKey),
      ]);
      if (token === null) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: "Couldn't generate a JWT Token",
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

export default NewUser;
