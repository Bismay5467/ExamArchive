import { z } from 'zod';
import { newUserInputSchema } from '@/constants/authSchema';

export type SignUpFormFields = z.infer<typeof newUserInputSchema>;
