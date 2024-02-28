import dotenv from 'dotenv';
import resend from '../../config/resendConfig';

dotenv.config({
  path:
    (process.env.NODE_ENV as string).trim() === 'production'
      ? './.env.production.local'
      : './.env.development.local',
});

const sendMail = async ({
  receiver,
  subject,
  react,
}: {
  receiver: string[];
  subject: string;
  react: any;
}) => {
  if (resend === undefined) return null;
  if (process.env.RESEND_USER === undefined) {
    console.error(
      'Error: Sender mail address is missing. Please provide a mail address with a verified domain to send a mail'
    );
    return null;
  }

  const data = await resend.emails.send({
    from: `ExamArchive ${process.env.RESEND_USER}`,
    to: receiver,
    subject,
    react,
  });

  return data;
};

export default sendMail;
