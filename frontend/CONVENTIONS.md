# Frontend Conventions

## `data-testid` naming

Format: kebab-case `{area}-{element}`, with a `-{slug}` (or other identifying) suffix
appended when the element repeats for each item in a list.

| testid                          | Element                                    |
| ------------------------------- | ------------------------------------------ |
| `header-search-input`           | Header search text input                   |
| `header-search-submit`          | Header search submit button                |
| `header-basket-link`            | Header link to `/basket`                   |
| `nav-category-link-cpus`        | Category nav link for the "cpus" category  |
| `product-card-amd-ryzen-5-7600` | Product card link for that product's slug  |
| `error-state`                   | Error message container                    |
| `home-featured-loading`         | Loading skeleton for the featured section  |
| `login-email-input`             | Login form email input                     |
| `login-password-input`          | Login form password input                  |
| `login-email-error`             | Login form email field error message       |
| `login-submit`                  | Login form submit button                   |
| `login-error`                   | Login form server-error message            |
| `login-register-link`           | Login page link to `/register`             |
| `register-name-input`           | Register form name input                   |
| `register-submit`               | Register form submit button                |
| `register-error`                | Register form server-error message         |
| `register-login-link`           | Register page link to `/login`             |
| `forbidden-page`                | 403 access-denied page container           |
| `header-logout-button`          | Header sign-out button                     |
| `header-admin-link`             | Header link to `/admin` (admin users only) |
| `catalogue-heading`             | Catalogue page heading                     |
| `catalogue-clear-search`        | Catalogue button clearing the search param |
| `catalogue-category-select`     | Catalogue category filter select           |
| `catalogue-sort-select`         | Catalogue sort select                      |
| `catalogue-result-count`        | Catalogue result count text                |
| `catalogue-grid`                | Catalogue product grid                     |
| `catalogue-loading`             | Catalogue loading skeleton                 |
| `catalogue-empty`               | Catalogue empty-results state              |
| `catalogue-clear-filters`       | Catalogue button clearing all filters      |
| `catalogue-prev`                | Catalogue pagination previous button       |
| `catalogue-page-info`           | Catalogue pagination page indicator        |
| `catalogue-next`                | Catalogue pagination next button           |
| `product-detail`                | Product detail page container              |
| `product-detail-loading`        | Product detail loading skeleton            |
| `product-detail-category-link`  | Product detail link to its category        |
| `product-detail-name`           | Product detail name heading                |
| `product-detail-price`          | Product detail price                       |
| `product-detail-stock`          | Product detail stock status                |
| `product-detail-description`    | Product detail description                 |
| `product-detail-qty-input`      | Product detail quantity input              |
| `product-detail-add-button`     | Product detail add-to-basket button        |
| `product-detail-add-success`    | Product detail add-to-basket success message |
| `product-detail-add-error`      | Product detail add-to-basket error message |
| `basket-page`                   | Basket page container (non-empty basket)   |
| `basket-loading`                | Basket loading skeleton                    |
| `basket-empty`                  | Basket empty-state container               |
| `basket-empty-browse-link`      | Basket empty-state link to `/products`     |
| `basket-item-{slug}`            | Basket item row for that product's slug    |
| `basket-item-name-{slug}`       | Basket item link to `/products/{slug}`     |
| `basket-item-decrease-{slug}`   | Basket item quantity decrease button       |
| `basket-item-qty-{slug}`        | Basket item quantity display               |
| `basket-item-increase-{slug}`   | Basket item quantity increase button       |
| `basket-item-line-total-{slug}` | Basket item line total                     |
| `basket-item-remove-{slug}`     | Basket item remove button                  |
| `basket-item-error-{slug}`      | Basket item update-error message           |
| `basket-item-unavailable-{slug}`| Basket item unavailable/out-of-stock badge |
| `basket-total`                  | Basket page total                          |
| `basket-checkout-link`          | Basket page link to `/checkout`            |
| `checkout-page`                 | Checkout page container                    |
| `checkout-loading`              | Checkout loading skeleton                  |
| `checkout-summary`              | Checkout order summary container           |
| `checkout-total`                | Checkout order summary total               |
| `checkout-name-input`           | Checkout shipping name input               |
| `checkout-name-error`           | Checkout shipping name field error         |
| `checkout-line1-input`          | Checkout address line 1 input              |
| `checkout-line1-error`          | Checkout address line 1 field error        |
| `checkout-line2-input`          | Checkout address line 2 input              |
| `checkout-line2-error`          | Checkout address line 2 field error        |
| `checkout-city-input`           | Checkout city input                        |
| `checkout-city-error`           | Checkout city field error                  |
| `checkout-postcode-input`       | Checkout postcode input                    |
| `checkout-postcode-error`       | Checkout postcode field error              |
| `checkout-mock-payment`         | Checkout mock-payment notice box           |
| `checkout-submit`               | Checkout place-order button                |
| `checkout-stock-conflict`       | Checkout stock-conflict error box          |
| `checkout-back-to-basket-link`  | Checkout stock-conflict link to `/basket`  |
| `checkout-error`                | Checkout generic server-error message      |
| `confirmation-page`             | Order confirmation page container          |
| `confirmation-order-number`     | Order confirmation order number            |
| `confirmation-total`            | Order confirmation total                   |
| `confirmation-continue-link`    | Order confirmation link to `/products`     |

Rules:

- Every interactive element (link, button, input) gets a `data-testid`.
- Every state container — loading, error, and empty states — gets a `data-testid` too, so
  Playwright can assert on which state is showing.
- These testids are a load-bearing API for the Playwright suite (see `e2e/`). Never rename
  or remove one casually — treat it like a public interface.

## Folder conventions

- `src/pages/` — route-level components (rendered directly by the router).
- `src/components/` — shared components used across pages.
- `src/api/` — the API client (`client.ts`), typed shapes (`types.ts`), and React Query
  hooks (`queries.ts`).
- `src/lib/` — small, pure, framework-agnostic helper functions.
