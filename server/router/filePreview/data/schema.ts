/* eslint-disable no-magic-numbers */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
import z from 'zod';

import { RATING_TYPE } from '../../../constants/constants/filePreview';

export const getFileInputSchema = z.object({
  postId: z.string().transform((postId) => postId.trim()),
  userId: z.string().transform((userId) => userId.trim()),
});

export const editTagsInputSchema = z.object({
  postId: z.string().transform((postId) => postId.trim()),
  newTags: z
    .array(z.string())
    .transform((newTags) =>
      newTags.map((tag) => tag.trim().toLowerCase()).filter(Boolean)
    )
    .refine((newTags) => newTags.length > 0),
});

export const updateDownloadCountInputSchema = z.object({
  postId: z.string().transform((postId) => postId.trim()),
  userId: z.string().transform((userId) => userId.trim()),
});

export const updateViewCountInputSchema = z.object({
  postId: z.string().transform((postId) => postId.trim()),
  userId: z.string().transform((userId) => userId.trim()),
});

export const ratingInputSchema = z.object({
  postId: z.string().transform((postId) => postId.trim()),
  userId: z.string().transform((userId) => userId.trim()),
  ratingArray: z
    .array(
      z.object({
        type: z.enum(['HELPFUL', 'STANDARD', 'RELEVANCE']),
        value: z.number().min(0).max(5),
      })
    )
    .length(3)
    .transform((ratingArray) => {
      const ratingArrayValues = ratingArray.map(({ value }) => value);

      const [helpfulRating, standardRating, relevanceRating] = Object.values(
        RATING_TYPE
      ).map(
        (type) =>
          ratingArray.find((rating) => rating.type.toLowerCase() === type)
            ?.value || 0
      );
      return {
        ratingArrayValues,
        helpfulRating,
        standardRating,
        relevanceRating,
      };
    }),
});
