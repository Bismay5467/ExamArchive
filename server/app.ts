import { TriggerClient } from '@trigger.dev/sdk';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createMiddleware } from '@trigger.dev/express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import express, { NextFunction, Request, Response } from 'express';

import AppRouter from './router';
import connectDB from './config/dbConfig';
import triggerClient from './config/triggerConfig';
import { ERROR_CODES, SUCCESS_CODES } from './constants/statusCode';
import { ErrorHandler, globalErrorHandler } from './utils/errors/errorHandler';
// import './jobs/sendMails';
import './config/cloudinaryConfig';

dotenv.config({
  path:
    (process.env.NODE_ENV as string).trim() === 'production'
      ? './.env.production.local'
      : './.env.development.local',
});

const app = express();
// eslint-disable-next-line no-magic-numbers
const PORT = Number(process.env.PORT) || 3001;

process.on('uncaughtException', (error) => {
  console.error('Error: UNCAUGHT EXCEPTION! Shutting down...');
  console.error(error.name, error.message);
  process.exit(1);
});
const whitelist = [
  process.env.PROD_CLIENT_URL,
  process.env.DEV_CLIENT_URL,
  process.env.STAGE_CLIENT_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (whitelist.includes(origin)) callback(null, true);
      else callback(new Error('Not allowed by CORS'));
    },
    optionsSuccessStatus: SUCCESS_CODES.OK,
    credentials: true,
  })
);
// app.use(cors({ credentials: true, origin: true }));
app.use(createMiddleware(triggerClient as TriggerClient));
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(compression({ level: 6, threshold: 1000 }));
app.use(fileUpload());

AppRouter.forEach(({ segment, router }) => {
  app.use(`/api/v1/${segment}`, router);
});

app.post('/', (req: Request, res: Response) => {
  res
    .status(SUCCESS_CODES.OK)
    .json({ message: 'Server instance is up and running' });
});

app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  next(
    new ErrorHandler(
      `Route ${req.originalUrl} not found!`,
      ERROR_CODES['NOT FOUND']
    )
  );
});

app.use(globalErrorHandler);

app.listen(PORT, async () => {
  await connectDB();
  // eslint-disable-next-line no-console
  console.log(`Log: Server listening on PORT ${PORT}`);
});

process.on('unhandledRejection', (error: Error) => {
  console.error('Error: UNHANDLED REJECTION! Shutting down...');
  console.error(error.name, error.message);
  process.exit(1);
});
