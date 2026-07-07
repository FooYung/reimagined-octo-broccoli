import { useQuery } from '@tanstack/react-query';
import { apiFetch } from './client.ts';
import type { Order } from './types.ts';

export function useOrders() {
  return useQuery({
    queryKey: ['orders', 'list'],
    queryFn: () => apiFetch<Order[]>('/orders'),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', 'detail', id],
    queryFn: () => apiFetch<Order>(`/orders/${id}`),
    // A 404 means the order doesn't exist (or isn't this user's) — retrying won't change
    // that, so fail fast instead of retrying.
    retry: false,
  });
}
