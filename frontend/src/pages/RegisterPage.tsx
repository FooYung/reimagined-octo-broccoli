import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { useRegister } from '../api/auth.ts';
import { ApiError } from '../api/client.ts';
import { registerSchema, type RegisterFormValues } from '../lib/validation.ts';

const FORM_FIELDS = ['name', 'email', 'password'] as const;

function RegisterPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });
  const registerUser = useRegister();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  function onSubmit(values: RegisterFormValues) {
    setFormError(null);
    registerUser.mutate(values, {
      onSuccess: () => navigate('/', { replace: true }),
      onError: (error) => {
        if (error instanceof ApiError) {
          if (error.code === 'EMAIL_IN_USE') {
            setError('email', { message: error.message });
            return;
          }
          if (error.code === 'VALIDATION_ERROR' && error.details) {
            let matched = false;
            for (const detail of error.details) {
              if ((FORM_FIELDS as readonly string[]).includes(detail.field)) {
                setError(detail.field as keyof RegisterFormValues, { message: detail.message });
                matched = true;
              }
            }
            if (matched) return;
          }
          setFormError(error.message);
          return;
        }
        setFormError('Something went wrong. Please try again.');
      },
    });
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">Create your ByteCore account</h1>

        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          noValidate
          className="mt-6 space-y-4"
        >
          {formError && (
            <div
              data-testid="register-error"
              className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {formError}
            </div>
          )}

          <div>
            <label htmlFor="register-name" className="block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              id="register-name"
              type="text"
              data-testid="register-name-input"
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'register-name-error' : undefined}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              {...register('name')}
            />
            {errors.name && (
              <p
                id="register-name-error"
                data-testid="register-name-error"
                className="mt-1 text-sm text-red-600"
              >
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="register-email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              data-testid="register-email-input"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'register-email-error' : undefined}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              {...register('email')}
            />
            {errors.email && (
              <p
                id="register-email-error"
                data-testid="register-email-error"
                className="mt-1 text-sm text-red-600"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="register-password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              data-testid="register-password-input"
              aria-invalid={errors.password ? 'true' : 'false'}
              aria-describedby={errors.password ? 'register-password-error' : undefined}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              {...register('password')}
            />
            {errors.password && (
              <p
                id="register-password-error"
                data-testid="register-password-error"
                className="mt-1 text-sm text-red-600"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            data-testid="register-submit"
            disabled={registerUser.isPending}
            className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {registerUser.isPending ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link
            to="/login"
            data-testid="register-login-link"
            className="font-medium text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
