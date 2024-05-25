import { INVITATION_STATUS, ROLE } from '../../constants/constants/auth';

export interface IJWTPayload {
  [key: string]: string;
}

export type TRole = keyof typeof ROLE;
export type TInvitationStatus = keyof typeof INVITATION_STATUS;

export interface IUser {
  username: string;
  email: string;
  userId: string;
  role: TRole;
}
