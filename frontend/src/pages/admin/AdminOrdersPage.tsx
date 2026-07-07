import { useState } from 'react';
import { useAdminOrders, useUpdateOrderStatus } from '../../api/admin.ts';
import { ApiError } from '../../api/client.ts';
import { formatDate, formatPrice } from '../../lib/format.ts';
import { ALLOWED_TRANSITIONS } from '../../lib/order-status.ts';
import ErrorState from '../../components/ErrorState.tsx';
import type { AdminOrder, OrderStatus } from '../../api/types.ts';

const STATUS_OPTIONS: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

interface OrderRowProps {
  order: AdminOrder;
  expandedId: number | null;
  setExpandedId: (id: number | null) => void;
  updateOrderStatus: ReturnType<typeof useUpdateOrderStatus>;
}

function OrderRow({ order, expandedId, setExpandedId, updateOrderStatus }: OrderRowProps) {
  const slug = order.orderNumber.toLowerCase();
  const isExpanded = expandedId === order.id;
  const transitions = ALLOWED_TRANSITIONS[order.status];
  const isUpdatingThis = updateOrderStatus.isPending && updateOrderStatus.variables?.id === order.id;

  const rowError =
    updateOrderStatus.isError &&
    updateOrderStatus.variables?.id === order.id &&
    updateOrderStatus.error instanceof ApiError
      ? updateOrderStatus.error.message
      : null;

  return (
    <div data-testid={`admin-order-row-${slug}`} className="rounded-lg border border-slate-200">
      <button
        type="button"
        onClick={() => setExpandedId(isExpanded ? null : order.id)}
        data-testid={`admin-order-expand-${slug}`}
        className="flex w-full flex-wrap items-center justify-between gap-4 px-4 py-3 text-left hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        <div>
          <p className="font-medium text-slate-800">{order.orderNumber}</p>
          <p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p>
        </div>
        <p data-testid={`admin-order-customer-${slug}`} className="text-sm text-slate-600">
          {order.customer.email}
        </p>
        <p data-testid={`admin-order-status-${slug}`} className="text-sm text-slate-600">
          {order.status}
        </p>
        <p className="font-medium text-slate-900">{formatPrice(order.totalPence)}</p>
      </button>

      {isExpanded && (
        <div data-testid={`admin-order-detail-${slug}`} className="border-t border-slate-200 p-4">
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span>
                  {item.productName} × {item.quantity} ({formatPrice(item.unitPricePence)} each)
                </span>
                <span>{formatPrice(item.lineTotalPence)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-slate-200 p-4">
            <h3 className="font-medium text-slate-800">Shipping address</h3>
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

          {rowError && (
            <p data-testid={`admin-order-error-${slug}`} className="mt-4 text-sm text-red-600">
              {rowError}
            </p>
          )}

          {transitions.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {transitions.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => updateOrderStatus.mutate({ id: order.id, status })}
                  disabled={isUpdatingThis}
                  data-testid={`admin-order-set-${status.toLowerCase()}-${slug}`}
                  className="rounded border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === 'CANCELLED' ? 'Cancel order' : `Mark as ${status}`}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: orders, isLoading, isError, refetch } = useAdminOrders(statusFilter || undefined);
  const updateOrderStatus = useUpdateOrderStatus();

  return (
    <div>
      <div>
        <label htmlFor="admin-orders-status" className="sr-only">
          Filter by status
        </label>
        <select
          id="admin-orders-status"
          data-testid="admin-orders-status-filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as OrderStatus | '')}
          className="rounded border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <option value="">All</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div data-testid="admin-orders-loading" className="mt-6 space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
      )}

      {isError && <ErrorState message="Couldn't load orders." onRetry={() => void refetch()} />}

      {orders && orders.length === 0 && (
        <div
          data-testid="admin-orders-empty"
          className="mt-10 flex flex-col items-center gap-3 py-10 text-center"
        >
          <p className="text-slate-600">No orders found</p>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div data-testid="admin-orders-list" className="mt-6 space-y-3">
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              updateOrderStatus={updateOrderStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrdersPage;
