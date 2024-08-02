import { Request, Response } from 'express';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { MONGO_WRITE_QUERY_TIMEOUT } from '../../constants/constants/shared';
import { User } from '../../models';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import { ERROR_CODES, SUCCESS_CODES } from '../../constants/statusCode';

const GetInstituteName = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.body as { userId: string };
    const result = await User.findOne({ _id: userId })
      .select({ _id: 0, instituteName: 1 })
      .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
      .lean()
      .exec();
    if (result === null) {
      throw new ErrorHandler(
        'No user found with the given id',
        ERROR_CODES['NOT FOUND']
      );
    }
    return res.status(SUCCESS_CODES.OK).json({ data: result });
  }
);

export default GetInstituteName;
