/* eslint-disable no-magic-numbers */
import { Types } from 'mongoose';
import z from 'zod';

export const createFolderInputSchema = z.object({
  action: z.enum(['UPLOAD', 'BOOKMARK']),
  folderName: z.string().min(1).max(30),
});

export const deleteFolderInputSchema = z.object({
  action: z.enum(['UPLOAD', 'BOOKMARK']),
  folderId: z.string().refine((folderId) => Types.ObjectId.isValid(folderId)),
});

export const getFilesInputSchema = z.object({
  action: z.enum(['UPLOAD', 'BOOKMARK']),
  parentId: z
    .string()
    .refine((parentId) => parentId === '' || Types.ObjectId.isValid(parentId)),
});

export const getFolderNamesSchema = z.object({
  action: z.enum(['UPLOAD', 'BOOKMARK']),
});

export const pinFileSchema = z.object({
  fileId: z.string().refine((parentId) => Types.ObjectId.isValid(parentId)),
  action: z.enum(['PIN', 'UNPIN']),
});
