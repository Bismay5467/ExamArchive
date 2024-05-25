/* eslint-disable no-underscore-dangle */
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { render } from '@react-email/render';
import { z } from 'zod';
import { Request, Response } from 'express';

import {
  MAIL_EVENT_NAME,
  MONGO_READ_QUERY_TIMEOUT,
} from '../../constants/constants/shared';

import { ErrorHandler } from '../../utils/errors/errorHandler';
import { INVITATION_STATUS } from '../../constants/constants/auth';
import NotifyUserOnBeingAdminEmail from '../../emails/NotifyUserOnBeingAdmin';
import { User } from '../../models';
import { addInputSchema } from '../../router/superadmin/schema';
import asyncErrorHandler from '../../utils/errors/asyncErrorHandler';
import getRandomPassword from '../../utils/superadmin/getPassword';
import redisClient from '../../config/redisConfig';
import sendMail from '../../utils/emails/sendMail';
import { SERVER_ERROR, SUCCESS_CODES } from '../../constants/statusCode';

const Add = asyncErrorHandler(async (req: Request, res: Response) => {
  const { username, email, role } = req.body.data as z.infer<
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
    const password = getRandomPassword();
    const saltStrength = 10;
    const salt = await bcrypt.genSalt(saltStrength);
    const hashedPassword = await bcrypt.hash(password as string, salt);
    const [result, doKeyExists] = await Promise.all([
      User.findOneAndUpdate(
        { username, email },
        {
          password: hashedPassword,
          invitationStatus: INVITATION_STATUS.PENDING,
          role,
        },
        { upsert: true, new: true }
      )
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
    const emailHTML = render(
      NotifyUserOnBeingAdminEmail({ username, email, password }),
      { pretty: true }
    );
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
