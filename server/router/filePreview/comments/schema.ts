import { Types } from 'mongoose';
import z from 'zod';

import { MAX_COMMENT_LENGTH } from '../../../constants/constants/filePreview';

export const getCommentsInputSchema = z.object({
  postId: z.string().refine((postId) => Types.ObjectId.isValid(postId)),
  page: z.string(),
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
  message: z.string().trim().min(1).max(MAX_COMMENT_LENGTH),
  isEdited: z.boolean().optional(),
});

export const editCommentInputSchema = z.object({
  commentId: z
    .string()
    .refine((commentId) => Types.ObjectId.isValid(commentId)),
  message: z.string().trim().min(1).max(MAX_COMMENT_LENGTH),
});

export const deleteCommentInputSchema = z.object({
  commentId: z
    .string()
    .refine((commentId) => Types.ObjectId.isValid(commentId)),
  parentId: z
    .string()
    .refine((parentId) => Types.ObjectId.isValid(parentId))
    .optional(),
});

export const reactCommentInputSchema = z.object({
  commentId: z
    .string()
    .refine((commentId) => Types.ObjectId.isValid(commentId)),
  action: z.enum(['UPVOTE', 'DOWNVOTE']),
  reaction: z.enum(['LIKE', 'UNLIKE']),
});
