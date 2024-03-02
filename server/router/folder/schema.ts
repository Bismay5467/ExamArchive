/* eslint-disable no-magic-numbers */
import z from 'zod';

export const createFolderInputSchema = z.object({
  action: z.enum(['UPLOAD', 'BOOKMARK']),
  folderName: z.string().min(1).max(30),
});

export const deleteFolderInputSchema = z.object({
  action: z.enum(['UPLOAD', 'BOOKMARK']),
  folderName: z.string().min(1).max(30),
});

export const getFilesInputSchema = z.object({
  action: z.enum(['UPLOAD', 'BOOKMARK']),
  page: z.number().min(1),
  parentId: z.union([z.string(), z.null()]),
});
