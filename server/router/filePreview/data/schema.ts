/* eslint-disable no-magic-numbers */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
import { Types } from 'mongoose';
import z from 'zod';

export const getFileInputSchema = z.object({
  postId: z.string().refine((postId) => Types.ObjectId.isValid(postId)),
});

export const editTagsInputSchema = z.object({
  postId: z.string().refine((postId) => Types.ObjectId.isValid(postId)),
  newTags: z
    .array(z.string())
    .transform((newTags) =>
      newTags.map((tag) => tag.trim().toLowerCase()).filter(Boolean)
    )
    .refine((newTags) => newTags.length > 0),
});

export const updateDownloadCountInputSchema = z.object({
  postId: z.string().refine((postId) => Types.ObjectId.isValid(postId)),
  userId: z.string().refine((postId) => Types.ObjectId.isValid(postId)),
});

export const updateViewCountInputSchema = z.object({
  postId: z.string().refine((postId) => Types.ObjectId.isValid(postId)),
  userId: z.string().refine((postId) => Types.ObjectId.isValid(postId)),
});

export const ratingInputSchema = z.object({
  postId: z.string().refine((postId) => Types.ObjectId.isValid(postId)),
  userId: z.string().refine((postId) => Types.ObjectId.isValid(postId)),
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
      return { ratingArrayValues };
    }),
});

export const deleteFileInputSchema = z.object({
  postId: z.string().refine((postId) => Types.ObjectId.isValid(postId)),
});
