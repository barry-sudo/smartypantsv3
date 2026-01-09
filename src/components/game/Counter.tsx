'use client';

import Link from 'next/link';

interface CounterProps {
  current: number;
  total: number;
  showBackLink?: boolean;
}

export function Counter({ current, total, showBackLink = false }: CounterProps): JSX.Element {
  return (
    <div className="absolute top-5 left-5 flex items-center gap-4">
      <div className="bg-white/90 px-6 py-3 rounded-lg border-2 border-orange">
        <div className="text-2xl font-bold text-jungle">
          {current} out of {total}
        </div>
      </div>
      {showBackLink && (
        <Link
          href="/"
          className="text-white hover:text-orange transition-colors font-medium"
        >
          ← Back to Home
        </Link>
      )}
    </div>
  );
}
