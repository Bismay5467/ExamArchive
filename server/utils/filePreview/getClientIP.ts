import { Request } from 'express';

export default (req: Request) => {
  const ip =
    ((req.headers['x-forwarded-for'] || '') as string).split(',')[0].trim() ||
    req.socket.remoteAddress;
  return ip;
};
