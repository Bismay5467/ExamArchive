/* eslint-disable indent */
import mongoose from 'mongoose';
import { z } from 'zod';
import { Request, Response } from 'express';

import {
  MAIL_EVENT_NAME,
  MONGO_READ_QUERY_TIMEOUT,
} from '../../constants/constants/shared';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { User } from '../../models';
import { addInputSchema } from '../../router/superadmin/schema';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import getUpdateInfo from '../../utils/superadmin/getUpdateInfo';
import redisClient from '../../config/redisConfig';
import sendMail from '../../utils/emails/sendMail';
import { SERVER_ERROR, SUCCESS_CODES } from '../../constants/statusCode';

const Add = asyncErrorHandler(async (req: Request, res: Response) => {
  const { username, email, role, instituteName } = req.body.data as z.infer<
    typeof addInputSchema
  >;
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    if (redisClient === null) {
      await session.abortTransaction();
      throw new ErrorHandler(
        'Something went wrong. Please try again later',
        SERVER_ERROR['INTERNAL SERVER ERROR']
      );
    }
    const doesUserExists = await User.findOne({
      $or: [{ username }, { email }],
    })
      .select({ _id: 1 })
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .lean()
      .exec();
    const { updateInfo, emailHTML } = await getUpdateInfo({
      doesUserExists: doesUserExists !== null,
      role,
      instituteName,
      username,
      email,
    });
    const [result, doKeyExists] = await Promise.all([
      User.findOneAndUpdate({ username, email }, updateInfo, {
        upsert: true,
        new: true,
      })
        .select({ _id: 1, username: 1, email: 1, invitationStatus: 1 })
        .session(session)
        .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
        .lean()
        .exec() as any,
      redisClient.exists(role),
    ]);
    if (result === null) {
      await session.abortTransaction();
      throw new ErrorHandler(
        'Something went wrong. Please try again later',
        SERVER_ERROR['INTERNAL SERVER ERROR']
      );
    }
    const [isMailSent] = await Promise.all([
      sendMail({
        eventName: MAIL_EVENT_NAME,
        payload: {
          to: [email],
          subject: 'Login credentials for Exam Archive',
          html: emailHTML,
        },
      }),
      doKeyExists === 1 && redisClient.del(role),
    ]);
    if (isMailSent === null) {
      await session.abortTransaction();
      throw new ErrorHandler(
        'Something went wrong. Please try again later',
        SERVER_ERROR['INTERNAL SERVER ERROR']
      );
    }
  });
  await session.endSession();
  res.status(SUCCESS_CODES.CREATED).json({ message: 'Mail Sent' });
});

export default Add;
