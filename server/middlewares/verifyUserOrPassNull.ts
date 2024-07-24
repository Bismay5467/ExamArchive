/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from 'express';

import { IUser } from '../types/auth/types';
import { verifyTokens } from '../utils/auth/jsonwebtokens';

const verifyUserOrPassNull = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (req.headers.authorization) {
      const user = (await verifyTokens({
        token: req.headers.authorization.split(' ')[1],
      })) as IUser | null;
      Object.assign(req.body, user);
    }
    next();
  } catch (error) {
    return next(error);
  }
};

export default verifyUserOrPassNull;
