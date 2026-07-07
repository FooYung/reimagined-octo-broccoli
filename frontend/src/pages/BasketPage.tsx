import { Link } from 'react-router';
import { useBasket, useRemoveBasketItem, useUpdateBasketItem } from '../api/basket.ts';
import { ApiError } from '../api/client.ts';
import { formatPrice } from '../lib/format.ts';
import ProductImage from '../components/ProductImage.tsx';
import ErrorState from '../components/ErrorState.tsx';
import type { BasketItem } from '../api/types.ts';

interface BasketItemRowProps {
  item: BasketItem;
  updateItem: ReturnType<typeof useUpdateBasketItem>;
  removeItem: ReturnType<typeof useRemoveBasketItem>;
}

function BasketItemRow({ item, updateItem, removeItem }: BasketItemRowProps) {
  const { productId, slug } = item;
  const isUpdatingThis = updateItem.isPending && updateItem.variables?.productId === productId;
  const isRemovingThis = removeItem.isPending && removeItem.variables === productId;
  const isPending = isUpdatingThis || isRemovingThis;
  const unavailable = item.stock === 0 || !item.isActive;

  const itemError =
    updateItem.isError &&
    updateItem.variables?.productId === productId &&
    updateItem.error instanceof ApiError
      ? updateItem.error.message
      : null;

  return (
    <div
      data-testid={`basket-item-${slug}`}
      className="flex items-center gap-4 rounded-lg border border-slate-200 p-4"
    >
      <div className="w-16 shrink-0">
        <ProductImage name={item.name} />
      </div>

      <div className="flex-1">
        <Link
          to={`/products/${slug}`}
          data-testid={`basket-item-name-${slug}`}
          className="font-medium text-slate-800 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          {item.name}
        </Link>
        <p className="text-sm text-slate-500">{formatPrice(item.pricePence)} each</p>

        {unavailable && (
          <p
            data-testid={`basket-item-unavailable-${slug}`}
            className="mt-1 text-sm font-medium text-red-700"
          >
            {!item.isActive ? 'Unavailable' : 'Out of stock'}
          </p>
        )}

        {itemError && (
          <p data-testid={`basket-item-error-${slug}`} className="mt-1 text-sm text-red-600">
            {itemError}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => updateItem.mutate({ productId, quantity: item.quantity - 1 })}
          disabled={item.quantity <= 1 || isPending}
          data-testid={`basket-item-decrease-${slug}`}
          className="rounded border border-slate-300 px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          −
        </button>
        <span data-testid={`basket-item-qty-${slug}`} className="w-6 text-center text-sm">
          {item.quantity}
        </span>
        <button
          type="button"
          onClick={() => updateItem.mutate({ productId, quantity: item.quantity + 1 })}
          disabled={item.quantity >= item.stock || isPending}
          data-testid={`basket-item-increase-${slug}`}
          className="rounded border border-slate-300 px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          +
        </button>
      </div>

      <p
        data-testid={`basket-item-line-total-${slug}`}
        className="w-20 text-right font-medium text-slate-900"
      >
        {formatPrice(item.lineTotalPence)}
      </p>

      <button
        type="button"
        onClick={() => removeItem.mutate(productId)}
        disabled={isPending}
        data-testid={`basket-item-remove-${slug}`}
        className="text-sm font-medium text-red-600 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Remove
      </button>
    </div>
  );
}

function BasketPage() {
  const { data: basket, isLoading, isError, refetch } = useBasket();
  const updateItem = useUpdateBasketItem();
  const removeItem = useRemoveBasketItem();

  if (isLoading) {
    return (
      <div data-testid="basket-loading" className="mx-auto max-w-4xl space-y-4 px-4 py-8">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-lg bg-slate-200" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState message="Couldn't load your basket." onRetry={() => void refetch()} />;
  }

  if (!basket) {
    return null;
  }

  if (basket.items.length === 0) {
    return (
      <div
        data-testid="basket-empty"
        className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-4 py-16 text-center"
      >
        <p className="font-medium text-slate-700">Your basket is empty</p>
        <Link
          to="/products"
          data-testid="basket-empty-browse-link"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          Browse the catalogue
        </Link>
      </div>
    );
  }

  return (
    <div data-testid="basket-page" className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-800">Your basket</h1>

      <div className="mt-6 space-y-4">
        {basket.items.map((item) => (
          <BasketItemRow
            key={item.productId}
            item={item}
            updateItem={updateItem}
            removeItem={removeItem}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-6">
        <p data-testid="basket-total" className="text-lg font-semibold text-slate-900">
          Total: {formatPrice(basket.totalPence)}
        </p>
        <Link
          to="/checkout"
          data-testid="basket-checkout-link"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}

export default BasketPage;
