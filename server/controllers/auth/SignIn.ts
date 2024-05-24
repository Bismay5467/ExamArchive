import isEmail from 'validator/lib/isEmail';
import { z } from 'zod';
import { Request, Response } from 'express';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { MONGO_READ_QUERY_TIMEOUT } from '../../constants/constants/shared';
import User from '../../models/user';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import { signInUserInputSchema } from '../../router/auth/schema';
import { signTokens } from '../../utils/auth/jsonwebtokens';
import {
  AUTH_TOKEN,
  COOKIES_TTL,
  JWT_MAX_AGE,
} from '../../constants/constants/auth';
import {
  ERROR_CODES,
  SERVER_ERROR,
  SUCCESS_CODES,
} from '../../constants/statusCode';

const SignIn = asyncErrorHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body.data as z.infer<
    typeof signInUserInputSchema
  >;
  const email = isEmail(username) ? username : undefined;
  const user = (await User.findOne({
    $or: [{ email }, { username }],
  })
    .select({ _id: 1, password: 1, username: 1, email: 1, role: 1 })
    .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
    .exec()) as any;
  if (!user) {
    throw new ErrorHandler("Username doesn't exists", ERROR_CODES['NOT FOUND']);
  }
  const isPasswordCorrect = await user.comparePassword(password, user.password);
  if (!isPasswordCorrect) {
    throw new ErrorHandler(
      'Invalid username or password. Please check your credentials and try again',
      ERROR_CODES['NOT FOUND']
    );
  }
  const payload = {
    // eslint-disable-next-line no-underscore-dangle
    userId: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
  };
  const token = await signTokens({ payload, JWT_MAX_AGE });
  if (token === null) {
    throw new ErrorHandler(
      "Couldn't generate a JWT token",
      SERVER_ERROR['INTERNAL SERVER ERROR']
    );
  }
  res.cookie(AUTH_TOKEN, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: COOKIES_TTL,
    path: '/',
  });
  return res
    .status(SUCCESS_CODES.OK)
    .json({ message: 'Nice to see you again!' });
});

export default SignIn;
