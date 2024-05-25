/* eslint-disable no-magic-numbers */
import z from 'zod';

import { ROLE } from '../../constants/constants/auth';

export const newUserInputSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1).max(10),
  password: z
    .string()
    .min(6)
    .max(8)
    .refine((password) => {
      const digitRegex = /\d/;
      const symbolRegex = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/;
      return digitRegex.test(password) && symbolRegex.test(password);
    }),
  role: z.enum([ROLE.USER]),
  actionType: z.enum(['GENERATE', 'VERIFY']),
  enteredOTP: z.string().length(6).optional(),
});

export const signInUserInputSchema = z.object({
  username: z.string(),
  password: z
    .string()
    .min(6)
    .max(8)
    .refine((password) => {
      const digitRegex = /\d/;
      const symbolRegex = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/;
      return digitRegex.test(password) && symbolRegex.test(password);
    }),
});

const baseResetInputSchema = z.object({ email: z.string().email() });

export const resetInputSchema = z.discriminatedUnion('action', [
  z.object({ action: z.enum(['EMAIL']) }).merge(baseResetInputSchema),
  z
    .object({
      action: z.enum(['RESET']),
      password: z
        .string()
        .min(6)
        .max(8)
        .refine((password) => {
          const digitRegex = /\d/;
          const symbolRegex = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/;
          return digitRegex.test(password) && symbolRegex.test(password);
        }),
      authToken: z.string(),
    })
    .merge(baseResetInputSchema),
]);
