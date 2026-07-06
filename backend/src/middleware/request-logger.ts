import type { NextFunction, Request, Response } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const { method, path } = req;

  res.on('finish', () => {
    const durationMs = Date.now() - start;
    console.log(`${method} ${path} ${res.statusCode} ${durationMs}ms`);
  });

  next();
};
