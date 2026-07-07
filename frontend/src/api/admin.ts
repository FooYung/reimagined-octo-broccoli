import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from './client.ts';
import type { AdminOrder, Category, OrderStatus, Product, ProductListResponse } from './types.ts';

export interface AdminProductListParams {
  search?: string;
  page?: number;
}

export function useAdminProducts(params: AdminProductListParams) {
  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: () => {
      const searchParams = new URLSearchParams();
      if (params.search) searchParams.set('search', params.search);
      if (params.page) searchParams.set('page', String(params.page));
      searchParams.set('limit', '20');
      return apiFetch<ProductListResponse>(`/admin/products?${searchParams.toString()}`);
    },
    placeholderData: keepPreviousData,
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: () => apiFetch<Category[]>('/admin/categories'),
  });
}

export function useAdminOrders(status?: OrderStatus) {
  return useQuery({
    queryKey: ['admin', 'orders', status ?? 'all'],
    queryFn: () =>
      apiFetch<AdminOrder[]>(`/admin/orders${status ? `?status=${status}` : ''}`),
  });
}

export interface CreateProductPayload {
  name: string;
  description: string;
  pricePence: number;
  stock: number;
  categoryId: number;
  isActive: boolean;
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductPayload) =>
      apiFetch<Product>('/admin/products', { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      void queryClient.invalidateQueries({ queryKey: ['products'] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      void queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export interface UpdateProductPayload {
  id: number;
  data: Partial<{
    name: string;
    description: string;
    pricePence: number;
    stock: number;
    categoryId: number;
    isActive: boolean;
  }>;
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UpdateProductPayload) =>
      apiFetch<Product>(`/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      void queryClient.invalidateQueries({ queryKey: ['products'] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      void queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiFetch<void>(`/admin/products/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      void queryClient.invalidateQueries({ queryKey: ['products'] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      void queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: { name: string }) =>
      apiFetch<Pick<Category, 'id' | 'name' | 'slug'>>('/admin/categories', {
        method: 'POST',
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      void queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      apiFetch<Pick<Category, 'id' | 'name' | 'slug'>>(`/admin/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name }),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      void queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiFetch<void>(`/admin/categories/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      void queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      apiFetch<AdminOrder>(`/admin/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
