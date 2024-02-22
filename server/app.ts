import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';

import { ERROR_CODES, SUCCESS_CODES } from './constants/statusCode';
import { ErrorHandler, globalErrorHandler } from './utils/errorHandler';

dotenv.config({
  path:
    process.env.NODE_ENV.trim() === 'production'
      ? './.env.production.local'
      : './.env.development.local',
});

const app = express();
// eslint-disable-next-line no-magic-numbers
const PORT = Number(process.env.PORT) || 3001;

process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(error.name, error.message);
  process.exit(1);
});

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression({ level: 6, threshold: 1000 }));

app.get('/', (_req, res: Response) => {
  res.status(SUCCESS_CODES.OK).json({ message: 'This is a get request' });
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

console.error(process.env);

if (process.env.NODE_ENV.trim() === 'production') module.exports = app;
// eslint-disable-next-line no-console
else app.listen(PORT, () => console.log(`Server listening on port ${PORT}🚀`));

process.on('unhandledRejection', (error: Error) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(error.name, error.message);
  process.exit(1);
});
