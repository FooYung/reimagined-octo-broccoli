import { useQuery } from '@tanstack/react-query';
import { apiFetch } from './client.ts';
import type { Category, ProductListResponse } from './types.ts';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiFetch<Category[]>('/categories'),
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => apiFetch<ProductListResponse>('/products?limit=8'),
  });
}
