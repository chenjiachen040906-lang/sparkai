'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold text-[var(--text-primary)]">
        出了点问题
      </h2>
      <p className="text-sm text-[var(--text-secondary)]">
        {error.message || '应用加载失败，请刷新页面重试'}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-[var(--accent-color)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
      >
        重新加载
      </button>
    </div>
  );
}
