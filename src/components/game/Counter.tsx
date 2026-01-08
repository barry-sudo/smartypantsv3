'use client';

interface CounterProps {
  current: number;
  total: number;
}

export function Counter({ current, total }: CounterProps): JSX.Element {
  return (
    <div className="absolute top-5 left-5 bg-white/90 px-6 py-3 rounded-lg border-2 border-orange">
      <div className="text-2xl font-bold text-jungle">
        {current} out of {total}
      </div>
    </div>
  );
}
