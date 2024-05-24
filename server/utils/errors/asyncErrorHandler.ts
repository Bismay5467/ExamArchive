import { NextFunction, Request, Response } from 'express';

const asyncErrorHandler =
  (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: any) => next(err));
  };

export default asyncErrorHandler;
