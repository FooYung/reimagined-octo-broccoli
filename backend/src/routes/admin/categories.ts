import express from 'express';
import { z } from 'zod';
import { HttpError } from '../../lib/http-error.js';
import { prisma } from '../../lib/prisma.js';
import { slugify } from '../../lib/slug.js';

export const adminCategoriesRouter = express.Router();

const ID_PATTERN = /^\d+$/;

function parseCategoryIdParam(param: string): number {
  if (!ID_PATTERN.test(param)) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'Invalid category id');
  }
  return Number(param);
}

const categorySchema = z.object({
  name: z.string().trim().min(1).max(100),
});

adminCategoriesRouter.get('/', async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      // Unlike the public /api/categories endpoint (active-only), admins see counts
      // across ALL products (active + inactive) so they can find categories whose
      // only stock has been deactivated.
      _count: { select: { products: true } },
    },
  });

  res.status(200).json(
    categories.map(({ _count, ...category }) => ({
      ...category,
      productCount: _count.products,
    })),
  );
});

adminCategoriesRouter.post('/', async (req, res) => {
  const { name } = categorySchema.parse(req.body);

  const slug = slugify(name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    throw new HttpError(409, 'SLUG_IN_USE', 'A category with this name already exists');
  }

  const category = await prisma.category.create({ data: { name, slug } });

  res.status(201).json({ id: category.id, name: category.name, slug: category.slug });
});

adminCategoriesRouter.patch('/:id', async (req, res) => {
  const id = parseCategoryIdParam(req.params.id);
  const { name } = categorySchema.parse(req.body);

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    throw new HttpError(404, 'NOT_FOUND', 'Category not found');
  }

  // Rename only — the slug is intentionally left unchanged, same stable-URL
  // reasoning as product renames.
  const category = await prisma.category.update({ where: { id }, data: { name } });

  res.status(200).json({ id: category.id, name: category.name, slug: category.slug });
});

adminCategoriesRouter.delete('/:id', async (req, res) => {
  const id = parseCategoryIdParam(req.params.id);

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    throw new HttpError(404, 'NOT_FOUND', 'Category not found');
  }

  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    throw new HttpError(409, 'CATEGORY_IN_USE', 'Category has products; move or delete them first');
  }

  await prisma.category.delete({ where: { id } });

  res.status(204).end();
});
