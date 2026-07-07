# Work Phases — PC Hardware E-Commerce Portfolio Project

Source spec: `Claude_PC_Hardware_Ecommerce_Portfolio_Spec.md` (same directory). Read it before starting any phase.

## How to use this document

- Each phase is **self-contained**: it states what must already exist (and how to check), what to build, and how to verify it is done. No memory of previous sessions is required.
- Work phases **in order** unless the "Requires" checks for a later phase already pass.
- Before starting a phase, run its **"Requires (verify first)"** checks against the repo. If any fail, the earlier phase is incomplete — finish that first.
- On completing a phase, tick its box in the **Status Tracker** below and commit.
- The application must remain runnable at the end of every phase.

## Status Tracker

- [x] Phase 1 — Repository & Tooling Scaffold
- [x] Phase 2 — Database Schema & Seed Data
- [x] Phase 3 — Backend: Auth API
- [x] Phase 4 — Backend: Catalogue API
- [x] Phase 5 — Backend: Basket, Checkout & Orders API
- [x] Phase 6 — Backend: Admin API
- [x] Phase 7 — Frontend: App Shell & Branding
- [x] Phase 8 — Frontend: Auth Pages
- [x] Phase 9 — Frontend: Catalogue Pages
- [x] Phase 10 — Frontend: Basket & Checkout
- [x] Phase 11 — Frontend: Customer Account & Order History
- [x] Phase 12 — Frontend: Admin CMS
- [x] Phase 13 — Error Handling & Edge-Case Pass
- [ ] Phase 14 — Playwright Framework Foundation
- [ ] Phase 15 — Playwright API Tests
- [ ] Phase 16 — Playwright UI Tests
- [ ] Phase 17 — CI Pipeline (GitHub Actions)
- [ ] Phase 18 — QA Documentation
- [ ] Phase 19 — README & Final Review

---

## Phase 1 — Repository & Tooling Scaffold

**Goal:** A runnable monorepo skeleton with frontend, backend, and e2e workspaces, strict TypeScript, linting, and formatting.

**Requires (verify first):** Nothing — this is the starting phase. The directory should contain only the spec and this file (plus git metadata).

**Build:**
- Monorepo layout: `frontend/` (React + TypeScript + Vite + React Router + TanStack Query + React Hook Form + Zod + Tailwind CSS), `backend/` (Node + Express + TypeScript), `e2e/` (empty placeholder for Playwright, set up in Phase 14).
- Root `package.json` with workspaces and scripts: `dev` (runs frontend + backend concurrently), `build`, `lint`.
- Strict `tsconfig` in both apps (`strict: true`, no implicit any).
- ESLint + Prettier configured and passing.
- Backend serves a `GET /api/health` endpoint returning `{ status: "ok" }`.
- Frontend renders a placeholder homepage.
- `.gitignore`, `.env.example` for backend config (port, JWT secret, database URL).

**Done when:**
- `npm install` at root succeeds.
- `npm run dev` starts both apps; frontend loads in a browser and `GET /api/health` returns 200.
- `npm run lint` and `npm run build` pass with no errors.

---

## Phase 2 — Database Schema & Seed Data

**Goal:** Prisma + SQLite schema covering the whole domain, with deterministic seed data themed as a PC hardware retailer.

**Requires (verify first):** `backend/` exists with a working Express + TypeScript app (`npm run dev` works, `GET /api/health` returns 200).

**Build:**
- Prisma with SQLite in `backend/`.
- Models: `User` (customer/admin role), `Category`, `Product` (name, description, price, stock, active flag, category, image), `Basket`/`BasketItem` (or design basket as client-side + validated server-side — document the decision), `Order`, `OrderItem` (snapshot price at purchase), order status enum (e.g. Pending → Processing → Shipped → Delivered / Cancelled).
- Seed script (`npm run seed` or `prisma db seed`) that is **deterministic** (fixed IDs/slugs, no random data): all categories from the spec theme (CPUs, GPUs, motherboards, RAM, SSDs, HDDs, cases, PSUs, coolers, fans, monitors, keyboards, mice, headsets), ~4–8 realistic products per category with believable names and prices, at least one out-of-stock product and one inactive product, one admin user and one customer user with documented demo credentials, at least one seeded historical order for the demo customer.
- Seed data must be re-runnable (reset + reseed) so tests can rely on a known state.

