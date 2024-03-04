import { Types } from 'mongoose';
import z from 'zod';

import { MAX_COMMENT_LENGTH } from '../../../constants/constants/filePreview';
import { ROLE } from '../../../constants/constants/auth';

function getValues<T extends Record<string, any>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]];
}

export const getCommentsInputSchema = z.object({
  postId: z.string().refine((postId) => Types.ObjectId.isValid(postId)),
  page: z.number(),
  userId: z.string().refine((userId) => Types.ObjectId.isValid(userId)),
  parentId: z
    .string()
    .refine((parentId) => Types.ObjectId.isValid(parentId))
    .optional(),
  commentType: z.enum(['COMMENTS', 'REPLIES']),
});

export const postCommentsInputSchema = z.object({
  parentId: z
    .string()
    .refine((parentId) => Types.ObjectId.isValid(parentId))
    .optional(),
  postId: z.string().refine((postId) => Types.ObjectId.isValid(postId)),
  userId: z.string().refine((userId) => Types.ObjectId.isValid(userId)),
  message: z.string().trim().min(1).max(MAX_COMMENT_LENGTH),
  isEdited: z.boolean().optional(),
});

export const editCommentInputSchema = z.object({
  commentId: z
    .string()
    .refine((commentId) => Types.ObjectId.isValid(commentId)),
  message: z.string().trim().min(1).max(MAX_COMMENT_LENGTH),
  userId: z.string().refine((userId) => Types.ObjectId.isValid(userId)),
});

export const deleteCommentInputSchema = z.object({
  commentId: z
    .string()
    .refine((commentId) => Types.ObjectId.isValid(commentId)),
  parentId: z
    .string()
    .refine((parentId) => Types.ObjectId.isValid(parentId))
    .optional(),
  userId: z.string().refine((userId) => Types.ObjectId.isValid(userId)),
  role: z.enum(getValues(ROLE)),
});

export const reactCommentInputSchema = z.object({
  commentId: z
    .string()
    .refine((commentId) => Types.ObjectId.isValid(commentId)),
  voterId: z.string().refine((voterId) => Types.ObjectId.isValid(voterId)),
  action: z.enum(['UPVOTE', 'DOWNVOTE']),
  reaction: z.enum(['LIKE', 'UNLIKE']),
});
