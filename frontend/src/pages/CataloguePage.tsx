import { useSearchParams } from 'react-router';
import { useCategories, useProducts } from '../api/queries.ts';
import ProductCard from '../components/ProductCard.tsx';
import ErrorState from '../components/ErrorState.tsx';

interface ParamPatch {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
}

function CataloguePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? undefined;
  const category = searchParams.get('category') ?? undefined;
  const sort = searchParams.get('sort') ?? 'name';
  const page = Number(searchParams.get('page')) || 1;

  const { data: categories } = useCategories();
  const { data, isLoading, isError, refetch } = useProducts({ search, category, sort, page });

  // Merges patch into the current URL params, dropping any key whose new value is empty or
  // the default (so the URL stays clean), and always resetting page to 1 unless the patch
  // itself sets a page.
  function updateParams(patch: ParamPatch) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      const setOrDelete = (key: string, value: string | undefined, isDefault: boolean) => {
        if (!value || isDefault) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      };

      if ('search' in patch) setOrDelete('search', patch.search, false);
      if ('category' in patch) setOrDelete('category', patch.category, false);
      if ('sort' in patch) setOrDelete('sort', patch.sort, patch.sort === 'name');

      if ('page' in patch && patch.page !== undefined) {
        setOrDelete('page', String(patch.page), patch.page <= 1);
      } else {
        next.delete('page');
      }

      return next;
    });
  }

  const activeCategoryName = categories?.find((c) => c.slug === category)?.name;
  const heading = search
    ? `Search results for "${search}"`
    : (activeCategoryName ?? 'All components');

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 data-testid="catalogue-heading" className="text-2xl font-semibold text-slate-800">
            {heading}
          </h1>
          {search && (
            <button
              type="button"
              onClick={() => updateParams({ search: undefined })}
              data-testid="catalogue-clear-search"
              className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              Clear search
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label htmlFor="catalogue-category" className="sr-only">
              Category
            </label>
            <select
              id="catalogue-category"
              data-testid="catalogue-category-select"
              value={category ?? ''}
              onChange={(event) => updateParams({ category: event.target.value || undefined })}
              className="rounded border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <option value="">All categories</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="catalogue-sort" className="sr-only">
              Sort by
            </label>
            <select
              id="catalogue-sort"
              data-testid="catalogue-sort-select"
              value={sort}
              onChange={(event) => updateParams({ sort: event.target.value })}
              className="rounded border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <option value="name">Name</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>
        </div>
      </div>

      {data && (
        <p data-testid="catalogue-result-count" className="mt-4 text-sm text-slate-500">
          {data.totalItems} products
        </p>
      )}

      {isLoading && (
        <div
          data-testid="catalogue-loading"
          className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {Array.from({ length: 12 }, (_, index) => (
            <div key={index} className="aspect-[3/4] animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
      )}

      {isError && <ErrorState message="Couldn't load products." onRetry={() => void refetch()} />}

      {data && data.totalItems === 0 && (
        <div
          data-testid="catalogue-empty"
          className="mt-10 flex flex-col items-center gap-3 rounded-lg border border-slate-200 py-10 text-center"
        >
          <p className="font-medium text-slate-700">No products found</p>
          <p className="text-sm text-slate-500">Try adjusting your search or filters.</p>
          <button
            type="button"
            onClick={() =>
              updateParams({ search: undefined, category: undefined, sort: undefined })
            }
            data-testid="catalogue-clear-filters"
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Clear filters
          </button>
        </div>
      )}

      {data && data.totalItems > 0 && (
        <div
          data-testid="catalogue-grid"
          className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {data.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => updateParams({ page: page - 1 })}
            disabled={page <= 1}
            data-testid="catalogue-prev"
            className="rounded border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span data-testid="catalogue-page-info" className="text-sm text-slate-600">
            Page {page} of {data.totalPages}
          </span>
          <button
            type="button"
            onClick={() => updateParams({ page: page + 1 })}
            disabled={page >= data.totalPages}
            data-testid="catalogue-next"
            className="rounded border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default CataloguePage;
