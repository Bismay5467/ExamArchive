export const ROLES = Object.freeze({
  USER: 'USER',
  GUEST: 'GUEST',
  ADMIN: 'ADMIN',
  SUPERADMIN: 'SUPERADMIN',
});

export const AUTH_TOKEN = 'auth-token';

export const getAvatar = (username: string) =>
  `https://ui-avatars.com/api/?background=random&name=${username}`;
