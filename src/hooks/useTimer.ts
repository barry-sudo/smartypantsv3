'use client';

import { useState, useEffect, useRef } from 'react';

interface UseTimerReturn {
  seconds: number;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useTimer(isActive: boolean): UseTimerReturn {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const start = (): void => {
    // Handled by isActive prop
  };

  const stop = (): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const reset = (): void => {
    setSeconds(0);
  };

  return { seconds, start, stop, reset };
}
