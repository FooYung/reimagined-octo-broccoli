import { randomUUID } from 'node:crypto';
import express from 'express';
import { z } from 'zod';
import { ORDER_STATUSES } from '../domain/constants.js';
import { HttpError } from '../lib/http-error.js';
import { toOrderResponse } from '../lib/order-response.js';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

export const checkoutRouter = express.Router();

const checkoutSchema = z.object({
  shippingName: z.string().trim().min(1).max(100),
  shippingLine1: z.string().trim().min(1).max(200),
  // Optional; an empty string is treated the same as omitting the field.
  shippingLine2: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((value) => (value ? value : undefined)),
  shippingCity: z.string().trim().min(1).max(100),
  shippingPostcode: z.string().trim().min(1).max(20),
});

checkoutRouter.post('/', requireAuth, async (req, res) => {
  const shipping = checkoutSchema.parse(req.body);
  const userId = req.user!.id;

  const order = await prisma.$transaction(async (tx) => {
    const basket = await tx.basket.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!basket || basket.items.length === 0) {
      throw new HttpError(400, 'EMPTY_BASKET', 'Basket is empty');
    }

    const failures = basket.items
      .map((item) => {
        if (!item.product.isActive) {
          return {
            productId: item.productId,
            slug: item.product.slug,
            name: item.product.name,
            reason: 'unavailable',
          };
        }
        if (item.quantity > item.product.stock) {
          return {
            productId: item.productId,
            slug: item.product.slug,
            name: item.product.name,
            reason: `insufficient stock (${item.product.stock} available)`,
          };
        }
        return null;
      })
      .filter((failure): failure is NonNullable<typeof failure> => failure !== null);

    if (failures.length > 0) {
      throw new HttpError(
        400,
        'STOCK_CONFLICT',
        'Some items in your basket are no longer available',
        failures,
      );
    }

    for (const item of basket.items) {
      // Belt-and-braces against a race with another checkout that decremented stock
      // between the read above and this write: the conditional `stock: { gte }` makes
      // the decrement atomic, and count !== 1 means someone else got there first.
      const result = await tx.product.updateMany({
        where: { id: item.productId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });
      if (result.count !== 1) {
        const current = await tx.product.findUnique({ where: { id: item.productId } });
        throw new HttpError(
          400,
          'STOCK_CONFLICT',
          'Some items in your basket are no longer available',
          [
            {
              productId: item.productId,
              slug: item.product.slug,
              name: item.product.name,
              reason:
                current && !current.isActive
                  ? 'unavailable'
                  : `insufficient stock (${current?.stock ?? 0} available)`,
            },
          ],
        );
      }
    }

    const totalPence = basket.items.reduce(
      (sum, item) => sum + item.product.pricePence * item.quantity,
      0,
    );

    // orderNumber must be unique from the moment of creation, but the final
    // ORD-{1000 + id} scheme depends on the id Prisma assigns on create — so we
    // create with a throwaway placeholder, then update it once the id is known.
    // (Seeded ORD-1001 = id 1 fits this scheme.)
    const created = await tx.order.create({
      data: {
        orderNumber: `PENDING-${randomUUID()}`,
        userId,
        status: ORDER_STATUSES.PENDING,
        totalPence,
        shippingName: shipping.shippingName,
        shippingLine1: shipping.shippingLine1,
        shippingLine2: shipping.shippingLine2,
        shippingCity: shipping.shippingCity,
        shippingPostcode: shipping.shippingPostcode,
        items: {
          create: basket.items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            unitPricePence: item.product.pricePence,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    const finalOrder = await tx.order.update({
      where: { id: created.id },
      data: { orderNumber: `ORD-${1000 + created.id}` },
      include: { items: true },
    });

    await tx.basketItem.deleteMany({ where: { basketId: basket.id } });

    return finalOrder;
  });

  res.status(201).json(toOrderResponse(order));
});
