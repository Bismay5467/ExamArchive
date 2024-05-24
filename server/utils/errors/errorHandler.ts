import { Request, Response } from 'express';

class ErrorHandler extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const globalErrorHandler = (
  error: ErrorHandler,
  _req: Request,
  res: Response
) => {
  console.error('In global');
  error.statusCode ||= 500;
  error.message ||= 'Internal Server Error';
  res.status(error.statusCode).json({ message: error.message, success: false });
};

export { globalErrorHandler, ErrorHandler };
