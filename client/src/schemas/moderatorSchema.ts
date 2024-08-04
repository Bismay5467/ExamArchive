/* eslint-disable no-magic-numbers */
import { z } from 'zod';

export const addModeratorInputSchema = z.object({
  email: z.string().email({ message: '*Envalid email' }),
  username: z
    .string()
    .min(1, { message: '*Username must contain atleast 1 character!' })
    .max(20, { message: '*Username must contain atmost 20 characters!' }),
  role: z.enum(['SUPERADMIN', 'ADMIN']),
  instituteName: z
    .string()
    .trim()
    .toLowerCase()
    .min(5, { message: '*Username must contain atleast 5 character!' })
    .max(200, { message: '*Username must contain atmost 200 characters!' }),
});
