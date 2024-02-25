import * as trpcExpress from '@trpc/server/adapters/express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';

import { appRouter } from './router';
import { createContext } from './config/trpcConfig';
import { ERROR_CODES, SUCCESS_CODES } from './constants/statusCode';
import { ErrorHandler, globalErrorHandler } from './utils/errors/errorHandler';

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
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(error.name, error.message);
  process.exit(1);
});

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: SUCCESS_CODES.OK,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression({ level: 6, threshold: 1000 }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  '/api/v1',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
    onError: ({ path, error, ctx, type }) => {
      console.error(`Logging error : ${error}`);
      console.error(
        `Type of API call: ${type}, Context: ${JSON.stringify(ctx)}, path: ${path}`
      );
    },
  })
);

app.get('/', (_req: Request, res: Response) => {
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

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`LOG: Server listening on PORT ${PORT}`);
});

process.on('unhandledRejection', (error: Error) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(error.name, error.message);
  process.exit(1);
});
