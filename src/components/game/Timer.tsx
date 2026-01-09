'use client';

interface TimerProps {
  seconds: number;
}

export function Timer({ seconds }: TimerProps): JSX.Element {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div className="bg-white/90 px-6 py-3 rounded-lg border-2 border-orange">
      <div className="text-2xl font-bold text-jungle font-mono">
        {String(minutes).padStart(2, '0')}:{String(remainingSeconds).padStart(2, '0')}
      </div>
    </div>
  );
}
