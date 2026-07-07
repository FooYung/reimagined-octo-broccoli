import type { OrderStatus } from '../api/types.ts';

// Mirrors backend/src/routes/admin/orders.ts ALLOWED_TRANSITIONS — the server remains
// the source of truth; this is only used to decide which buttons to render.
export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};
