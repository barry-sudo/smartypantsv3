'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useGameState } from '@/hooks/useGameState';
import { useTimer } from '@/hooks/useTimer';
import { generate{{OperationPascal}}Problem } from '@/lib/game-logic/{{operation}}';
import { ImageReveal } from '@/components/game/ImageReveal';
import { Timer } from '@/components/game/Timer';
import { Counter } from '@/components/game/Counter';
import { CelebrationVideo } from '@/components/game/CelebrationVideo';
import { ASSETS } from '@/lib/assets';
import type { Problem } from '@/types';

export default function {{OperationPascal}}Game() {
  const router = useRouter();
  const { user } = useAuth();
  const { seconds } = useTimer(true); // Always running stopwatch
  const { session, correctCount, submitAnswer, completeSession, isLoading } = useGameState({
    module: '{{operation}}',
    userId: user?.id || ''
  });

  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Select random image and video
  const [selectedImage] = useState(() =>
    ASSETS.images[Math.floor(Math.random() * ASSETS.images.length)]
  );
  const [selectedVideo] = useState(() =>
    ASSETS.videos[Math.floor(Math.random() * ASSETS.videos.length)]
  );

  // Generate first problem
  useEffect(() => {
    setCurrentProblem(generate{{OperationPascal}}Problem());
  }, []);

  // Handle answer submission
  const handleSubmit = async (): Promise<void> => {
    if (!currentProblem || !session || !userAnswer.trim()) return;

    const correct = await submitAnswer(
      `${currentProblem.num1} {{operator}} ${currentProblem.num2}`,
      currentProblem.answer.toString(),
      userAnswer.trim(),
      attemptNumber
    );

    if (correct) {
      // Play tiger roar
      const audio = new Audio(ASSETS.tigerRoar);
      audio.play().catch(() => {
        // Handle autoplay restrictions
      });

      setFeedback('ROAR!');

      // Check if session complete
      if (correctCount + 1 >= 25) {
        await completeSession(seconds);
        setTimeout(() => setShowCelebration(true), 2000);
      } else {
        // Generate next problem after 2 seconds
        setTimeout(() => {
          setCurrentProblem(generate{{OperationPascal}}Problem());
          setUserAnswer('');
          setFeedback('');
          setAttemptNumber(1);
          // Re-focus the input for the next problem
          inputRef.current?.focus();
        }, 2000);
      }
    } else {
      setFeedback('Try Again!');
      setUserAnswer('');
      setAttemptNumber(prev => prev + 1);
      // Re-focus the input after incorrect answer
      inputRef.current?.focus();
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-jungle-dark via-jungle to-jungle-light flex items-center justify-center">
        <div className="text-4xl font-bold text-white">Loading...</div>
      </div>
    );
  }

  if (showCelebration) {
    return (
      <CelebrationVideo
        videoUrl={selectedVideo}
        onContinue={() => router.push('/')}
      />
    );
  }

  if (!currentProblem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-jungle-dark via-jungle to-jungle-light flex items-center justify-center">
        <div className="text-4xl font-bold text-white">Loading problem...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-jungle-dark via-jungle to-jungle-light relative">
      {/* Stopwatch timer - always visible */}
      <div className="absolute top-5 right-5">
        <Timer seconds={seconds} />
      </div>

      {/* Counter with Back to Home link */}
      <Counter current={correctCount} total={25} showBackLink />

      {/* Two-panel layout */}
      <div className="flex flex-col lg:flex-row gap-5 p-5 pt-20 max-w-7xl mx-auto min-h-screen items-center justify-center">
        {/* Left panel: Problem and input */}
        <div className="flex-1 bg-white/95 rounded-[30px] p-16 border-[6px] border-orange w-full max-w-2xl">
          {/* Vertical arithmetic layout */}
          <div className="flex flex-col items-center mb-10">
            <div className="font-mono text-8xl font-bold text-jungle">
              {/* First number - right aligned */}
              <div className="text-right pr-4">
                {currentProblem.num1}
              </div>
              {/* Operator and second number */}
              <div className="flex items-center">
                <span className="text-jungle mr-2">{{operator}}</span>
                <span className="text-right flex-1">{currentProblem.num2}</span>
              </div>
              {/* Horizontal line */}
              <div className="border-b-4 border-jungle mt-2 mb-4 w-full"></div>
            </div>

            {/* Answer input - styled to match the problem */}
            <input
              ref={inputRef}
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              className="font-mono text-7xl w-48 text-center p-4 border-4 border-jungle rounded-xl focus:outline-none focus:ring-4 focus:ring-orange bg-white"
              autoFocus
              placeholder="?"
            />
          </div>

          <div className="flex flex-col items-center gap-6">
            <button
              onClick={handleSubmit}
              className="text-4xl px-20 py-6 bg-gradient-to-b from-orange to-orange-dark text-white rounded-xl font-bold hover:scale-105 transition-transform active:scale-95"
            >
              SUBMIT
            </button>

            <div
              className={`text-5xl font-bold min-h-16 flex items-center ${
                feedback === 'ROAR!' ? 'text-orange' : 'text-red-600'
              }`}
            >
              {feedback}
            </div>
          </div>
        </div>

        {/* Right panel: Image reveal */}
        <div className="flex-1 bg-white/95 rounded-[30px] p-10 border-[6px] border-orange w-full max-w-2xl h-[600px]">
          <ImageReveal imageUrl={selectedImage} revealedCount={correctCount} />
        </div>
      </div>
    </main>
  );
}
