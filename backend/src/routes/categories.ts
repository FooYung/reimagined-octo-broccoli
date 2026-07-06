import express from 'express';
import { prisma } from '../lib/prisma.js';

export const categoriesRouter = express.Router();

categoriesRouter.get('/', async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      // Nav shows storefront-visible counts, so only active products are counted.
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });

  res.status(200).json(
    categories.map(({ _count, ...category }) => ({
      ...category,
      productCount: _count.products,
    })),
  );
});
