/* eslint-disable no-magic-numbers */
import z from 'zod';

import { ROLE } from '../../constants/constants/auth';

export const addInputSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1).max(20),
  role: z.enum([ROLE.ADMIN, ROLE.SUPERADMIN]),
});

export const removeInputSchema = z.object({
  email: z.string().email(),
  username: z.string().max(20),
  role: z.enum([ROLE.ADMIN, ROLE.SUPERADMIN]),
});

export const getInputSchema = z.object({
  role: z.enum([ROLE.ADMIN, ROLE.SUPERADMIN]),
});

export const updateSchema = z.object({
  role: z.enum([ROLE.ADMIN, ROLE.SUPERADMIN]),
});
