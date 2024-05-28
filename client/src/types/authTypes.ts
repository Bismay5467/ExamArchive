import { z } from 'zod';
import {
  newUserInputSchema,
  signInUserInputSchema,
  resetInputSchema,
} from '@/constants/authSchema/authSchema';

export type SignUpFormFields = z.infer<typeof newUserInputSchema>;
export type SignInFormFields = z.infer<typeof signInUserInputSchema>;
export type ResetFormFields = z.infer<typeof resetInputSchema>;
