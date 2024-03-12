/* eslint-disable no-magic-numbers */
import { Types } from 'mongoose';
import z from 'zod';

export const addBookmarkInputSchema = z.object({
  folderId: z.string().refine((folderId) => Types.ObjectId.isValid(folderId)),
  fileId: z.string().refine((fileId) => Types.ObjectId.isValid(fileId)),
  fileName: z.string().min(1).max(100),
});

export const removeBookmarkInputSchema = z.object({
  fileId: z.string().refine((fileId) => Types.ObjectId.isValid(fileId)),
  folderId: z.string().refine((folderId) => Types.ObjectId.isValid(folderId)),
});
