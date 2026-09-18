'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error server-side in production; never expose to users
    console.error('[MedFlow Error]', error.digest ?? 'no-digest');
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="max-w-md w-full text-center">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6"
          style={{ backgroundColor: 'rgba(220,38,38,0.1)' }}
        >
          <svg className="w-7 h-7" fill="none" stroke="#dc2626" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>

        <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--text-1)' }}>
          Something went wrong
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>
          An unexpected error occurred. Please try again or return to the dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 rounded text-sm font-medium text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#1e3a5f' }}
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded text-sm font-medium transition-colors"
            style={{
              backgroundColor: 'var(--surface)',
              color: 'var(--text-1)',
              border: '1px solid var(--border)',
            }}
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
