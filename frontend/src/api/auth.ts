import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch, ApiError } from './client.ts';
import type { User } from './types.ts';
import type { LoginFormValues, RegisterFormValues } from '../lib/validation.ts';

async function fetchCurrentUser(): Promise<User | null> {
  try {
    return await apiFetch<User>('/auth/me');
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60_000,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: LoginFormValues) =>
      apiFetch<User>('/auth/login', { method: 'POST', body: JSON.stringify(values) }),
    onSuccess: (user) => {
      queryClient.setQueryData(['auth', 'me'], user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: RegisterFormValues) =>
      apiFetch<User>('/auth/register', { method: 'POST', body: JSON.stringify(values) }),
    onSuccess: (user) => {
      queryClient.setQueryData(['auth', 'me'], user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiFetch<void>('/auth/logout', { method: 'POST' }),
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null);
      queryClient.removeQueries({ queryKey: ['basket'] });
    },
  });
}
