import express from 'express';
import { requireAdmin, requireAuth } from '../../middleware/auth.js';
import { adminCategoriesRouter } from './categories.js';
import { adminOrdersRouter } from './orders.js';
import { adminProductsRouter } from './products.js';

export const adminRouter = express.Router();

adminRouter.use(requireAuth, requireAdmin);

// Kept as a cheap endpoint for verifying the 401/403 auth matrix without touching real data.
adminRouter.get('/ping', (_req, res) => {
  res.json({ status: 'ok' });
});

adminRouter.use('/products', adminProductsRouter);
adminRouter.use('/categories', adminCategoriesRouter);
adminRouter.use('/orders', adminOrdersRouter);
