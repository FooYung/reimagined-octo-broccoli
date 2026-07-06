import { useState, type ChangeEvent } from 'react';
import { Link, useParams } from 'react-router';
import { useProduct } from '../api/queries.ts';
import { ApiError } from '../api/client.ts';
import { formatPrice } from '../lib/format.ts';
import ProductImage from '../components/ProductImage.tsx';
import ErrorState from '../components/ErrorState.tsx';
import NotFoundPage from './NotFoundPage.tsx';

function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError, error, refetch } = useProduct(slug ?? '');
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div
        data-testid="product-detail-loading"
        className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:grid-cols-2"
      >
        <div className="aspect-square animate-pulse rounded-lg bg-slate-200" />
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-8 w-2/3 animate-pulse rounded bg-slate-200" />
          <div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
          <div className="h-24 w-full animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  if (isError) {
    if (error instanceof ApiError && error.status === 404) {
      return <NotFoundPage />;
    }
    return <ErrorState message="Couldn't load this product." onRetry={() => void refetch()} />;
  }

  if (!product) {
    return null;
  }

  const inStock = product.stock > 0;
  const stock = product.stock;

  function handleQuantityChange(event: ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);
    if (Number.isNaN(value)) return;
    setQuantity(Math.min(Math.max(value, 1), stock));
  }

  return (
    <div
      data-testid="product-detail"
      className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:grid-cols-2"
    >
      <div className="mx-auto w-full max-w-md">
        <ProductImage name={product.name} />
      </div>

      <div>
        <Link
          to={`/products?category=${product.category.slug}`}
          data-testid="product-detail-category-link"
          className="text-xs font-medium uppercase tracking-wide text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          {product.category.name}
        </Link>

        <h1
          data-testid="product-detail-name"
          className="mt-2 text-2xl font-semibold text-slate-800"
        >
          {product.name}
        </h1>

        <p data-testid="product-detail-price" className="mt-2 text-xl font-semibold text-slate-900">
          {formatPrice(product.pricePence)}
        </p>

        <p
          data-testid="product-detail-stock"
          className={inStock ? 'mt-2 font-medium text-green-700' : 'mt-2 font-medium text-red-700'}
        >
          {inStock ? 'In stock' : 'Out of stock'}
          {inStock && (
            <span className="ml-2 text-sm font-normal text-slate-500">
              {product.stock} available
            </span>
          )}
        </p>

        <p data-testid="product-detail-description" className="mt-4 text-slate-600">
          {product.description}
        </p>

        <div className="mt-6 flex items-end gap-3">
          <div>
            <label
              htmlFor="product-detail-qty"
              className="block text-sm font-medium text-slate-700"
            >
              Quantity
            </label>
            <input
              id="product-detail-qty"
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={handleQuantityChange}
              disabled={!inStock}
              data-testid="product-detail-qty-input"
              className="mt-1 w-20 rounded border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <button
            type="button"
            // Phase 10 wires this up to the real basket mutation.
            onClick={() => {}}
            disabled={!inStock}
            data-testid="product-detail-add-button"
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {inStock ? 'Add to basket' : 'Out of stock'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
