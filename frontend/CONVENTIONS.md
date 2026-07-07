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
| `account-page`                  | Account page container                    |
| `account-name`                  | Account page customer name                 |
| `account-email`                 | Account page customer email                |
| `account-orders-loading`        | Account page order history loading skeleton |
| `account-orders-empty`          | Account page order history empty state     |
| `account-orders-browse-link`    | Account page empty-state link to `/products` |
| `account-orders`                | Account page order history list container |
| `account-order-link-{slug}`     | Account page order row link to `/account/orders/{id}` (slug = lowercased order number) |
| `account-order-number-{slug}`   | Account page order row order number        |
| `account-order-date-{slug}`     | Account page order row date                |
| `account-order-status-{slug}`   | Account page order row status              |
| `account-order-total-{slug}`    | Account page order row total               |
| `order-detail-loading`          | Order detail page loading skeleton         |
| `order-detail-page`             | Order detail page container                |
| `order-detail-order-number`     | Order detail page order number heading     |
| `order-detail-date`             | Order detail page order date                |
| `order-detail-status`           | Order detail page order status              |
| `order-detail-item-{productId}` | Order detail page item row for that product |
| `order-detail-total`            | Order detail page total                    |
| `order-detail-address`          | Order detail page shipping address container |
| `order-detail-back-link`        | Order detail page link to `/account`       |
| `admin-page`                    | Admin section container                    |
| `admin-nav-products`            | Admin nav link to `/admin/products`        |
| `admin-nav-categories`          | Admin nav link to `/admin/categories`      |
| `admin-nav-orders`              | Admin nav link to `/admin/orders`          |
| `admin-products-search`         | Admin products search text input           |
| `admin-products-loading`        | Admin products loading skeleton            |
| `admin-products-new-button`     | Admin products button opening the create form |
| `admin-products-table`          | Admin products table                        |
| `admin-product-row-{slug}`      | Admin products table row for that product's slug |
| `admin-product-inactive-{slug}` | Admin products row inactive status badge    |
| `admin-product-edit-{slug}`     | Admin products row edit button              |
| `admin-product-toggle-{slug}`   | Admin products row activate/deactivate button |
| `admin-product-delete-{slug}`   | Admin products row delete button (step 1)   |
| `admin-product-delete-confirm-{slug}` | Admin products row delete confirm button (step 2) |
| `admin-product-delete-cancel-{slug}` | Admin products row delete cancel button      |
| `admin-products-error`          | Admin products page-level server-error message |
| `admin-products-prev`           | Admin products pagination previous button   |
| `admin-products-page-info`      | Admin products pagination page indicator    |
| `admin-products-next`           | Admin products pagination next button       |
| `admin-product-form`            | Admin product create/edit form panel        |
| `admin-product-name-input`      | Admin product form name input               |
| `admin-product-name-error`      | Admin product form name field error         |
| `admin-product-description-input` | Admin product form description textarea   |
| `admin-product-description-error` | Admin product form description field error |
| `admin-product-price-input`     | Admin product form price (pounds) input     |
| `admin-product-price-error`     | Admin product form price field error        |
| `admin-product-stock-input`     | Admin product form stock input              |
| `admin-product-stock-error`     | Admin product form stock field error        |
| `admin-product-category-select` | Admin product form category select          |
| `admin-product-category-error`  | Admin product form category field error     |
| `admin-product-active-checkbox` | Admin product form active checkbox          |
| `admin-product-form-submit`     | Admin product form submit button             |
| `admin-product-form-cancel`     | Admin product form cancel button             |
| `admin-product-form-error`      | Admin product form server-error message      |
| `admin-category-name-input`     | Admin categories create-form name input      |
| `admin-category-name-error`     | Admin categories create-form name field error |
| `admin-category-create-button`  | Admin categories create-form submit button   |
| `admin-categories-error`        | Admin categories page-level server-error message |
| `admin-categories-loading`      | Admin categories loading skeleton            |
| `admin-categories-table`        | Admin categories table                       |
| `admin-category-row-{slug}`     | Admin categories table row for that category's slug |
| `admin-category-count-{slug}`   | Admin categories row product count           |
| `admin-category-rename-{slug}`  | Admin categories row rename button (enters rename mode) |
| `admin-category-rename-input-{slug}` | Admin categories row rename text input   |
| `admin-category-rename-save-{slug}` | Admin categories row rename save button   |
| `admin-category-rename-cancel-{slug}` | Admin categories row rename cancel button |
| `admin-category-delete-{slug}`  | Admin categories row delete button (step 1)  |
| `admin-category-delete-confirm-{slug}` | Admin categories row delete confirm button (step 2) |
| `admin-category-delete-cancel-{slug}` | Admin categories row delete cancel button  |
| `admin-orders-status-filter`    | Admin orders status filter select            |
| `admin-orders-loading`          | Admin orders loading skeleton                |
| `admin-orders-empty`            | Admin orders empty-results state             |
| `admin-orders-list`             | Admin orders list container                  |
| `admin-order-row-{slug}`        | Admin orders row for that order's slug       |
| `admin-order-expand-{slug}`     | Admin orders row expand/collapse button      |
| `admin-order-customer-{slug}`   | Admin orders row customer email              |
| `admin-order-status-{slug}`     | Admin orders row status                      |
| `admin-order-detail-{slug}`     | Admin orders row expanded detail container   |
| `admin-order-set-{status}-{slug}` | Admin orders row status-transition button (one per allowed status) |
| `admin-order-error-{slug}`      | Admin orders row status-update error message |

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
