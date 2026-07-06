import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate, type Location } from 'react-router';
import { useLogin } from '../api/auth.ts';
import { ApiError } from '../api/client.ts';
import { loginSchema, type LoginFormValues } from '../lib/validation.ts';

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: Location })?.from?.pathname ?? '/';

  function onSubmit(values: LoginFormValues) {
    login.mutate(values, {
      onSuccess: () => navigate(from, { replace: true }),
    });
  }

  const serverError = login.isError && login.error instanceof ApiError ? login.error.message : null;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">Sign in to ByteCore</h1>

        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          noValidate
          className="mt-6 space-y-4"
        >
          {serverError && (
            <div
              data-testid="login-error"
              className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {serverError}
            </div>
          )}

          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              data-testid="login-email-input"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'login-email-error' : undefined}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              {...register('email')}
            />
            {errors.email && (
              <p
                id="login-email-error"
                data-testid="login-email-error"
                className="mt-1 text-sm text-red-600"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              data-testid="login-password-input"
              aria-invalid={errors.password ? 'true' : 'false'}
              aria-describedby={errors.password ? 'login-password-error' : undefined}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              {...register('password')}
            />
            {errors.password && (
              <p
                id="login-password-error"
                data-testid="login-password-error"
                className="mt-1 text-sm text-red-600"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            data-testid="login-submit"
            disabled={login.isPending}
            className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {login.isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            data-testid="login-register-link"
            className="font-medium text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
