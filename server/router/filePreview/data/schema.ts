/* eslint-disable no-magic-numbers */

import { Types } from 'mongoose';
import z from 'zod';

export const getFileInputSchema = z.object({
  postId: z.string().refine((postId) => Types.ObjectId.isValid(postId)),
});

export const editTagsInputSchema = z.object({
  postId: z.string().refine((postId) => Types.ObjectId.isValid(postId)),
  tagsToAdd: z
    .array(z.string())
    .transform((newTags) =>
      newTags.map((tag) => tag.trim().toLowerCase()).filter(Boolean)
    ),
  tagsToRemove: z
    .array(z.string())
    .transform((newTags) =>
      newTags.map((tag) => tag.trim().toLowerCase()).filter(Boolean)
    ),
});

export const updateDownloadCountInputSchema = z.object({
  postId: z.string().refine((postId) => Types.ObjectId.isValid(postId)),
});

export const updateViewCountInputSchema = z.object({
  postId: z.string().refine((postId) => Types.ObjectId.isValid(postId)),
});

export const ratingInputSchema = z.object({
  postId: z.string().refine((postId) => Types.ObjectId.isValid(postId)),
  ratingArray: z
    .array(
      z.object({
        type: z.enum(['HELPFUL', 'STANDARD', 'RELEVANCE']),
        value: z.number().min(0).max(5),
      })
    )
    .length(3),
});

export const deleteFileInputSchema = z.object({
  postId: z.string().refine((postId) => Types.ObjectId.isValid(postId)),
});
