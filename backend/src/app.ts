import cookieParser from 'cookie-parser';
import express, { type Express } from 'express';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { requestLogger } from './middleware/request-logger.js';
import { adminRouter } from './routes/admin.js';
import { authRouter } from './routes/auth.js';

export const app: Express = express();

app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

app.use('/api', notFoundHandler);
app.use(errorHandler);
