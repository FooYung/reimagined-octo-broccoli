import { Link, Navigate, useLocation } from 'react-router';
import type { Order } from '../api/types.ts';
import { formatPrice } from '../lib/format.ts';

function OrderConfirmationPage() {
  const location = useLocation();
  const order = (location.state as { order?: Order } | null)?.order;

  if (!order) {
    return <Navigate to="/basket" replace />;
  }

  return (
    <div data-testid="confirmation-page" className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-800">Thank you for your order</h1>
      <p className="mt-2 text-slate-600">
        Order{' '}
        <span data-testid="confirmation-order-number" className="font-semibold text-slate-900">
          {order.orderNumber}
        </span>{' '}
        — status: {order.status}
      </p>

      <div className="mt-6 space-y-2 rounded-lg border border-slate-200 p-4">
        {order.items.map((item) => (
          <div key={item.productId} className="flex justify-between text-sm">
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span>{formatPrice(item.lineTotalPence)}</span>
          </div>
        ))}
        <div
          data-testid="confirmation-total"
          className="flex justify-between border-t border-slate-200 pt-2 font-semibold text-slate-900"
        >
          <span>Total</span>
          <span>{formatPrice(order.totalPence)}</span>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 p-4">
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
        to="/products"
        data-testid="confirmation-continue-link"
        className="mt-6 inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        Continue shopping
      </Link>
    </div>
  );
}

export default OrderConfirmationPage;
