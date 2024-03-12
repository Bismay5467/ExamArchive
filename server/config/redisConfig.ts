import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config({
  path:
    (process.env.NODE_ENV as string).trim() === 'production'
      ? './.env.production.local'
      : './.env.development.local',
});

const configRedis = () => {
  if (process.env.REDIS_URI === undefined) return null;
  const client = new Redis(process.env.REDIS_URI);
  return client;
};

const redisClient = configRedis();

export default redisClient;
