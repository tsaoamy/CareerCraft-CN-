'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[App Error]', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 w-14 h-14 rounded-2xl bg-[#fff5e6] dark:bg-[#3d2900] flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-apple-orange" />
        </div>
        <h2 className="text-xl font-semibold text-apple-text dark:text-white mb-3">
          Something went wrong
        </h2>
        <p className="text-sm text-apple-text-secondary mb-6 leading-relaxed">
          An unexpected error occurred. Please try refreshing the page.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-apple-blue text-white text-sm font-medium hover:bg-[#0077ed] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-btn text-sm font-medium text-apple-text dark:text-white"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
