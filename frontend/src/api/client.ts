import type { ApiErrorBody } from './types.ts';

export class ApiError extends Error {
  status: number;
  code: string;
  details?: ApiErrorBody['error']['details'];

  constructor(
    status: number,
    code: string,
    message: string,
    details?: ApiErrorBody['error']['details'],
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.body ? { 'Content-Type': 'application/json' } : {});
  if (init?.headers) {
    new Headers(init.headers).forEach((value, key) => headers.set(key, value));
  }

  const response = await fetch(`/api${path}`, { ...init, headers });

  if (response.status === 204) {
    return undefined as T;
  }

  if (!response.ok) {
    let body: ApiErrorBody;
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      body = { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } };
    }
    throw new ApiError(response.status, body.error.code, body.error.message, body.error.details);
  }

  return (await response.json()) as T;
}
