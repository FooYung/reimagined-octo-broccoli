# Backend

Express 5 + TypeScript API, using Prisma with SQLite for storage.

## Database

```bash
# Apply migrations (creates backend/dev.db)
npx prisma migrate dev

# Seed the database (idempotent — safe to re-run)
npm run seed -w backend

# Reset: drops the DB, re-applies all migrations, then re-seeds
# (Prisma 7's `migrate reset` no longer auto-seeds, so the script chains `db seed`)
npm run db:reset -w backend
```

The seed script (`prisma/seed.ts` + `prisma/seed-data.ts`) first deletes all rows and resets
SQLite's autoincrement counters, then inserts fixed data (including fixed timestamps), so
re-running it always produces byte-identical rows — same IDs, same content, same dates.

### Demo accounts

| Email                  | Password     | Role     |
| ---------------------- | ------------ | -------- |
| admin@bytecore.test    | Admin123!    | ADMIN    |
| customer@bytecore.test | Customer123! | CUSTOMER |

Passwords are hashed with bcryptjs; the seed data stores precomputed hashes (not the plaintext)
so re-seeding never needs to re-hash anything.

## Design notes

- **Basket is server-side.** `Basket`/`BasketItem` models store one basket per user in the
  database, rather than in a client-side cookie/localStorage. This keeps the basket consistent
  across devices/sessions and lets stock/price be validated server-side before checkout.
- **Money is stored as integer pence** (`pricePence`, `unitPricePence`, `totalPence`) to avoid
  floating-point rounding issues with currency.
- **No Prisma enums.** SQLite doesn't support native enum types, so `User.role` and
  `Order.status` are plain `String` columns. The allowed values are enforced at the application
  level via `src/domain/constants.ts` (`USER_ROLES`, `ORDER_STATUSES`).
