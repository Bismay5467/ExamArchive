import z from 'zod';

import { MAX_COMMENT_LENGTH } from '../../../constants/constants/filePreview';

export const getCommentsInputSchema = z.object({
  postId: z.string().trim(),
  page: z.number(),
  userId: z.string().trim(),
  parentId: z.string().trim().optional(),
  commentType: z.enum(['COMMENTS', 'REPLIES']),
});

export const postCommentsInputSchema = z.object({
  parentId: z.string().trim().optional(),
  postId: z.string().trim(),
  userId: z.string().trim(),
  message: z.string().trim().min(1).max(MAX_COMMENT_LENGTH),
  isEdited: z.boolean().optional(),
});

export const editCommentInputSchema = z.object({
  commentId: z.string().trim(),
  message: z.string().trim().min(1).max(MAX_COMMENT_LENGTH),
  userId: z.string().trim(),
});

export const deleteCommentInputSchema = z.object({
  commentId: z.string().trim(),
  parentId: z.string().trim().optional(),
  userId: z.string().trim(),
});

export const reactCommentInputSchema = z.object({
  commentId: z.string().trim(),
  voterId: z.string().trim(),
  action: z.enum(['UPVOTE', 'DOWNVOTE']),
  reaction: z.enum(['LIKE', 'UNLIKE']),
});
