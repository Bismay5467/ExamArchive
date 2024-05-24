import { NextFunction, Request, Response } from 'express';

import { ERROR_CODES } from '../constants/statusCode';
import { ErrorHandler } from '../utils/errors/errorHandler';
import { IUser } from '../types/auth/types';
import { verifyTokens } from '../utils/auth/jsonwebtokens';

// eslint-disable-next-line consistent-return
const verifyUser = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (req.headers.authorization === undefined) {
      throw new ErrorHandler(
        'Authorisation string required',
        ERROR_CODES['BAD REQUEST']
      );
    }
    const user = (await verifyTokens({
      token: req.headers.authorization.split(' ')[1],
    })) as IUser | null;
    if (user === null) {
      throw new ErrorHandler(
        'Access denied. You are not supported to access this resource.',
        ERROR_CODES.UNAUTHORIZED
      );
    }
    Object.assign(req.body, user);
    next();
  } catch (error) {
    return next(error);
  }
};

export default verifyUser;
