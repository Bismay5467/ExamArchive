/* eslint-disable no-magic-numbers */
import { TRPCError } from '@trpc/server';
import redisClient from '../../config/redisConfig';
import { similarityScore } from '../../utils/upload/utils';

const REDIS_KEY = 'INSTITUTIONS';

export const AddNameToCache = async (name: string) => {
  if (redisClient === null) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong.Please try again later',
    });
  }
  await redisClient.sadd(REDIS_KEY, name);
};

export const GetNamesFromCache = async (searchParams: string) => {
  if (redisClient === null) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong. Please try again later',
    });
  }
  const allNames = await redisClient.smembers(REDIS_KEY);
  const scoredStrings = allNames
    .map((str) => ({
      string: str,
      score: similarityScore(str, searchParams),
    }))
    .sort((a, b) => b.score - a.score);
  // const scoredStrings = allNames
  //   .map((str) => {
  //     const score = similarityScore(
  //       str.toUpperCase(),
  //       searchParams.toUpperCase()
  //     );
  //     console.log(str, searchParams, score);
  //     return { string: str, score };
  //   })
  //   .sort((a, b) => b.score - a.score);
  return scoredStrings.slice(0, 10).map((item) => item.string);
};
