// SQLite (via Prisma) does not support native enums, so User.role and Order.status
// are plain strings in the schema. These constants enforce the allowed values at
// the application level instead.

export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ORDER_STATUSES = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];