**Done when:**
- `npx prisma migrate dev` and the seed command run cleanly from scratch.
- Re-running the seed produces identical data.
- Demo credentials are documented in `backend/README.md` or `.env.example` comments.

---

## Phase 3 — Backend: Auth API

**Goal:** Secure register/login/logout with role-based access control middleware.

**Requires (verify first):** Prisma schema with `User` model and seeded admin + customer users exist (`backend/prisma/schema.prisma`; run the seed and inspect the DB).

**Build:**
- `POST /api/auth/register` — Zod-validated (email format, password rules); hashes passwords (bcrypt or argon2); rejects duplicate emails.
- `POST /api/auth/login` — returns a JWT (httpOnly cookie or bearer token — choose one and document why); invalid credentials return 401 with a generic message.
- `POST /api/auth/logout` and `GET /api/auth/me`.
- Middleware: `requireAuth` and `requireAdmin` (403 for authenticated non-admins).
- Consistent JSON error shape across the API (e.g. `{ error: { code, message } }`) — establish it here; all later phases reuse it.
- Request logging middleware (method, path, status, duration).

**Done when:**
- Register → login → `me` → logout works end-to-end via curl/HTTP client.
- Invalid login returns 401; accessing an admin-protected test route as a customer returns 403; unauthenticated returns 401.
- Validation failures return 400 with field-level detail.

---

## Phase 4 — Backend: Catalogue API

**Goal:** Public product browsing endpoints: list, search, filter, sort, detail.

**Requires (verify first):** Seeded `Product` and `Category` data exists (Phase 2); the consistent error shape from Phase 3 is in place (check auth routes exist in `backend/src`).

**Build:**
- `GET /api/products` — supports `search` (name match), `category` (slug or id), `sort` (price asc/desc, name), and pagination (`page`/`limit`). Excludes inactive products.
- `GET /api/products/:idOrSlug` — 404 for missing or inactive products.
- `GET /api/categories` — list with product counts.
- Zod validation on query params; invalid params return 400.

**Done when:**
- Each query param works individually and combined (verify via HTTP client against seed data).
- Inactive products never appear in public responses.
- Unknown product returns the standard 404 error shape.

---

## Phase 5 — Backend: Basket, Checkout & Orders API

**Goal:** Basket management and checkout that creates orders with stock enforcement.

**Requires (verify first):** Auth middleware (Phase 3) and catalogue endpoints (Phase 4) exist and respond correctly.

