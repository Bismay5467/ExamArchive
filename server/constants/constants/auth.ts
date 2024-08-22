export const AUTH_TOKEN = 'auth-token';
// eslint-disable-next-line no-magic-numbers
export const COOKIES_TTL = 60 * 60 * 24 * 1000 * 30;
export const JWT_MAX_AGE = '30d';
export const RESET_LINK_EXP_TIME = '2h';
export const RESET_LINK_TTL_HRS = 2;
export const REGISTRATION_OTP_TTL_SECONDS = 600;

export const TRIGGER_ID = 'exam-archive';

export const INVITATION_STATUS = Object.freeze({
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
});

export const ROLE = Object.freeze({
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPERADMIN: 'SUPERADMIN',
  GUEST: 'GUEST',
});

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 16;
