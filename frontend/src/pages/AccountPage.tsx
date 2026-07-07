import { Link } from 'react-router';
import { useCurrentUser } from '../api/auth.ts';
import { useOrders } from '../api/orders.ts';
import { formatDate, formatPrice } from '../lib/format.ts';
import ErrorState from '../components/ErrorState.tsx';
import type { Order } from '../api/types.ts';

interface AccountOrderRowProps {
  order: Order;
}

function AccountOrderRow({ order }: AccountOrderRowProps) {
  const slug = order.orderNumber.toLowerCase();

  return (
    <Link
      to={`/account/orders/${order.id}`}
      data-testid={`account-order-link-${slug}`}
      className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
    >
      <div>
        <p data-testid={`account-order-number-${slug}`} className="font-medium text-slate-800">
          {order.orderNumber}
        </p>
        <p data-testid={`account-order-date-${slug}`} className="text-sm text-slate-500">
          {formatDate(order.createdAt)}
        </p>
      </div>
      <p data-testid={`account-order-status-${slug}`} className="text-sm text-slate-600">
        {order.status}
      </p>
      <p data-testid={`account-order-total-${slug}`} className="font-medium text-slate-900">
        {formatPrice(order.totalPence)}
      </p>
    </Link>
  );
}

function AccountPage() {
  const { data: user } = useCurrentUser();
  const { data: orders, isLoading, isError, refetch } = useOrders();

  if (!user) {
    return null;
  }

  return (
    <div data-testid="account-page" className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-800">Your account</h1>

      <div className="mt-6 rounded-lg border border-slate-200 p-4">
        <p data-testid="account-name" className="font-medium text-slate-800">
          {user.name}
        </p>
        <p data-testid="account-email" className="mt-1 text-sm text-slate-500">
          {user.email}
        </p>
      </div>

      <h2 className="mt-8 text-lg font-medium text-slate-800">Order history</h2>

      {isLoading && (
        <div data-testid="account-orders-loading" className="mt-4 space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
      )}

      {isError && (
        <ErrorState message="Couldn't load your orders." onRetry={() => void refetch()} />
      )}

      {!isLoading && !isError && orders && orders.length === 0 && (
        <div
          data-testid="account-orders-empty"
          className="mt-4 flex flex-col items-center gap-3 py-10 text-center"
        >
          <p className="text-slate-600">You haven't placed any orders yet</p>
          <Link
            to="/products"
            data-testid="account-orders-browse-link"
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Browse the catalogue
          </Link>
        </div>
      )}

      {!isLoading && !isError && orders && orders.length > 0 && (
        <div data-testid="account-orders" className="mt-4 space-y-3">
          {orders.map((order) => (
            <AccountOrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

export default AccountPage;
