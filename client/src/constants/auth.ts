/* eslint-disable no-magic-numbers */
export const ROLES = Object.freeze({
  USER: 'USER',
  GUEST: 'GUEST',
  ADMIN: 'ADMIN',
  SUPERADMIN: 'SUPERADMIN',
});

export const AUTH_TOKEN = 'auth-token';

export const getAvatar = (username: string) => {
  const avatars: string[] = [
    'https://res.cloudinary.com/dzorpsnmn/image/upload/v1721202338/EXAM-ARCHIVE-ASSETS/chy0a9jt3gv9phbmcuul.webp',
    'https://res.cloudinary.com/dzorpsnmn/image/upload/v1721203527/EXAM-ARCHIVE-ASSETS/q3vom8jyozbxjnuggou5.png',
    'https://res.cloudinary.com/dzorpsnmn/image/upload/v1721203527/EXAM-ARCHIVE-ASSETS/ye0kmx4gibko9nifyhur.webp',
    'https://res.cloudinary.com/dzorpsnmn/image/upload/v1721203528/EXAM-ARCHIVE-ASSETS/lgsb6fcv3bu2iabyiu2r.png',
  ];
  const NO_OF_AVAILABLE_AVATARS = avatars.length;
  const total =
    (username ?? 'GUEST')
      .split('')
      .reduce(
        (sum, char) => sum + (char.charCodeAt(0) % NO_OF_AVAILABLE_AVATARS),
        0
      ) % NO_OF_AVAILABLE_AVATARS;
  const idx = (total % 10) % NO_OF_AVAILABLE_AVATARS;
  return avatars[Math.max(0, Math.min(idx, NO_OF_AVAILABLE_AVATARS - 1))];
};
