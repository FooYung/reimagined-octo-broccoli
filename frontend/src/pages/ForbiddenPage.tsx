import { Link } from 'react-router';

function ForbiddenPage() {
  return (
    <div
      data-testid="forbidden-page"
      className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center"
    >
      <p className="text-7xl font-bold text-blue-600">403</p>
      <h1 className="mt-4 text-2xl font-semibold text-slate-800">Access denied</h1>
      <p className="mt-2 text-slate-500">You need an administrator account to view this page.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        Back to home
      </Link>
    </div>
  );
}

export default ForbiddenPage;
