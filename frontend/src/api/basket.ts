import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch, ApiError } from './client.ts';
import { useCurrentUser } from './auth.ts';
import type { Basket, Order } from './types.ts';
import type { CheckoutFormValues } from '../lib/validation.ts';

export function useBasket() {
  const { data: user } = useCurrentUser();
  return useQuery({
    queryKey: ['basket'],
    queryFn: () => apiFetch<Basket>('/basket'),
    enabled: !!user,
    retry: false,
  });
}

export function useAddToBasket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: { productId: number; quantity: number }) =>
      apiFetch<Basket>('/basket/items', { method: 'POST', body: JSON.stringify(values) }),
    onSuccess: (basket) => {
      queryClient.setQueryData(['basket'], basket);
    },
  });
}

export function useUpdateBasketItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      apiFetch<Basket>(`/basket/items/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity }),
      }),
    onSuccess: (basket) => {
      queryClient.setQueryData(['basket'], basket);
    },
  });
}

export function useRemoveBasketItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) =>
      apiFetch<Basket>(`/basket/items/${productId}`, { method: 'DELETE' }),
    onSuccess: (basket) => {
      queryClient.setQueryData(['basket'], basket);
    },
  });
}

export function useCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: CheckoutFormValues) =>
      apiFetch<Order>('/checkout', { method: 'POST', body: JSON.stringify(values) }),
    onSuccess: () => {
      queryClient.setQueryData(['basket'], { items: [], totalPence: 0 });
      void queryClient.invalidateQueries({ queryKey: ['products'] });
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      // A stock conflict means the basket/product data the user saw is now stale —
      // refetch both so they see current stock instead of resubmitting blind.
      if (error instanceof ApiError && error.code === 'STOCK_CONFLICT') {
        void queryClient.invalidateQueries({ queryKey: ['basket'] });
        void queryClient.invalidateQueries({ queryKey: ['products'] });
      }
    },
  });
}
