import 'dotenv/config';

import { prisma } from '../src/lib/prisma.js';
import {
  categories,
  historicalOrder,
  historicalOrderTotalPence,
  products,
  SEED_TIMESTAMP,
  users,
} from './seed-data.js';

const seedDate = new Date(SEED_TIMESTAMP);

async function main() {
  // Wipe existing data in FK-safe order (children before parents) so the
  // seed is re-runnable and always produces identical data.
  await prisma.orderItem.deleteMany();
  await prisma.basketItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.basket.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Reset autoincrement counters so IDs are identical across re-runs.
  await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name IN ('User', 'Category', 'Product', 'Basket', 'BasketItem', 'Order', 'OrderItem')`;

  const categoryIdBySlug = new Map<string, number>();
  for (const category of categories) {
    const created = await prisma.category.create({ data: category });
    categoryIdBySlug.set(created.slug, created.id);
  }

  const productIdBySlug = new Map<string, number>();
  for (const product of products) {
    const { categorySlug, ...productData } = product;
    const categoryId = categoryIdBySlug.get(categorySlug);
    if (categoryId === undefined) {
      throw new Error(`Unknown category slug in seed data: ${categorySlug}`);
    }
    const created = await prisma.product.create({
      data: { ...productData, categoryId, createdAt: seedDate, updatedAt: seedDate },
    });
    productIdBySlug.set(created.slug, created.id);
  }

  const userIdByEmail = new Map<string, number>();
  for (const user of users) {
    const created = await prisma.user.create({ data: { ...user, createdAt: seedDate } });
    userIdByEmail.set(created.email, created.id);
  }

  const customerId = userIdByEmail.get(historicalOrder.customerEmail);
  if (customerId === undefined) {
    throw new Error(`Unknown user email in seed data: ${historicalOrder.customerEmail}`);
  }

  await prisma.order.create({
    data: {
      orderNumber: historicalOrder.orderNumber,
      userId: customerId,
      status: historicalOrder.status,
      totalPence: historicalOrderTotalPence,
      shippingName: historicalOrder.shippingName,
      shippingLine1: historicalOrder.shippingLine1,
      shippingLine2: historicalOrder.shippingLine2,
      shippingCity: historicalOrder.shippingCity,
      shippingPostcode: historicalOrder.shippingPostcode,
      createdAt: new Date(historicalOrder.createdAt),
      items: {
        create: historicalOrder.items.map((item) => {
          const productId = productIdBySlug.get(item.productSlug);
          if (productId === undefined) {
            throw new Error(`Unknown product slug in seed data: ${item.productSlug}`);
          }
          return {
            productId,
            productName: item.productName,
            unitPricePence: item.unitPricePence,
            quantity: item.quantity,
          };
        }),
      },
    },
  });

  console.log(
    `Seeded ${categoryIdBySlug.size} categories, ${productIdBySlug.size} products, ${userIdByEmail.size} users, 1 order.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
