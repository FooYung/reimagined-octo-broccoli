# Frontend Conventions

## `data-testid` naming

Format: kebab-case `{area}-{element}`, with a `-{slug}` (or other identifying) suffix
appended when the element repeats for each item in a list.

| testid                          | Element                                   |
| ------------------------------- | ----------------------------------------- |
| `header-search-input`           | Header search text input                  |
| `header-search-submit`          | Header search submit button               |
| `header-basket-link`            | Header link to `/basket`                  |
| `nav-category-link-cpus`        | Category nav link for the "cpus" category |
| `product-card-amd-ryzen-5-7600` | Product card link for that product's slug |
| `error-state`                   | Error message container                   |
| `home-featured-loading`         | Loading skeleton for the featured section |

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
