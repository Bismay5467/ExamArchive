export const FILE_TYPE = Object.freeze({
  DIRECTORY: 'directory',
  FILE: 'file',
});

export const MAX_FILES_FETCH_LIMIT = 20;

export const MAX_FILE_SIZE_MB = 2;

export const ALLOWED_FILE_FORMATS = ['pdf'] as const;
export const TRANSFORMED_FORMAT = ['pdf'] as const;

export const CLOUDINARY_WEBHOOK_ROUTE = '/api/v1/upload.webhook';
