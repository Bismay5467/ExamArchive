/* eslint-disable import/prefer-default-export */
/* eslint-disable camelcase */
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

import { ERROR_CODES } from '../constants/statusCode';
import {
  ALLOWED_FILE_FORMATS,
  CLOUDINARY_WEBHOOK_ROUTE,
  TRANSFORMED_FORMAT,
} from '../constants/constants/upload';

dotenv.config({
  path:
    (process.env.NODE_ENV as string).trim() === 'production'
      ? './.env.production.local'
      : './.env.development.local',
});

(function () {
  const {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    CLOUDINARY_PRESET,
    CLOUDINARY_FOLDER,
  } = process.env;
  if (
    !(
      CLOUDINARY_CLOUD_NAME &&
      CLOUDINARY_API_KEY &&
      CLOUDINARY_API_SECRET &&
      CLOUDINARY_PRESET &&
      CLOUDINARY_FOLDER
    )
  ) {
    console.error(
      'Please provide all the required cloudinary env variables to connect to the cloudinary instance'
    );
    return;
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: process.env.NODE_ENV?.trim() === 'production',
  });

  const doPresetExists = cloudinary.api.upload_preset(CLOUDINARY_PRESET);

  doPresetExists.catch((error: any) => {
    if (error.error.http_code === ERROR_CODES['NOT FOUND']) {
      cloudinary.api.create_upload_preset({
        name: CLOUDINARY_PRESET,
        folder: process.env.CLOUDINARY_FOLDER,
        allowed_formats: ALLOWED_FILE_FORMATS.join(', '),
        unsigned: true,
        format: TRANSFORMED_FORMAT,
        async: true,
        notification_url: `${process.env.PRODUCTION_URL}${CLOUDINARY_WEBHOOK_ROUTE}`,
      });
      // eslint-disable-next-line no-console
      console.log('New upload preset created');
    } else console.error(error);
  });
})();

export const uploadToCloudinary = (dataURI: string, filename: string) =>
  cloudinary.uploader.upload(dataURI, {
    upload_preset: process.env.CLOUDINARY_PRESET,
    public_id: filename,
    resource_type: 'auto',
  });
