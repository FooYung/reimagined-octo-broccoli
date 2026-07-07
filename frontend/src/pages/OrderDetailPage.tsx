import { Link, useParams } from 'react-router';
import { useOrder } from '../api/orders.ts';
import { ApiError } from '../api/client.ts';
import { formatDate, formatPrice } from '../lib/format.ts';
import ErrorState from '../components/ErrorState.tsx';
import NotFoundPage from './NotFoundPage.tsx';

function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, isError, error, refetch } = useOrder(id ?? '');

  if (isLoading) {
    return (
      <div data-testid="order-detail-loading" className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <div className="h-8 w-1/2 animate-pulse rounded bg-slate-200" />
        <div className="h-32 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-24 animate-pulse rounded-lg bg-slate-200" />
      </div>
    );
  }

  if (isError) {
    if (error instanceof ApiError && error.status === 404) {
      return <NotFoundPage />;
    }
    return <ErrorState message="Couldn't load this order." onRetry={() => void refetch()} />;
  }

  if (!order) {
    return null;
  }

  return (
    <div data-testid="order-detail-page" className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-800">
        Order <span data-testid="order-detail-order-number">{order.orderNumber}</span>
      </h1>
      <p className="mt-2 text-slate-600">
        Placed on <span data-testid="order-detail-date">{formatDate(order.createdAt)}</span> —
        status: <span data-testid="order-detail-status">{order.status}</span>
      </p>

      <div className="mt-6 space-y-2 rounded-lg border border-slate-200 p-4">
        {order.items.map((item) => (
          <div
            key={item.productId}
            data-testid={`order-detail-item-${item.productId}`}
            className="flex justify-between text-sm"
          >
            <span>
              {item.productName} × {item.quantity} ({formatPrice(item.unitPricePence)} each)
            </span>
            <span>{formatPrice(item.lineTotalPence)}</span>
          </div>
        ))}
        <div
          data-testid="order-detail-total"
          className="flex justify-between border-t border-slate-200 pt-2 font-semibold text-slate-900"
        >
          <span>Total</span>
          <span>{formatPrice(order.totalPence)}</span>
        </div>
      </div>

      <div
        data-testid="order-detail-address"
        className="mt-6 rounded-lg border border-slate-200 p-4"
      >
        <h2 className="font-medium text-slate-800">Shipping address</h2>
        <p className="mt-1 text-sm text-slate-600">
          {order.shippingName}
          <br />
          {order.shippingLine1}
          <br />
          {order.shippingLine2 && (
            <>
              {order.shippingLine2}
              <br />
            </>
          )}
          {order.shippingCity}
          <br />
          {order.shippingPostcode}
        </p>
      </div>

      <Link
        to="/account"
        data-testid="order-detail-back-link"
        className="mt-6 inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        Back to account
      </Link>
    </div>
  );
}

export default OrderDetailPage;
