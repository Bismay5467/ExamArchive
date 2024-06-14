/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from 'express';

import { ERROR_CODES } from '../constants/statusCode';
import { ErrorHandler } from '../utils/errors/errorHandler';
import { IUser } from '../types/auth/types';
import getClientIP from '../utils/filePreview/getClientIP';
import { verifyTokens } from '../utils/auth/jsonwebtokens';

const passIPOrUserId = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization
      ? req.headers.authorization.split(' ')[1]
      : '';
    const user = (await verifyTokens({ token })) as IUser | null;
    if (user !== null && Object.keys(user).length > 0) {
      Object.assign(req.body, user);
    } else {
      const ip = getClientIP(req);
      if (ip === undefined) {
        throw new ErrorHandler(
          "You can't access this route",
          ERROR_CODES.FORBIDDEN
        );
      } else Object.assign(req.body, { ip });
    }
    next();
  } catch (error) {
    return next(error);
  }
};

export default passIPOrUserId;
