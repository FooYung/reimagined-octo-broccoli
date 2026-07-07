# Error Handling & Edge-Case Audit (Phase 13)

Audit of all failure behaviour required by the spec, exercised on 2026-07-07 against the
seeded dev database. API checks were run with curl against the live backend; frontend
behaviour was verified by code inspection of the shared components and every page's
loading/error/empty states. Each scenario below is test input for Phases 15–16.

## Fixes made during this audit

| Gap found | Fix |
| --- | --- |
| Malformed JSON request body returned `500 INTERNAL_ERROR` (and was logged as a server fault) | `backend/src/middleware/error-handler.ts` now returns `400 INVALID_JSON` for body-parser `SyntaxError`s |
| A network-level fetch failure (backend unreachable) bypassed every mutation's `instanceof ApiError` error display — form submissions failed silently | `frontend/src/api/client.ts` now converts fetch rejections into `ApiError(0, 'NETWORK_ERROR', …)` so all existing error displays show a friendly retry message |

## Checklist

### Validation failures

- [x] API: invalid register body → `400 VALIDATION_ERROR` with per-field `details`
      (email format, each password rule, empty name all reported individually).
- [x] API: invalid query params (`/api/products?page=0`) → `400` with field detail.
- [x] API: malformed JSON body → `400 INVALID_JSON` (fixed in this audit; was 500).
- [x] UI: every form (login, register, checkout address, admin product, admin category)
      uses React Hook Form + Zod mirroring backend rules, with per-field
      `data-testid="…-error"` messages; server rejections (duplicate email, slug in use,
      field details) render inline, never as raw API text. Backend remains source of
      truth — client schemas are mirrors, not replacements.

### 404 handling

- [x] API: unknown route (`/api/nonsense`) → `404` standard shape (`notFoundHandler`).
- [x] API: unknown product slug, unknown order id, non-numeric order id → `404` standard shape.
- [x] API: inactive product on public endpoints → `404`, indistinguishable from missing.
- [x] UI: unknown frontend route → styled `NotFoundPage` (catch-all `*` route).
- [x] UI: product detail and order detail render `NotFoundPage` on a 404 `ApiError`.

### API failures (backend down / 5xx)

- [x] UI: every data-driven page (home, catalogue, product detail, basket, checkout,
      account, order detail, admin ×3) renders the shared `ErrorState` with a retry
      button on query failure — no blank screens, no raw errors.
- [x] UI: mutation failures (login, add-to-basket, checkout, admin forms) show inline
      error boxes; network-level failures now surface through the same path
      (fixed in this audit).
- [x] Header category nav degrades to an empty bar on failure without breaking the shell
      (documented decision in `Header.tsx`).

### Invalid login

- [x] Unknown email and wrong password return identical generic
      `401 INVALID_CREDENTIALS` ("Invalid email or password") — no user enumeration;
      a dummy bcrypt compare keeps timing consistent for unknown emails.
- [x] UI shows the friendly message inline (`login-error`), form stays usable.

### Empty basket

- [x] API: checkout with empty basket → `400 EMPTY_BASKET`.
- [x] UI: basket page shows empty state with catalogue link; checkout page redirects
      to `/basket` when the basket is empty (checkout unreachable with nothing to buy).

### Out-of-stock

- [x] Catalogue and product detail show stock badges ("Out of stock") from live data;
      seeded out-of-stock product (`wd-red-plus-6tb-nas-hdd`) remains viewable (200).
- [x] Add-to-basket for a stock-0 product → `400 INSUFFICIENT_STOCK`; UI button
      disabled at stock 0.
- [x] Quantity exceeding stock (add or update) → `400 INSUFFICIENT_STOCK` with
      available count; basket stepper caps at stock and shows the server message.
- [x] Checkout-time re-validation: stock reduced after the item was basketed →
      `400 STOCK_CONFLICT` with per-item reasons; checkout page lists the failed items
      and links back to the basket (basket/product caches refetched).

### 401 vs 403

- [x] API: unauthenticated → `401` (basket, orders, admin); authenticated customer on
      admin endpoints → `403`.
- [x] UI: logged-out access to protected routes redirects to login preserving the
      intended destination; customer hitting `/admin` gets the styled `ForbiddenPage`.

### Backend robustness

- [x] Global error handler: `HttpError` → its status/code; `ZodError` → 400 with field
      details; body-parser `SyntaxError` → 400; everything else → 500 with a fixed JSON
      body. No stack traces in any response.
- [x] Unexpected errors are logged server-side (`console.error`) before the 500 is sent.
- [x] Request logger records method, path, status, and duration for every request,
      including failures.

## Notes

- `backend/prisma/dev.db` is a stale empty artifact; the live database is
  `backend/dev.db` (`DATABASE_URL="file:./dev.db"` resolves relative to `backend/`).
  Left in place — it is untracked and harmless, but worth knowing when inspecting data.
- Order cancellation does not restock (documented simplification in `backend/README.md`).
