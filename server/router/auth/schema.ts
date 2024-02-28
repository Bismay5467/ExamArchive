/* eslint-disable no-magic-numbers */
import z from 'zod';

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

export const resetInputSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .max(8)
    .refine((password) => {
      const digitRegex = /\d/;
      const symbolRegex = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/;
      return digitRegex.test(password) && symbolRegex.test(password);
    })
    .optional(),
  action: z.enum(['EMAIL', 'RESET']),
});
