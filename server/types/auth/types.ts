import { ROLE } from '../../constants/constants/auth';

export interface IJWTPayload {
  [key: string]: string;
}

export type TRole = keyof typeof ROLE;

export interface IUser {
  username: string;
  email: string;
  userId: string;
  role: TRole;
}
