export const CLIENT_ROUTES = Object.freeze({
  HOME: '/',
  SEARCH: '/search',
  FILE_PREVIEW: '/filePreview',
  AUTH_LOGIN: '/auth/login',
  AUTH_SIGNUP: '/auth/signup',
  AUTH_RESET: '/auth/reset',
});

export const SERVER_ROUTES = Object.freeze({
  SEARCH: '/api/v1/search',
  LOGIN: '/api/v1/auth/signIn',
  RESET: '/api/v1/auth/reset',
  SIGNUP: '/api/v1/auth/newUser',
});
