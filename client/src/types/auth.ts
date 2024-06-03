import { z } from 'zod';
import {
  newUserInputSchema,
  signInUserInputSchema,
  resetInputSchema,
} from '@/schemas/authSchema';

export const ROLE = Object.freeze({
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPERADMIN: 'SUPERADMIN',
  GUEST: 'GUEST',
});

export type TSignUpFormFields = z.infer<typeof newUserInputSchema>;
export type TSignInFormFields = z.infer<typeof signInUserInputSchema>;
export type TResetFormFields = z.infer<typeof resetInputSchema>;

export interface IAuthState {
  isAuth: boolean;
  jwtToken: string | undefined;
  username: string | undefined;
  email: string | undefined;
  userId: string | undefined;
  role: keyof typeof ROLE;
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
  role: keyof typeof ROLE;
  userId: string;
  username: string;
}

export interface IResetJwtPayload {
  email: string;
  exp: number;
  iat: number;
}
