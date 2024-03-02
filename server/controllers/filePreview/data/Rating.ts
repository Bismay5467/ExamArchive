import { TRPCError } from '@trpc/server';
import mongoose from 'mongoose';

import {
  MONGO_READ_QUERY_TIMEOUT,
  MONGO_WRITE_QUERY_TIMEOUT,
} from '../../../constants/constants/shared';

import { DOC_INFO_TTL_IN_SECONDS } from '../../../constants/constants/filePreview';
import { IRatingInfo } from '../../../types/filePreview/types';
import Question from '../../../models/question';
import Rating from '../../../models/rating';
import calculateRating from '../../../utils/filePreview/calculateRating';
import redisClient from '../../../config/redisConfig';

const UpdateRating = async ({
  postId,
  userId,
  ratingArray,
}: {
  postId: string;
  userId: string;
  ratingArray: { ratingArrayValues: number[] };
}) => {
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
    if (rating === null) {
      await session.abortTransaction();
      throw new TRPCError({
        message: 'No document found with the given Id',
        code: 'NOT_FOUND',
      });
    }
    rating = rating.map((item, index) => ({
      ...item,
      averageRating: calculateRating({
        totalRating: item.totalRating,
        avgRating: item.averageRating,
        newRating: ratingArray.ratingArrayValues[index],
      }),
      totalRating: item.totalRating + ratingArray.ratingArrayValues[index],
    }));
    const updateDataInDBPromises = [
      Rating.findOneAndUpdate(
        { postId, userId },
        {
          $setOnInsert: {
            postId,
            userId,
            rating: ratingArray.ratingArrayValues,
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
    const [updatedRatings, updatedDocInfo] = await Promise.all(
      updateDataInDBPromises
    );
    if (updatedRatings !== null) {
      await session.abortTransaction();
      throw new TRPCError({
        message: 'You have already rated this post',
        code: 'CONFLICT',
      });
    }
    const redisKey = `post:${postId}`;
    if (redisClient) {
      await redisClient.set(
        redisKey,
        JSON.stringify(updatedDocInfo),
        'EX',
        DOC_INFO_TTL_IN_SECONDS
      );
    }
  });
  await session.endSession();
};

export default UpdateRating;
