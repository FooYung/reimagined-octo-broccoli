import express from 'express';
import { z } from 'zod';
import { Prisma } from '../../generated/prisma/client.js';
import { HttpError } from '../../lib/http-error.js';
import { prisma } from '../../lib/prisma.js';
import { slugify } from '../../lib/slug.js';
import { ID_PATTERN, listQuerySchema, productSelect } from '../products.js';

export const adminProductsRouter = express.Router();

function parseProductIdParam(param: string): number {
  if (!ID_PATTERN.test(param)) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'Invalid product id');
  }
  return Number(param);
}

// imageUrl/isActive have no zod `.default()` — a default baked into the schema would
// also fire on PATCH (where an omitted field must mean "leave unchanged", not "reset to
// default"), so the create-time defaults are applied manually in the POST handler below.
const productFields = {
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(2000),
  pricePence: z.number().int().positive(),
  stock: z.number().int().min(0),
  categoryId: z.number().int(),
  imageUrl: z.string().trim().min(1).max(500).optional(),
  isActive: z.boolean().optional(),
};

const createProductSchema = z.object(productFields);
const updateProductSchema = z.object(productFields).partial();

adminProductsRouter.get('/', async (req, res) => {
  const query = listQuerySchema.parse(req.query);

  const where: Prisma.ProductWhereInput = {
    // No isActive filter — admins see both active and inactive products
    // (contrast with the public catalogue in routes/products.ts).
    ...(query.search ? { name: { contains: query.search } } : {}),
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

adminProductsRouter.post('/', async (req, res) => {
  const body = createProductSchema.parse(req.body);

  const category = await prisma.category.findUnique({ where: { id: body.categoryId } });
  if (!category) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'Validation failed', [
      { field: 'categoryId', message: 'Unknown category' },
    ]);
  }

  const slug = slugify(body.name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    throw new HttpError(409, 'SLUG_IN_USE', 'A product with this name already exists');
  }

  const product = await prisma.product.create({
    data: {
      name: body.name,
      slug,
      description: body.description,
      pricePence: body.pricePence,
      stock: body.stock,
      categoryId: body.categoryId,
      imageUrl: body.imageUrl ?? `/images/products/${slug}.jpg`,
      isActive: body.isActive ?? true,
    },
    select: productSelect,
  });

  res.status(201).json(product);
});

adminProductsRouter.patch('/:id', async (req, res) => {
  const id = parseProductIdParam(req.params.id);
  const body = updateProductSchema.parse(req.body);

  if (Object.keys(body).length === 0) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'No fields to update');
  }

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new HttpError(404, 'NOT_FOUND', 'Product not found');
  }

  if (body.categoryId !== undefined) {
    const category = await prisma.category.findUnique({ where: { id: body.categoryId } });
    if (!category) {
      throw new HttpError(400, 'VALIDATION_ERROR', 'Validation failed', [
        { field: 'categoryId', message: 'Unknown category' },
      ]);
    }
  }

  // Renaming does NOT regenerate the slug — slugs must stay stable (for URLs and
  // tests) once a product exists, even if its display name changes later.
  const product = await prisma.product.update({
    where: { id },
    data: body,
    select: productSelect,
  });

  res.status(200).json(product);
});

adminProductsRouter.delete('/:id', async (req, res) => {
  const id = parseProductIdParam(req.params.id);

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new HttpError(404, 'NOT_FOUND', 'Product not found');
  }

  const orderItemCount = await prisma.orderItem.count({ where: { productId: id } });
  if (orderItemCount > 0) {
    throw new HttpError(409, 'PRODUCT_IN_USE', 'Product has been ordered; deactivate it instead');
  }

  await prisma.$transaction([
    prisma.basketItem.deleteMany({ where: { productId: id } }),
    prisma.product.delete({ where: { id } }),
  ]);

  res.status(204).end();
});
