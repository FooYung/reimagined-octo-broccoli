import express from 'express';
import { z } from 'zod';
import { ORDER_STATUSES, type OrderStatus } from '../../domain/constants.js';
import type { Prisma } from '../../generated/prisma/client.js';
import { HttpError } from '../../lib/http-error.js';
import { toOrderResponse } from '../../lib/order-response.js';
import { prisma } from '../../lib/prisma.js';

export const adminOrdersRouter = express.Router();

const ID_PATTERN = /^\d+$/;

const statusEnum = z.enum([
  ORDER_STATUSES.PENDING,
  ORDER_STATUSES.PROCESSING,
  ORDER_STATUSES.SHIPPED,
  ORDER_STATUSES.DELIVERED,
  ORDER_STATUSES.CANCELLED,
]);

const listQuerySchema = z.object({
  status: statusEnum.optional(),
});

const updateStatusSchema = z.object({ status: statusEnum });

type OrderWithItemsAndUser = Prisma.OrderGetPayload<{ include: { items: true; user: true } }>;

function toAdminOrderResponse(order: OrderWithItemsAndUser) {
  return {
    ...toOrderResponse(order),
    customer: { id: order.user.id, email: order.user.email, name: order.user.name },
  };
}

// Allowed forward transitions. Same-status is intentionally absent from every list
// (a no-op "transition" is still rejected), and DELIVERED/CANCELLED are terminal.
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [ORDER_STATUSES.PROCESSING, ORDER_STATUSES.CANCELLED],
  PROCESSING: [ORDER_STATUSES.SHIPPED, ORDER_STATUSES.CANCELLED],
  SHIPPED: [ORDER_STATUSES.DELIVERED],
  DELIVERED: [],
  CANCELLED: [],
};

adminOrdersRouter.get('/', async (req, res) => {
  const query = listQuerySchema.parse(req.query);

  const orders = await prisma.order.findMany({
    where: query.status ? { status: query.status } : {},
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    include: { items: true, user: true },
  });

  res.status(200).json(orders.map(toAdminOrderResponse));
});

adminOrdersRouter.patch('/:id/status', async (req, res) => {
  const { id } = req.params;

  // Non-numeric ids are simply treated as not found, same as the customer-facing
  // GET /api/orders/:id — there's no valid order they could ever match.
  if (!ID_PATTERN.test(id)) {
    throw new HttpError(404, 'NOT_FOUND', 'Order not found');
  }

  const { status } = updateStatusSchema.parse(req.body);

  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: { items: true, user: true },
  });

  if (!order) {
    throw new HttpError(404, 'NOT_FOUND', 'Order not found');
  }

  const currentStatus = order.status as OrderStatus;
  if (!ALLOWED_TRANSITIONS[currentStatus].includes(status)) {
    throw new HttpError(
      400,
      'INVALID_STATUS_TRANSITION',
      `Cannot change status from ${currentStatus} to ${status}`,
    );
  }

  // Cancellation does NOT restock — documented simplification, see backend/README.md
  // (a future improvement could return cancelled items' quantities to stock).
  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { status },
    include: { items: true, user: true },
  });

  res.status(200).json(toAdminOrderResponse(updated));
});
