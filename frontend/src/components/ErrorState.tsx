interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div data-testid="error-state" className="flex flex-col items-center gap-3 py-10 text-center">
      <p className="text-slate-600">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        data-testid="error-state-retry"
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        Retry
      </button>
    </div>
  );
}

export default ErrorState;
