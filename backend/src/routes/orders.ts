import express from 'express';
import { HttpError } from '../lib/http-error.js';
import { toOrderResponse } from '../lib/order-response.js';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

export const ordersRouter = express.Router();

ordersRouter.use(requireAuth);

const ID_PATTERN = /^\d+$/;

ordersRouter.get('/', async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.id },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    include: { items: true },
  });

  res.status(200).json(orders.map(toOrderResponse));
});

ordersRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  // Non-numeric ids are simply treated as not found rather than a separate
  // validation error — there's no valid order they could ever match.
  if (!ID_PATTERN.test(id)) {
    throw new HttpError(404, 'NOT_FOUND', 'Order not found');
  }

  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: { items: true },
  });

  // Always 404, never 403, whether the order doesn't exist or belongs to another
  // user — the existence of someone else's order must not be leaked.
  if (!order || order.userId !== req.user!.id) {
    throw new HttpError(404, 'NOT_FOUND', 'Order not found');
  }

  res.status(200).json(toOrderResponse(order));
});
