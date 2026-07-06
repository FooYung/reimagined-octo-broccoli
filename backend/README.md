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

## Catalogue

| Method | Path                      | Auth required | Description                                        |
| ------ | ------------------------- | ------------- | -------------------------------------------------- |
| GET    | `/api/products`           | none          | List active products (search/filter/sort/paginate) |
| GET    | `/api/products/:idOrSlug` | none          | Fetch a single active product by id or slug        |
| GET    | `/api/categories`         | none          | List all categories with active product counts     |

`GET /api/products` query params (all optional):

| Param      | Type                                  | Default | Notes                                                                         |
| ---------- | ------------------------------------- | ------- | ----------------------------------------------------------------------------- |
| `search`   | string                                | —       | Matches product name via a `contains` filter                                  |
| `category` | string                                | —       | Numeric string (`/^\d+$/`) filters by category id, otherwise by category slug |
| `sort`     | `price-asc` \| `price-desc` \| `name` | `name`  | Secondary `id: 'asc'` sort keeps ordering deterministic                       |
| `page`     | integer ≥ 1                           | `1`     |                                                                               |
| `limit`    | integer 1–100                         | `12`    |                                                                               |

Response shape: `{ items, page, limit, totalItems, totalPages }`, where each item includes a nested
`category: { id, name, slug }`.

- An unknown `category` (id or slug with no matching row) returns a normal `200` with an empty
  `items` array and `totalItems: 0`, not a 404 — it's treated as "no products match this filter"
  rather than an invalid request.
- `GET /api/products/:idOrSlug` returns `404 NOT_FOUND` with the same body whether the product
  doesn't exist at all or exists but is inactive — the two cases are indistinguishable to callers.
- `GET /api/categories` counts are active-product-only (`productCount`), since this reflects what
  the storefront nav should actually show shoppers.
- `search` case-insensitivity relies on SQLite's `LIKE`, which is only case-insensitive for ASCII
  characters; Prisma's `mode: 'insensitive'` option is not supported on SQLite.

## Basket, checkout & orders

| Method | Path                           | Auth required | Description                                    |
| ------ | ------------------------------ | ------------- | ---------------------------------------------- |
| GET    | `/api/basket`                  | cookie        | Get the current user's basket                  |
| POST   | `/api/basket/items`            | cookie        | Add a product to the basket (upsert-increment) |
| PATCH  | `/api/basket/items/:productId` | cookie        | Set an item's quantity                         |
| DELETE | `/api/basket/items/:productId` | cookie        | Remove a single item                           |
| DELETE | `/api/basket`                  | cookie        | Clear the whole basket                         |
| POST   | `/api/checkout`                | cookie        | Place an order from the current basket         |
| GET    | `/api/orders`                  | cookie        | List the current user's orders, newest first   |
| GET    | `/api/orders/:id`              | cookie        | Fetch a single order owned by the current user |

### Basket shape

```json
{
  "items": [
    {
      "productId": 5,
      "name": "AMD Ryzen 5 7600",
      "slug": "amd-ryzen-5-7600",
      "pricePence": 17999,
      "stock": 40,
      "isActive": true,
      "imageUrl": "/images/products/amd-ryzen-5-7600.jpg",
      "quantity": 2,
      "lineTotalPence": 35998
    }
  ],
  "totalPence": 35998
}
```

- `pricePence`/`stock`/`isActive` reflect the product's **current** values — the basket always
  shows live data, and checkout re-validates against the same current values at the point of
  purchase.
- Items are ordered by the underlying `BasketItem.id` ascending (insertion order).
- A user with no `Basket` row yet gets `{ items: [], totalPence: 0 }` without one being created;
  the row is only created lazily on the first `POST /api/basket/items`.
- Every basket mutation (`POST`/`PATCH`/`DELETE`) responds `200` with the full updated basket
  shape, the same as `GET /api/basket`.
- Adding or updating an item requires the product to exist **and** be active — an unknown id and
  an inactive product both return the same `404 NOT_FOUND` (as in the catalogue), and the
  resulting quantity must not exceed the product's current stock (`400 INSUFFICIENT_STOCK`,
  message includes the available stock). A stock-0 product can therefore never be added.
- `PATCH`/`DELETE` on a product not already in the basket return `404 NOT_FOUND` ("Item not in
  basket"), distinct from the "Product not found" case above.

### Checkout flow

`POST /api/checkout` takes **shipping address fields only** — there are no payment fields.
Payment is mocked as always-successful (no real payment integration in this project).

The whole flow runs inside one interactive `prisma.$transaction`:

1. Load the user's basket + items + products. An empty or missing basket → `400 EMPTY_BASKET`.
2. Re-validate every item against current data: an inactive product fails with reason
   `unavailable`; a quantity exceeding current stock fails with reason
   `insufficient stock (N available)`. Any failures → `400 STOCK_CONFLICT` with a `details` array
   listing every failing item (`{ productId, slug, name, reason }`).
3. Decrement stock per item with a conditional `updateMany` (`stock: { gte: quantity }`). If the
   row count isn't exactly 1, another checkout raced ahead of this one between steps 1–2 and this
   step — the same `400 STOCK_CONFLICT` shape is thrown as a belt-and-braces guard against that
   race, this time reflecting the just-read current stock.
4. Create the `Order` (status `PENDING`) with `totalPence` computed from **current** product
   prices, snapshotting `productName` + `unitPricePence` onto each `OrderItem` so historical
   orders are unaffected by later price changes. The order is created with a placeholder
   `orderNumber`, then updated to `ORD-${1000 + order.id}` once the id is known (the seeded
   `ORD-1001` = id `1` fits this numbering scheme).
5. Delete the basket's items (the `Basket` row itself is kept).
6. Return `201` with the same order shape used by `GET /api/orders`.

### Order shape

```json
{
  "id": 2,
  "orderNumber": "ORD-1002",
  "status": "PENDING",
  "totalPence": 17999,
  "createdAt": "2026-07-06T20:47:07.239Z",
  "shippingName": "Sam Customer",
  "shippingLine1": "123 Test St",
  "shippingLine2": null,
  "shippingCity": "Testville",
  "shippingPostcode": "TE5 7ST",
  "items": [
    {
      "productId": 5,
      "productName": "AMD Ryzen 5 7600",
      "unitPricePence": 17999,
      "quantity": 1,
      "lineTotalPence": 17999
    }
  ]
}
```

- `GET /api/orders` returns the current user's orders ordered by `createdAt` desc, then `id` desc.
- `GET /api/orders/:id` requires a numeric id; a non-numeric id is treated as not found rather than
  a separate validation error, since it could never match a real order.
- An order that doesn't exist, or belongs to a different user, always returns `404 NOT_FOUND`
  ("Order not found") — **never** `403` — so a request can't be used to probe whether an order id
  belongs to someone else.

### Error codes introduced in this section

| Code                 | Status | Meaning                                                                               |
| -------------------- | ------ | ------------------------------------------------------------------------------------- |
| `INSUFFICIENT_STOCK` | 400    | Requested basket quantity exceeds current product stock                               |
| `EMPTY_BASKET`       | 400    | Checkout attempted with no basket or zero items                                       |
| `STOCK_CONFLICT`     | 400    | One or more basket items are unavailable/understocked at checkout; includes `details` |
| `NOT_FOUND`          | 404    | Product/basket item/order not found (see semantics above)                             |
