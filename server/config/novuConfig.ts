import { Novu } from '@novu/node';
import dotenv from 'dotenv';

dotenv.config({
  path:
    (process.env.NODE_ENV as string).trim() === 'production'
      ? './.env.production.local'
      : './.env.development.local',
});

const configNovu = () => {
  const { NOVU_API_SECRET } = process.env;
  if (NOVU_API_SECRET === undefined) {
    console.error(
      "Some of the novu's env variables are missing. Please check again to connect to novu instance"
    );
    return null;
  }
  const client = new Novu(NOVU_API_SECRET);
  return client;
};

const novuClient = configNovu();

export default novuClient;
