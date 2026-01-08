'use client';

interface TimerProps {
  seconds: number;
}

export function Timer({ seconds }: TimerProps): JSX.Element {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div className="text-2xl font-bold text-jungle">
      {String(minutes).padStart(2, '0')}:{String(remainingSeconds).padStart(2, '0')}
    </div>
  );
}
