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

## Auth

Authentication uses a JWT stored in an httpOnly cookie named `token`.

| Method | Path                 | Auth required       | Description                                  |
| ------ | -------------------- | ------------------- | -------------------------------------------- |
| POST   | `/api/auth/register` | none                | Create a CUSTOMER account and log in         |
| POST   | `/api/auth/login`    | none                | Log in with email + password                 |
| POST   | `/api/auth/logout`   | none                | Clear the auth cookie                        |
| GET    | `/api/auth/me`       | cookie              | Return the current user                      |
| GET    | `/api/admin/ping`    | cookie + ADMIN role | Placeholder to verify the 401/403 admin gate |

### Why a cookie, not a bearer token

The JWT is set as an httpOnly cookie rather than returned in the response body for the frontend
to store and send as a bearer token:

- **XSS-safe** — client-side JS can't read an httpOnly cookie, so a script-injection
  vulnerability can't exfiltrate the session token the way it could from `localStorage`.
- **No CORS needed** — the frontend talks to the backend through the Vite dev proxy, so requests
  are same-origin and the cookie is sent automatically.
- **Cookie-jar-friendly for e2e tests** — Playwright (and any standard HTTP client) persists
  cookies across requests without any extra token-handling code in the tests.

`secure: false` on the cookie is a **dev-only** choice — it allows the cookie over plain HTTP on
localhost. In production this must be `secure: true` and served over HTTPS, or browsers won't
send the cookie at all (and it would be sent over an unencrypted connection otherwise).

### Error shape

All errors use a consistent JSON shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [{ "field": "password", "message": "Password must be at least 8 characters" }]
  }
}
```

`details` is only present for validation errors; other errors omit it.

### Password rules

Registration passwords must be at least 8 characters and contain at least one uppercase letter,
one lowercase letter, and one digit (e.g. `Admin123!`). Login only requires a non-empty
password — complexity is only enforced at registration time.
