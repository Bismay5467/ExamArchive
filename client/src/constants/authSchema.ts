/* eslint-disable no-magic-numbers */
import z from 'zod';

export const ROLE = Object.freeze({ USER: 'USER', ADMIN: 'ADMIN' });
function getValues<T extends Record<string, any>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]];
}

export const newUserInputSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1).max(10),
  password: z
    .string()
    .min(6, { message: '*Password must contain atleast 6 character(s)!' })
    .max(8, { message: '*Password must contain at most 8 character(s)!' })
    .refine(
      (password) => {
        const digitRegex = /\d/;
        const symbolRegex = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/;
        return digitRegex.test(password) && symbolRegex.test(password);
      },
      { message: '*Password must contain atleast one symbol and digit!' }
    ),
  role: z.enum(getValues(ROLE)).optional(),
  actionType: z.enum(['GENERATE', 'VERIFY']).optional(),
  enteredOTP: z
    .string()
    .length(6, { message: '*OTP must contain exatly 6 characters!' })
    .optional(),
});

export const signInUserInputSchema = z.object({
  username: z.string(),
  password: z
    .string()
    .min(6, { message: '*Password must contain atleast 6 character(s)!' })
    .max(8, { message: '*Password must contain at most 8 character(s)!' })
    .refine(
      (password) => {
        const digitRegex = /\d/;
        const symbolRegex = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/;
        return digitRegex.test(password) && symbolRegex.test(password);
      },
      { message: '*Password must contain atleast one symbol and digit!' }
    ),
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
