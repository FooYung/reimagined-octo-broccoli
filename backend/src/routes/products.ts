import express from 'express';
import { z } from 'zod';
import { Prisma } from '../generated/prisma/client.js';
import { HttpError } from '../lib/http-error.js';
import { prisma } from '../lib/prisma.js';

export const productsRouter = express.Router();

const ID_PATTERN = /^\d+$/;

const listQuerySchema = z.object({
  search: z.string().trim().optional(),
  category: z.string().optional(),
  sort: z.enum(['price-asc', 'price-desc', 'name']).default('name'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
});

const productSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  pricePence: true,
  stock: true,
  isActive: true,
  imageUrl: true,
  createdAt: true,
  updatedAt: true,
  category: { select: { id: true, name: true, slug: true } },
} as const;

productsRouter.get('/', async (req, res) => {
  const query = listQuerySchema.parse(req.query);

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(query.search ? { name: { contains: query.search } } : {}),
    // Note: SQLite's LIKE (used by Prisma's `contains`) is only case-insensitive for ASCII
    // characters, and Prisma's `mode: 'insensitive'` option is not supported on SQLite.
  };

  if (query.category) {
    where.category = ID_PATTERN.test(query.category)
      ? { id: Number(query.category) }
      : { slug: query.category };
  }

  const orderBy =
    query.sort === 'price-asc'
      ? [{ pricePence: 'asc' as const }, { id: 'asc' as const }]
      : query.sort === 'price-desc'
        ? [{ pricePence: 'desc' as const }, { id: 'asc' as const }]
        : [{ name: 'asc' as const }, { id: 'asc' as const }];

  const [totalItems, items] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      select: productSelect,
    }),
  ]);

  res.status(200).json({
    items,
    page: query.page,
    limit: query.limit,
    totalItems,
    totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / query.limit),
  });
});

productsRouter.get('/:idOrSlug', async (req, res) => {
  const { idOrSlug } = req.params;

  const product = await prisma.product.findFirst({
    // Inactive products are filtered out here (not checked after the query) so a missing
    // product and an inactive product are indistinguishable — both simply don't match.
    where: ID_PATTERN.test(idOrSlug)
      ? { id: Number(idOrSlug), isActive: true }
      : { slug: idOrSlug, isActive: true },
    select: productSelect,
  });

  if (!product) {
    throw new HttpError(404, 'NOT_FOUND', 'Product not found');
  }

  res.status(200).json(product);
});
