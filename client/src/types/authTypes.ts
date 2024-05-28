import { z } from 'zod';
import {
  newUserInputSchema,
  signInUserInputSchema,
} from '@/constants/authSchema';

export type SignUpFormFields = z.infer<typeof newUserInputSchema>;
export type SignInFormFields = z.infer<typeof signInUserInputSchema>;
