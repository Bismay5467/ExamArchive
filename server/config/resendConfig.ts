// import { Resend } from '@trigger.dev/resend';
import {Resend} from 'resend';
import dotenv from 'dotenv';

dotenv.config({
  path:
    (process.env.NODE_ENV as string).trim() === 'production'
      ? './.env.production.local'
      : './.env.development.local',
});

const configResend = () => {
  if (!(process.env.RESEND_API_KEY && process.env.RESEND_INTEGRATION_ID)) {
    console.error(
      'Error: Resend API key is missing. Please provide one to configure resend instance properly'
    );
    return undefined;
  }
  const resend = new Resend(process.env.RESEND_API_KEY as string,);
  return resend;
};

const resend = configResend();

export default resend;
