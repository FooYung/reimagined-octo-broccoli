import express from 'express';
import { z } from 'zod';
import { HttpError } from '../lib/http-error.js';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

export const basketRouter = express.Router();

basketRouter.use(requireAuth);

const ID_PATTERN = /^\d+$/;

const addItemSchema = z.object({
  productId: z.number().int(),
  quantity: z.number().int().min(1),
});

const updateItemSchema = z.object({
  quantity: z.number().int().min(1),
});

function parseProductIdParam(param: string): number {
  if (!ID_PATTERN.test(param)) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'Invalid product id');
  }
  return Number(param);
}

// Shared shape for GET /api/basket and every mutation response below — basket items
// always carry the product's CURRENT price/stock/active values (the basket shows live
// data; checkout re-validates against them at the point of purchase).
async function getBasketShape(userId: number) {
  const basket = await prisma.basket.findUnique({
    where: { userId },
    include: {
      items: {
        orderBy: { id: 'asc' },
        include: { product: true },
      },
    },
  });

  if (!basket) {
    return { items: [], totalPence: 0 };
  }

  const items = basket.items.map((item) => ({
    productId: item.productId,
    name: item.product.name,
    slug: item.product.slug,
    pricePence: item.product.pricePence,
    stock: item.product.stock,
    isActive: item.product.isActive,
    imageUrl: item.product.imageUrl,
    quantity: item.quantity,
    lineTotalPence: item.product.pricePence * item.quantity,
  }));

  const totalPence = items.reduce((sum, item) => sum + item.lineTotalPence, 0);

  return { items, totalPence };
}

basketRouter.get('/', async (req, res) => {
  res.status(200).json(await getBasketShape(req.user!.id));
});

basketRouter.post('/items', async (req, res) => {
  const { productId, quantity } = addItemSchema.parse(req.body);

  // Inactive products are filtered out here (not checked after the query) so a missing
  // product and an inactive product are indistinguishable — both simply don't match.
  const product = await prisma.product.findFirst({ where: { id: productId, isActive: true } });
  if (!product) {
    throw new HttpError(404, 'NOT_FOUND', 'Product not found');
  }

  // Lazily create the basket row on first add.
  const basket = await prisma.basket.upsert({
    where: { userId: req.user!.id },
    create: { userId: req.user!.id },
    update: {},
  });

  const existingItem = await prisma.basketItem.findUnique({
    where: { basketId_productId: { basketId: basket.id, productId } },
  });

  const newQuantity = (existingItem?.quantity ?? 0) + quantity;
  if (newQuantity > product.stock) {
    throw new HttpError(400, 'INSUFFICIENT_STOCK', `Only ${product.stock} in stock`);
  }

  if (existingItem) {
    await prisma.basketItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
    });
  } else {
    await prisma.basketItem.create({
      data: { basketId: basket.id, productId, quantity: newQuantity },
    });
  }

  res.status(200).json(await getBasketShape(req.user!.id));
});

basketRouter.patch('/items/:productId', async (req, res) => {
  const productId = parseProductIdParam(req.params.productId);
  const { quantity } = updateItemSchema.parse(req.body);

  const product = await prisma.product.findFirst({ where: { id: productId, isActive: true } });
  if (!product) {
    throw new HttpError(404, 'NOT_FOUND', 'Product not found');
  }

  const basket = await prisma.basket.findUnique({ where: { userId: req.user!.id } });
  const existingItem = basket
    ? await prisma.basketItem.findUnique({
        where: { basketId_productId: { basketId: basket.id, productId } },
      })
    : null;
  if (!existingItem) {
    throw new HttpError(404, 'NOT_FOUND', 'Item not in basket');
  }

  if (quantity > product.stock) {
    throw new HttpError(400, 'INSUFFICIENT_STOCK', `Only ${product.stock} in stock`);
  }

  await prisma.basketItem.update({ where: { id: existingItem.id }, data: { quantity } });

  res.status(200).json(await getBasketShape(req.user!.id));
});

basketRouter.delete('/items/:productId', async (req, res) => {
  const productId = parseProductIdParam(req.params.productId);

  const basket = await prisma.basket.findUnique({ where: { userId: req.user!.id } });
  const existingItem = basket
    ? await prisma.basketItem.findUnique({
        where: { basketId_productId: { basketId: basket.id, productId } },
      })
    : null;
  if (!existingItem) {
    throw new HttpError(404, 'NOT_FOUND', 'Item not in basket');
  }

  await prisma.basketItem.delete({ where: { id: existingItem.id } });

  res.status(200).json(await getBasketShape(req.user!.id));
});

basketRouter.delete('/', async (req, res) => {
  const basket = await prisma.basket.findUnique({ where: { userId: req.user!.id } });
  if (basket) {
    await prisma.basketItem.deleteMany({ where: { basketId: basket.id } });
  }

  res.status(200).json({ items: [], totalPence: 0 });
});
