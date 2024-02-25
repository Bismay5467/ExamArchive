/* eslint-disable no-console */
/* eslint-disable no-magic-numbers */
import mongoose from 'mongoose';

const connectDB = async () => {
  const connected = 1;
  if (mongoose.connections[0].readyState === connected) return;

  try {
    const { MONGO_URI } = process.env;

    if (!MONGO_URI) throw new Error('Database connection string is required');

    const MONGO_MAX_POOLSIZE = !process.env.MONGO_MAX_POOLSIZE
      ? 250
      : Number(process.env.MONGO_MAX_POOLSIZE);

    const MONGO_TIMEOUT_MS = !process.env.MONGO_TIMEOUT_MS
      ? 5000
      : Number(process.env.MONGO_TIMEOUT_MS);

    const MAX_IDLE_TIMEOUT = 1000 * 60;

    mongoose.connection.on('connecting', () => {
      console.log('Initiating database connection...');
    });
    mongoose.connection.on('connected', () => {
      console.log('Connected to database!🚀');
    });
    mongoose.connection.on('disconnected', () => {
      console.log('Database disconnected. Trying to reconnect again...');
    });

    await mongoose.connect(MONGO_URI, {
      maxPoolSize: MONGO_MAX_POOLSIZE,
      connectTimeoutMS: MONGO_TIMEOUT_MS,
      maxIdleTimeMS: MAX_IDLE_TIMEOUT,
    });
  } catch (error: any) {
    console.error(error.message);
  }
};

export default connectDB;
