/* eslint-disable no-magic-numbers */
import { Types } from 'mongoose';
import z from 'zod';

export const addAdminInputSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1).max(10),
});

export const removeAdminInputSchema = z.object({
  email: z.string().email(),
  adminId: z.string().refine((adminId) => Types.ObjectId.isValid(adminId)),
  username: z.string().max(20),
});
