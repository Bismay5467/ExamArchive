import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';

import { SUCCESS_CODES } from './constants/statusCode';

dotenv.config({
  path:
    (process.env.NODE_ENV as string).trim() === 'production'
      ? './.env.production.local'
      : './.env.development.local',
});

const app: Express = express();
// eslint-disable-next-line no-magic-numbers
const PORT = Number(process.env.PORT) || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req: Request, res: Response) => {
  res.status(SUCCESS_CODES.OK).json({ message: 'This is a get request' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`LOG: Server listening on PORT ${PORT}`);
});
