import { Link } from 'react-router';

interface PagePlaceholderProps {
  title: string;
}

function PagePlaceholder({ title }: PagePlaceholderProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div
        data-testid="page-placeholder"
        className="rounded-lg border border-slate-200 p-8 text-center shadow-sm"
      >
        <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
        <p className="mt-2 text-slate-500">This page is coming in a later phase.</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default PagePlaceholder;
