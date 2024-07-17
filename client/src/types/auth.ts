import { z } from 'zod';

import { ROLES } from '@/constants/auth';
import {
  newUserInputSchema,
  resetInputSchema,
  signInUserInputSchema,
} from '@/schemas/authSchema';

export type TSignUpFormFields = z.infer<typeof newUserInputSchema>;
export type TSignInFormFields = z.infer<typeof signInUserInputSchema>;
export type TResetFormFields = z.infer<typeof resetInputSchema>;
export type TRole = keyof typeof ROLES;

export interface IAuthState {
  isAuth: boolean;
  jwtToken: string | undefined;
  username: string | undefined;
  email: string | undefined;
  userId: string | undefined;
  role: TRole;
}

export interface IAuthContext {
  authState: IAuthState;
  SET(): void;
  RESET(): void;
}

export interface ISignInJwtPayload {
  email: string;
  exp: number;
  iat: number;
  role: TRole;
  userId: string;
  username: string;
}

export interface IResetJwtPayload {
  email: string;
  exp: number;
  iat: number;
}
