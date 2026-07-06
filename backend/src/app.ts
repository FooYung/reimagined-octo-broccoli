import cookieParser from 'cookie-parser';
import express, { type Express } from 'express';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { requestLogger } from './middleware/request-logger.js';
import { adminRouter } from './routes/admin/index.js';
import { authRouter } from './routes/auth.js';
import { basketRouter } from './routes/basket.js';
import { categoriesRouter } from './routes/categories.js';
import { checkoutRouter } from './routes/checkout.js';
import { ordersRouter } from './routes/orders.js';
import { productsRouter } from './routes/products.js';

export const app: Express = express();

app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/basket', basketRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/orders', ordersRouter);

app.use('/api', notFoundHandler);
app.use(errorHandler);
