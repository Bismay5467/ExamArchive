/* eslint-disable no-nested-ternary */
/* eslint-disable indent */
import { AnyZodObject } from 'zod';
import { NextFunction, Request, Response } from 'express';

import { ERROR_CODES } from '../constants/statusCode';

const validate =
  (schema: AnyZodObject, target: 'QUERY' | 'BODY' | 'PARAMS') =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data =
        target === 'BODY'
          ? req.body.data
          : target === 'PARAMS'
            ? req.params
            : req.query;
      await schema.parseAsync(data);
      return next();
    } catch (error) {
      return res.status(ERROR_CODES['BAD REQUEST']).json(error);
    }
  };

export default validate;
