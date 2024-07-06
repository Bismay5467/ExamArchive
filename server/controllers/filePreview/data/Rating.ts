import mongoose from 'mongoose';
import { z } from 'zod';
import { Request, Response } from 'express';

import {
  MONGO_READ_QUERY_TIMEOUT,
  MONGO_WRITE_QUERY_TIMEOUT,
} from '../../../constants/constants/shared';

import { ErrorHandler } from '../../../utils/errors/errorHandler';
import { IRatingInfo } from '../../../types/filePreview/types';
import Question from '../../../models/question';
import Rating from '../../../models/rating';
import asyncErrorHandler from '../../../utils/errors/asyncErrorHandler';
import calculateRating from '../../../utils/filePreview/calculateRating';
import { ratingInputSchema } from '../../../router/filePreview/data/schema';
import redisClient from '../../../config/redisConfig';
import { ERROR_CODES, SUCCESS_CODES } from '../../../constants/statusCode';

const UpdateRating = asyncErrorHandler(async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: string };
  const { postId, ratingArray } = req.body.data as z.infer<
    typeof ratingInputSchema
  >;
  const session = await mongoose.startSession();

  await session.withTransaction(async () => {
    let { rating }: { rating: IRatingInfo[] | null } = (await Question.findById(
      { _id: postId }
    )
      .select({ rating: 1, _id: 0 })
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .session(session)
      .lean()
      .exec()) as any;
    if (!rating) {
      await session.abortTransaction();
      throw new ErrorHandler(
        'No document found with the given Id',
        ERROR_CODES['NOT FOUND']
      );
    }
    rating = rating.map((item) => {
      const newRating =
        ratingArray.find((ele) => ele.type.toLowerCase() === item.ratingType)
          ?.value ?? 0;
      const averageRating = calculateRating({
        totalRating: item.totalRating,
        avgRating: item.averageRating,
        newRating,
      });
      const totalRating = item.totalRating + newRating;
      return { ...item, averageRating, totalRating };
    });
    const ratingArrayValues = ratingArray.map(({ value }) => value);
    const updateDataInDBPromises = [
      Rating.findOneAndUpdate(
        { postId, userId },
        {
          $setOnInsert: {
            postId,
            userId,
            rating: ratingArrayValues,
          },
        },
        { upsert: true, new: false }
      )
        .select({ rating: 1, _id: 0 })
        .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
        .session(session)
        .lean()
        .exec(),
      Question.findByIdAndUpdate(
        { _id: postId },
        { rating },
        { upsert: false, new: true }
      )
        .session(session)
        .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
        .lean()
        .exec(),
    ];
    const [updatedRatings] = await Promise.all(updateDataInDBPromises);
    if (updatedRatings !== null) {
      await session.abortTransaction();
      throw new ErrorHandler(
        'You have already rated this post',
        ERROR_CODES.CONFLICT
      );
    }
    const redisKey = `post:${postId}`;
    if (redisClient) await redisClient.del(redisKey);
  });
  await session.endSession();
  return res
    .status(SUCCESS_CODES.OK)
    .json({ message: 'Thanks for rating the post' });
});

export default UpdateRating;
