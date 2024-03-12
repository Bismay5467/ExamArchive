import { TriggerClient } from '@trigger.dev/sdk';
import dotenv from 'dotenv';

import { TRIGGER_ID } from '../constants/constants/auth';

dotenv.config({
  path:
    (process.env.NODE_ENV as string).trim() === 'production'
      ? './.env.production.local'
      : './.env.development.local',
});

const configTriggerDev = () => {
  const { TRIGGER_API_KEY, TRIGGER_API_URL } = process.env;
  if (!(TRIGGER_API_KEY && TRIGGER_API_URL)) {
    console.error(
      'Error: Some of the trigger dev env variables are missing. Please provide one to configure trigger dev instance properly'
    );
    return undefined;
  }
  const client = new TriggerClient({
    id: TRIGGER_ID,
    apiKey: process.env.TRIGGER_API_KEY,
    apiUrl: process.env.TRIGGER_API_URL,
  });
  return client;
};

const triggerClient = configTriggerDev();

export default triggerClient;
