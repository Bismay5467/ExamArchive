export const CLIENT_ROUTES = Object.freeze({
  HOME: '/',
  SEARCH: '/search',
  FILE_PREVIEW: '/preview',
  AUTH_LOGIN: '/auth/login',
  AUTH_SIGNUP: '/auth/signup',
  AUTH_RESET: '/auth/reset',
  DASHBOARD_PROFILE: 'profile',
  DASHBOARD_FILEUPLOAD: 'fileupload',
  DASHBOARD_ANALYTICS: 'analytics',
  DASHBOARD_BOOKMARKS: 'bookmarks',
});

export const SERVER_ROUTES = Object.freeze({
  SEARCH: '/api/v1/search',
  LOGIN: '/api/v1/auth/signIn',
  RESET: '/api/v1/auth/reset',
  SIGNUP: '/api/v1/auth/newUser',
  UPLOAD: '/api/v1/upload',
  FOLDER: '/api/v1/folder',
  FILE: '/api/v1/file',
  REPORT: '/api/v1/report',
  BOOKMARK: '/api/v1/bookmark',
  UPDATE_CACHE: '/api/v1/superAdmin/update',
  COMMENT: '/api/v1/comment',
  SUPER_ADMIN: '/api/v1/superAdmin',
});
