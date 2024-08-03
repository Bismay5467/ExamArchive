export type TModeratorRole = 'SUPERADMIN' | 'ADMIN';

export interface IMderatorDetails {
  email: string;
  invitationStatus: string;
  userId: string;
  username: string;
}

export interface IModerator {
  email: string;
  username: string;
  role: TModeratorRole;
  instituteName: string;
}
