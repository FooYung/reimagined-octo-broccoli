import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate, useNavigate } from 'react-router';
import { useBasket, useCheckout } from '../api/basket.ts';
import { ApiError } from '../api/client.ts';
import type { CheckoutFailureDetail } from '../api/types.ts';
import { checkoutSchema, type CheckoutFormValues } from '../lib/validation.ts';
import { formatPrice } from '../lib/format.ts';
import ErrorState from '../components/ErrorState.tsx';

function CheckoutPage() {
  const { data: basket, isLoading, isError, refetch } = useBasket();
  const checkout = useCheckout();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({ resolver: zodResolver(checkoutSchema) });

  if (isLoading) {
    return (
      <div data-testid="checkout-loading" className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <div className="h-32 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-64 animate-pulse rounded-lg bg-slate-200" />
      </div>
    );
  }

  if (isError) {
    return <ErrorState message="Couldn't load your basket." onRetry={() => void refetch()} />;
  }

  if (!basket) {
    return null;
  }

  // checkout.isSuccess is excluded here because a successful checkout empties the basket
  // cache (via useCheckout's onSuccess) a tick before this page navigates away — without
  // the exclusion that would flash a redirect to /basket instead.
  if (basket.items.length === 0 && !checkout.isSuccess) {
    return <Navigate to="/basket" replace />;
  }

  function onSubmit(values: CheckoutFormValues) {
    checkout.mutate(values, {
      onSuccess: (order) => navigate('/checkout/confirmation', { state: { order } }),
    });
  }

  const stockConflict =
    checkout.isError && checkout.error instanceof ApiError && checkout.error.code === 'STOCK_CONFLICT'
      ? ((checkout.error.details ?? []) as unknown as CheckoutFailureDetail[])
      : null;

  const genericError =
    checkout.isError && checkout.error instanceof ApiError && checkout.error.code !== 'STOCK_CONFLICT'
      ? checkout.error.message
      : null;

  return (
    <div data-testid="checkout-page" className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-800">Checkout</h1>

      <div
        data-testid="checkout-summary"
        className="mt-6 space-y-2 rounded-lg border border-slate-200 p-4"
      >
        {basket.items.map((item) => (
          <div key={item.productId} className="flex justify-between text-sm">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{formatPrice(item.lineTotalPence)}</span>
          </div>
        ))}
        <div
          data-testid="checkout-total"
          className="flex justify-between border-t border-slate-200 pt-2 font-semibold text-slate-900"
        >
          <span>Total</span>
          <span>{formatPrice(basket.totalPence)}</span>
        </div>
      </div>

      {stockConflict && (
        <div
          data-testid="checkout-stock-conflict"
          className="mt-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <p className="font-medium">Some items in your basket are no longer available:</p>
          <ul className="mt-2 list-disc pl-5">
            {stockConflict.map((detail) => (
              <li key={detail.productId}>
                {detail.name}: {detail.reason}
              </li>
            ))}
          </ul>
          <Link
            to="/basket"
            data-testid="checkout-back-to-basket-link"
            className="mt-2 inline-block font-medium text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Back to basket
          </Link>
        </div>
      )}

      {genericError && (
        <div
          data-testid="checkout-error"
          className="mt-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {genericError}
        </div>
      )}

      <form
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
        noValidate
        className="mt-6 space-y-4"
      >
        <div>
          <label htmlFor="checkout-name" className="block text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            id="checkout-name"
            type="text"
            data-testid="checkout-name-input"
            aria-invalid={errors.shippingName ? 'true' : 'false'}
            aria-describedby={errors.shippingName ? 'checkout-name-error' : undefined}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            {...register('shippingName')}
          />
          {errors.shippingName && (
            <p
              id="checkout-name-error"
              data-testid="checkout-name-error"
              className="mt-1 text-sm text-red-600"
            >
              {errors.shippingName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="checkout-line1" className="block text-sm font-medium text-slate-700">
            Address line 1
          </label>
          <input
            id="checkout-line1"
            type="text"
            data-testid="checkout-line1-input"
            aria-invalid={errors.shippingLine1 ? 'true' : 'false'}
            aria-describedby={errors.shippingLine1 ? 'checkout-line1-error' : undefined}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            {...register('shippingLine1')}
          />
          {errors.shippingLine1 && (
            <p
              id="checkout-line1-error"
              data-testid="checkout-line1-error"
              className="mt-1 text-sm text-red-600"
            >
              {errors.shippingLine1.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="checkout-line2" className="block text-sm font-medium text-slate-700">
            Address line 2 (optional)
          </label>
          <input
            id="checkout-line2"
            type="text"
            data-testid="checkout-line2-input"
            aria-invalid={errors.shippingLine2 ? 'true' : 'false'}
            aria-describedby={errors.shippingLine2 ? 'checkout-line2-error' : undefined}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            {...register('shippingLine2')}
          />
          {errors.shippingLine2 && (
            <p
              id="checkout-line2-error"
              data-testid="checkout-line2-error"
              className="mt-1 text-sm text-red-600"
            >
              {errors.shippingLine2.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="checkout-city" className="block text-sm font-medium text-slate-700">
              City
            </label>
            <input
              id="checkout-city"
              type="text"
              data-testid="checkout-city-input"
              aria-invalid={errors.shippingCity ? 'true' : 'false'}
              aria-describedby={errors.shippingCity ? 'checkout-city-error' : undefined}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              {...register('shippingCity')}
            />
            {errors.shippingCity && (
              <p
                id="checkout-city-error"
                data-testid="checkout-city-error"
                className="mt-1 text-sm text-red-600"
              >
                {errors.shippingCity.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="checkout-postcode" className="block text-sm font-medium text-slate-700">
              Postcode
            </label>
            <input
              id="checkout-postcode"
              type="text"
              data-testid="checkout-postcode-input"
              aria-invalid={errors.shippingPostcode ? 'true' : 'false'}
              aria-describedby={errors.shippingPostcode ? 'checkout-postcode-error' : undefined}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              {...register('shippingPostcode')}
            />
            {errors.shippingPostcode && (
              <p
                id="checkout-postcode-error"
                data-testid="checkout-postcode-error"
                className="mt-1 text-sm text-red-600"
              >
                {errors.shippingPostcode.message}
              </p>
            )}
          </div>
        </div>

        <div
          data-testid="checkout-mock-payment"
          className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600"
        >
          This is a demo store. No real payment is taken and no card details are collected.
        </div>

        <button
          type="submit"
          data-testid="checkout-submit"
          disabled={checkout.isPending}
          className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {checkout.isPending ? 'Placing order…' : 'Place order'}
        </button>
      </form>
    </div>
  );
}

export default CheckoutPage;
