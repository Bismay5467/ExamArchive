/* eslint-disable no-underscore-dangle */
import isEmail from 'validator/lib/isEmail';
import mongoose from 'mongoose';
import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import User from '../../models/user';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import redisClient from '../../config/redisConfig';
import { signInUserInputSchema } from '../../router/auth/schema';
import { signTokens } from '../../utils/auth/jsonwebtokens';
import {
  ERROR_CODES,
  SERVER_ERROR,
  SUCCESS_CODES,
} from '../../constants/statusCode';
import { INVITATION_STATUS, JWT_MAX_AGE } from '../../constants/constants/auth';

const SignIn = asyncErrorHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body.data as z.infer<
    typeof signInUserInputSchema
  >;
  const email = isEmail(username) ? username : undefined;
  const session = await mongoose.startSession();
  const resObj = {};
  await session.withTransaction(async () => {
    const user = (await User.findOne({
      $or: [{ email }, { username }],
    })
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .session(session)
      .exec()) as any;
    if (!user) {
      await session.abortTransaction();
      throw new ErrorHandler(
        "Username doesn't exist",
        ERROR_CODES['NOT FOUND']
      );
    }
    const isPasswordCorrect = await user.comparePassword(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      await session.abortTransaction();
      throw new ErrorHandler(
        'Invalid username or password. Please check your credentials and try again',
        ERROR_CODES['NOT FOUND']
      );
    }
    const payload = {
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    };
    const token = await signTokens({ payload, JWT_MAX_AGE });
    if (token === null) {
      await session.abortTransaction();
      throw new ErrorHandler(
        "Couldn't generate a JWT token",
        SERVER_ERROR['INTERNAL SERVER ERROR']
      );
    }
    if (user.invitationStatus === INVITATION_STATUS.PENDING) {
      await Promise.all([
        User.findOneAndUpdate(
          { email: user.email },
          { invitationStatus: INVITATION_STATUS.ACCEPTED },
          { upsert: false, new: false }
        )
          .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
          .lean()
          .exec(),
        redisClient?.del(user.role),
      ]);
    }
    Object.assign(resObj, { token });
    // res.cookie(AUTH_TOKEN, token, {
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: COOKIES_TTL,
    //   path: '/',
    // });
  });
  await session.endSession();
  return res
    .status(SUCCESS_CODES.OK)
    .json({ message: 'Nice to see you again!', ...resObj });
});

export default SignIn;
