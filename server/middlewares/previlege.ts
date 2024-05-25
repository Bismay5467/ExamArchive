import { NextFunction, Request, Response } from 'express';

import { ERROR_CODES } from '../constants/statusCode';
import { TRole } from '../types/auth/types';

export const userPrivilege = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role: TRole = req.body.role ?? req.body.data.role;
    if (role !== 'USER') {
      throw new Error();
    }
    return next();
  } catch (error) {
    return res.status(ERROR_CODES.FORBIDDEN).json({
      message:
        'You are not permitted to access this feature. Connect with your admin(s) if you are facing some problem',
    });
  }
};

export const adminPrevilege = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role: TRole = req.body.role ?? req.body.data.role;
    if (role !== 'ADMIN') {
      throw new Error();
    }
    return next();
  } catch (error) {
    return res.status(ERROR_CODES.FORBIDDEN).json({
      message:
        'You are not permitted to access this feature. Connect with your admin(s) if you are facing some problem',
    });
  }
};

export const superAdminPrivilege = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role: TRole = req.body.role ?? req.body.data.role;
    if (role !== 'SUPERADMIN') {
      throw new Error();
    }
    return next();
  } catch (error) {
    return res.status(ERROR_CODES.FORBIDDEN).json({
      message: 'You are not permitted to access this feature',
    });
  }
};
