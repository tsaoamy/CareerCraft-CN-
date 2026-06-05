import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <p className="text-[64px] font-bold text-shimmer leading-none mb-4">404</p>
        <h2 className="text-xl font-semibold text-apple-text dark:text-white mb-3">
          Page not found
        </h2>
        <p className="text-sm text-apple-text-secondary mb-8 leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-apple-blue text-white text-sm font-medium hover:bg-[#0077ed] transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-btn text-sm font-medium text-apple-text dark:text-white"
          >
            <Search className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
