import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { apiFetch } from './client.ts';
import type { Category, Product, ProductListResponse } from './types.ts';

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

export interface ProductListParams {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
}

export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: ['products', 'list', params],
    queryFn: () => {
      const searchParams = new URLSearchParams();
      if (params.search) searchParams.set('search', params.search);
      if (params.category) searchParams.set('category', params.category);
      if (params.sort) searchParams.set('sort', params.sort);
      if (params.page) searchParams.set('page', String(params.page));
      searchParams.set('limit', '12');
      return apiFetch<ProductListResponse>(`/products?${searchParams.toString()}`);
    },
    placeholderData: keepPreviousData,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['products', 'detail', slug],
    queryFn: () => apiFetch<Product>(`/products/${slug}`),
    // A 404 means the slug doesn't exist (or is inactive) — retrying won't change that,
    // so fail fast instead of retrying.
    retry: false,
  });
}
