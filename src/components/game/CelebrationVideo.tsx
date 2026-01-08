'use client';

import { useEffect, useRef } from 'react';

interface CelebrationVideoProps {
  videoUrl: string;
  onContinue: () => void;
}

export function CelebrationVideo({ videoUrl, onContinue }: CelebrationVideoProps): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Handle autoplay restrictions
      });
    }
  }, []);

  const handleVideoEnd = (): void => {
    setTimeout(onContinue, 2000); // Wait 2 seconds after video ends
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <video
        ref={videoRef}
        src={videoUrl}
        className="max-w-full max-h-full"
        onEnded={handleVideoEnd}
        playsInline
      />
      <button
        onClick={onContinue}
        className="absolute bottom-10 px-8 py-4 bg-orange text-white text-2xl font-bold rounded-xl hover:bg-orange-dark transition-colors"
      >
        Continue
      </button>
    </div>
  );
}
