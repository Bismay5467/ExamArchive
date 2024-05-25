/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
import resend from '../../config/resendConfig';

dotenv.config({
  path:
    (process.env.NODE_ENV as string).trim() === 'production'
      ? './.env.production.local'
      : './.env.development.local',
});

const sendMail = async ({
  eventName,
  payload,
}: {
  eventName: string;
  payload: Record<string, string | string[]>;
}) => {
  if (resend === undefined) return null;
  if (process.env.RESEND_USER === undefined) {
    console.error(
      'Error: Sender mail address is missing. Please provide a mail address with a verified domain to send a mail'
    );
    return null;
  }
  const { data, error } = await resend.emails.send({
    ...payload,
    from: `ExamArchive ${process.env.RESEND_USER}`,
  } as any);
  if (error) return null;
  return data;
};

export default sendMail;
