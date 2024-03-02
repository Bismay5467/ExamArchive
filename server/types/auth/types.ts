export interface IJWTPayload {
  [key: string]: string;
}

export interface IUser {
  username: string;
  email: string;
  userId: string;
}
