import type { Prisma } from '../generated/prisma/client.js';

export type OrderWithItems = Prisma.OrderGetPayload<{ include: { items: true } }>;

export function toOrderResponse(order: OrderWithItems) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    totalPence: order.totalPence,
    createdAt: order.createdAt,
    shippingName: order.shippingName,
    shippingLine1: order.shippingLine1,
    shippingLine2: order.shippingLine2,
    shippingCity: order.shippingCity,
    shippingPostcode: order.shippingPostcode,
    items: order.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      unitPricePence: item.unitPricePence,
      quantity: item.quantity,
      lineTotalPence: item.unitPricePence * item.quantity,
    })),
  };
}