**Build:**
- Basket endpoints (get, add item, update quantity, remove item, clear) scoped to the authenticated user — or, if basket was designed client-side in Phase 2, a server-side validation endpoint; follow whichever decision `backend/prisma/schema.prisma` reflects.
- Quantity rules: positive integers only; cannot exceed available stock; cannot add inactive or out-of-stock products.
- `POST /api/checkout` — validates the basket server-side (re-check stock and active status at checkout time), captures a shipping address (Zod-validated), decrements stock atomically (transaction), creates `Order` + `OrderItem`s with snapshot prices, clears the basket. Rejects empty basket with 400. No real payment — a mock payment step is fine but document it.
- `GET /api/orders` and `GET /api/orders/:id` for the authenticated customer (404/403 for other users' orders).

**Done when:**
- Full flow works via HTTP client: login → add to basket → checkout → order appears in order history → product stock reduced.
- Checkout with empty basket, insufficient stock, and inactive product all fail with clear 400 errors.
- Two concurrent checkouts cannot oversell stock (transaction verified).

---

## Phase 6 — Backend: Admin API

**Goal:** Admin-only endpoints for product, category, stock, price, and order management.

**Requires (verify first):** `requireAdmin` middleware exists (Phase 3); order creation works (Phase 5).

**Build (all behind `requireAdmin`):**
- Product CRUD: create, update (including price and stock), activate/deactivate, delete (or soft-delete — document choice). Validation: required fields, price > 0, stock is a non-negative integer.
- Category CRUD with protection against deleting a category that has products (or a documented cascade decision).
- `GET /api/admin/orders` — all orders, filterable by status.
- `PATCH /api/admin/orders/:id/status` — status transitions; reject invalid transitions (e.g. Delivered → Pending).
- Admin list endpoints include inactive products.

**Done when:**
- Every endpoint returns 401 unauthenticated and 403 as a customer.
- Negative stock, zero/negative price, and missing required fields are rejected with 400.
- An order status can be advanced and the change is visible on the customer's order endpoint.

---

## Phase 7 — Frontend: App Shell & Branding

**Goal:** A believable PC-hardware-retailer shell: layout, navigation, routing skeleton, API client plumbing.

**Requires (verify first):** Frontend scaffold runs (Phase 1); backend catalogue API responds (Phase 4) — needed for the category nav.

**Build:**
- Pick a store name/brand (e.g. a plausible PC parts retailer identity) and apply consistent styling — this should not look like a generic demo.
- Layout: header (logo, search box, nav, basket icon with count, account menu), category navigation driven by `GET /api/categories`, footer.
- React Router route skeleton for all pages (home, catalogue, product detail, basket, checkout, login, register, account, admin) with placeholders where pages are not yet built.
- TanStack Query set up with a typed API client (shared response types, central error handling).
- Homepage with hero/featured products from the real API.
- 404 route with a styled not-found page.
- `data-testid` attributes on all interactive shell elements (nav links, search input, basket icon, account menu) — establish the naming convention here (e.g. kebab-case `data-testid="header-search-input"`) and document it in code or a short `frontend/CONVENTIONS.md`; all later phases follow it.

**Done when:**
- App loads with real categories and featured products from the backend.
- Every route renders (placeholder or real) with the shared layout; unknown URLs show the 404 page.
- Shell elements have stable `data-testid`s per the documented convention.

---

## Phase 8 — Frontend: Auth Pages

**Goal:** Register, login, and logout wired to the auth API with proper form validation and route protection.

**Requires (verify first):** App shell with routing and API client exists (Phase 7 — check `frontend/src` for the router and query client); auth API works (Phase 3).

**Build:**
- Login and register pages using React Hook Form + Zod (mirror backend validation rules).
- Auth state management (context or query-based `me` lookup); header reflects logged-in state (account menu, logout).
- Field-level validation messages; server errors (invalid login, duplicate email) surfaced inline, not as raw API text.
- Route guards: customer-protected routes redirect to login (preserving intended destination); admin routes additionally require the admin role and show a Forbidden state for customers.
- `data-testid`s on all inputs, buttons, and error messages, following the convention documented in Phase 7.

**Done when:**
- Register → auto-login (or login) → logout works in the browser.
- Invalid credentials show a friendly error; validation errors appear per-field before submission is allowed.
- Visiting a protected route logged-out redirects to login and returns after login; a customer hitting an admin route is refused.

---

## Phase 9 — Frontend: Catalogue Pages

**Goal:** Product listing with search, category filtering, and sorting, plus product detail pages.

**Requires (verify first):** App shell and API client exist (Phase 7); catalogue API works (Phase 4).

**Build:**
- Catalogue page: product grid (image, name, price, stock indicator), category filter, sort control (price asc/desc, name), search results (wired to the header search box), pagination or load-more, URL-driven state (filters/search/sort reflected in query params so views are linkable).
- Loading, empty ("no results"), and error states.
- Product detail page: full info, price, stock status, quantity selector, add-to-basket button (disabled with an out-of-stock indicator when stock is 0). Unknown product shows the 404 page.
- `data-testid`s per convention on cards, filters, sort control, and detail-page elements.

**Done when:**
- Search, filter, and sort each work in the browser and combine correctly; the URL reflects the current view and is shareable.
- Out-of-stock products display correctly and cannot be added to the basket.
- Direct navigation to a product URL works; a bad slug shows 404.

---

## Phase 10 — Frontend: Basket & Checkout

**Goal:** Full purchase flow from basket to order confirmation.

**Requires (verify first):** Product detail with add-to-basket exists (Phase 9); basket/checkout API works (Phase 5); auth pages work (Phase 8).

**Build:**
- Basket page: line items (image, name, unit price, quantity stepper, line total, remove), basket total, empty-basket state with a link back to the catalogue, header basket count kept in sync.
- Quantity changes validated against stock with user-facing feedback.
- Checkout page (auth-required): shipping address form (React Hook Form + Zod), order summary, mock payment step, place-order action.
- Order confirmation page showing order number and summary.
- Failure handling: stock changed since adding (show what failed), API failure (retryable error state), empty-basket checkout prevented.
- `data-testid`s per convention throughout.

**Done when:**
- Browser flow: add items → adjust quantities → checkout → confirmation, and the order then appears in the account's order history (via API if Phase 11 UI not yet built).
- Attempting checkout logged-out routes through login and back.
- Emptying the basket shows the empty state; checkout is blocked.

---

## Phase 11 — Frontend: Customer Account & Order History

**Goal:** Account area where customers view their details and past orders.

**Requires (verify first):** Auth + route guards work (Phase 8); orders can be created (Phase 10 or directly via API from Phase 5); seeded historical order exists (Phase 2).

**Build:**
- Account page (auth-required): customer details, links/tabs for order history.
- Order history list: order number, date, status, total; empty state for customers with no orders.
- Order detail view: line items with snapshot prices, shipping address, status.
- Accessing another user's order (URL manipulation) shows not-found/forbidden — never leaks data.
- `data-testid`s per convention.

**Done when:**
- Demo customer sees the seeded order plus any newly placed orders with correct totals and statuses.
- A fresh customer sees the empty state.
- Manipulating an order URL to another user's order does not expose it.

---

## Phase 12 — Frontend: Admin CMS

**Goal:** Full admin panel: product/stock/price/category management and order processing.

**Requires (verify first):** Admin API works (Phase 6); admin route guards exist (Phase 8).

**Build:**
- Admin layout/section (distinct from the storefront), reachable only by admins.
- Product management: table (including inactive products, clearly marked), create/edit forms (React Hook Form + Zod mirroring backend rules: required fields, price > 0, stock ≥ 0 integer), activate/deactivate toggle, delete with confirmation.
- Inline or quick-edit for stock and price if it keeps UX simple — otherwise via the edit form.
- Category management: list, create, rename, delete (blocked when in use, with a clear message).
- Order management: order list with status filter, order detail, status update control restricted to valid transitions.
- Validation errors surfaced per-field; server rejections handled gracefully.
- `data-testid`s per convention on tables, rows, forms, and action buttons.

**Done when:**
- Admin can create a product and it appears on the storefront; deactivating removes it from the storefront but not the admin table.
- Invalid inputs (negative stock, empty name, bad price) are blocked client-side and rejected server-side.
- Advancing an order's status is reflected in the customer's order history.
- A customer account cannot reach any admin screen or endpoint.

---

## Phase 13 — Error Handling & Edge-Case Pass

**Goal:** Audit and complete all realistic failure behaviour required by the spec, across frontend and backend.

**Requires (verify first):** All storefront and admin features exist (Phases 3–12). Spot-check: purchase flow and admin product CRUD both work in the browser.

**Build (audit each; fix gaps):**
- Validation failures: consistent field-level errors on every form; backend always the source of truth.
- 404: unknown routes (frontend) and unknown resources (API) both handled with proper status codes and styled pages.
- API failures: frontend shows recoverable error states (not blank screens or raw errors) — verify by stopping the backend mid-session.
- Invalid login: generic message, no user enumeration.
- Empty basket: basket page state and checkout prevention.
- Out-of-stock: catalogue display, add-to-basket prevention, checkout-time re-validation.
- Unauthorized (401) vs Forbidden (403): correct status codes API-side; correct redirects/messaging UI-side.
- Backend: global error handler, no stack traces in responses, meaningful server-side logging for failures.

**Done when:**
- Every bullet above has been manually exercised and behaves as described.
- A short checklist of what was tested is committed (e.g. `docs/error-handling-audit.md`) — this becomes test-scenario input for Phases 15–16.

---

## Phase 14 — Playwright Framework Foundation

**Goal:** A professional Playwright architecture in `e2e/` — config, fixtures, Page Object Model, and test-data strategy — proven with a minimal smoke test.

**Requires (verify first):** The full app runs locally (`npm run dev`) with deterministic seed data (Phase 2); the purchase flow works in the browser (Phase 10).

**Build:**
- Playwright installed in `e2e/` with TypeScript; `playwright.config.ts` with projects for UI (chromium at minimum) and API testing, baseURL from env, trace/screenshot on failure, HTML reporter.
- A `webServer` config (or documented script) that starts backend + frontend and resets/reseeds the database, so tests always run against known data.
- Page Object Model: base page + page objects for the shell (header/nav) and login page as the initial pattern; all selectors via `data-testid`.
- Auth fixtures: pre-authenticated customer and admin contexts (storage state) so tests don't log in through the UI repeatedly.
- Test-data constants module mirroring the seed data (demo credentials, known product slugs/prices).
- One UI smoke test (homepage loads, navigate to a product, product renders) and one API smoke test (`GET /api/health`, `GET /api/products`) proving both layers work.
- Folder structure that scales: e.g. `e2e/tests/ui/`, `e2e/tests/api/`, `e2e/pages/`, `e2e/fixtures/`, `e2e/utils/`.

**Done when:**
- `npx playwright test` runs green from a clean checkout (after install + seed).
- The smoke tests use the POM and fixtures — no raw selectors or inline credentials in test files.
- Re-running the suite twice in a row passes both times (deterministic data confirmed).

---

## Phase 15 — Playwright API Tests

**Goal:** API test coverage for auth, catalogue, basket/checkout/orders, and admin endpoints — positive and negative.

**Requires (verify first):** Playwright foundation exists and smoke tests pass (Phase 14 — run `npx playwright test` in `e2e/`).

**Build:**
- Auth: register (valid, duplicate email, weak input), login (valid, wrong password, unknown user), `me` with/without token, role enforcement (customer hitting admin endpoint → 403, anonymous → 401).
- Catalogue: list/search/filter/sort/pagination assertions against known seed data; inactive product exclusion; 404 for unknown product; invalid query params → 400.
- Basket & checkout: add/update/remove; exceed-stock rejection; empty-basket checkout rejection; successful checkout asserts order created, prices snapshotted, and stock decremented; out-of-stock checkout re-validation.
- Admin: product CRUD lifecycle; validation rejections (negative stock, bad price, missing fields); order status transitions including invalid-transition rejection.
- Shared API client/helpers in `e2e/utils/` — no duplicated request boilerplate; tests isolated (create their own data or rely on reset seed, never on execution order).

**Done when:**
- All API tests pass repeatably (run the suite twice).
- Every endpoint group above has at least one positive and one negative test.
- No test depends on another test having run first.

---

## Phase 16 — Playwright UI Tests

**Goal:** UI automation for all major user journeys — smoke, auth, browsing, basket, checkout, account, and admin — positive and negative.

**Requires (verify first):** Playwright foundation + fixtures pass (Phase 14); the app's error states are complete (Phase 13 — check `docs/error-handling-audit.md` exists).

**Build (extend the POM as needed — every page used gets a page object):**
- Tag or organise a fast `@smoke` subset (app loads, login works, catalogue renders, add-to-basket works).
- Auth: register, login, logout, invalid login message, protected-route redirect.
- Browsing: search, category filter, sort order assertion, product detail, out-of-stock display, 404 page.
- Basket: add, update quantity, remove, totals, empty state, header count sync.
- Checkout: full purchase to confirmation; address validation errors; logged-out checkout redirect.
- Account: order history shows placed order with correct total and status; empty state.
- Admin: login as admin; create product and assert it appears on the storefront; edit price/stock; deactivate and assert removal from storefront; validation errors on the product form; order status update reflected in customer order history; customer denied admin access.
- Keep tests independent and parallel-safe (unique data per test where tests mutate state, or serialise mutating admin tests deliberately — document the choice).

**Done when:**
- Full UI suite passes locally, twice in a row, including in parallel mode.
- The `@smoke` subset runs standalone and fast (< ~2 min).
- Every scenario listed above is covered and traceable to a test file.

---

## Phase 17 — CI Pipeline (GitHub Actions)

**Goal:** CI that lints, builds, seeds, and runs the full Playwright suite on every push/PR, with useful artifacts.

**Requires (verify first):** Full Playwright suite passes locally (Phases 15–16); repo is on GitHub (or create the remote now).

**Build:**
- Workflow: install (with caching), lint, typecheck/build both apps, migrate + seed the database, start the app, run Playwright (smoke first, then full suite — fail fast on smoke).
- Upload Playwright HTML report and traces/screenshots as artifacts on failure.
- Sensible triggers: push to main + pull requests.
- Status badge in the README (badge can be added in Phase 19 if README not yet written).

**Done when:**
- The workflow passes green on GitHub from a clean run.
- A deliberately broken test produces a red run with a downloadable report artifact, then is reverted.

---

## Phase 18 — QA Documentation

**Goal:** Professional QA artefacts: risk assessment, automation coverage matrix, test strategy, and test plan.

**Requires (verify first):** Features complete (Phases 3–13) and automation complete (Phases 14–16) — the documents must describe what actually exists. Skim the `e2e/tests/` tree and the app before writing.

**Build (in `docs/` or `qa-docs/`):**
- **Risk assessment** — for each feature (auth, catalogue, basket, checkout, orders, admin CRUD, order management): business risk, user impact, likelihood, severity, priority, mitigation, automated?/manual?, and why.
- **Automation coverage matrix** — feature, scenario, automation type (UI/API), priority, risk covered, automation status; every row traceable to an actual test.
- **Test strategy** — smoke, regression, API vs UI split rationale, integration approach, test data management (seed strategy), CI strategy, reporting strategy.
- **Test plan** — scope, objectives, risks, dependencies, entry/exit criteria.
- All documents must reflect the real implementation — cross-check scenario names against real test files.

**Done when:**
- All four documents exist, are internally consistent, and every "Automated" claim maps to a real test.
- The risk assessment's high-priority risks are all covered by automation (or the gap is explicitly justified).

---

## Phase 19 — README & Final Review

**Goal:** A README that sells the project in an interview, plus a final end-to-end quality pass.

**Requires (verify first):** Everything else complete — CI green (Phase 17), QA docs exist (Phase 18).

**Build:**
- Root `README.md`: project overview and purpose, architecture (with a simple diagram), tech stack and why, folder structure, running locally (exact commands from clean clone), demo credentials, running Playwright (full + smoke), CI pipeline description + badge, test architecture (POM, fixtures, data strategy), risk-based testing approach (link to QA docs), engineering decisions worth discussing in interviews, future improvements.
- Final pass: fresh clone → follow the README literally → app runs, tests pass. Fix any drift between docs and reality.
- Code review sweep: no `any` abuse, no dead code, no leftover TODOs/console.logs, consistent naming.

**Done when:**
- A newcomer can go from `git clone` to a running app and passing test suite using only the README.
- CI is green and the badge reflects it.
- You can explain every architectural decision in the README — it's interview-ready.
