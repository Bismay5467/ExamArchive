import dotenv from 'dotenv';
import triggerClient from '../../config/triggerConfig';

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
  if (triggerClient === undefined) return null;
  if (process.env.RESEND_USER === undefined) {
    console.error(
      'Error: Sender mail address is missing. Please provide a mail address with a verified domain to send a mail'
    );
    return null;
  }
  const job = await triggerClient.sendEvent({
    name: eventName,
    payload: { ...payload, from: `ExamArchive ${process.env.RESEND_USER}` },
  });
  return job;
};

export default sendMail;
