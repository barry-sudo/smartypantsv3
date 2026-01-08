'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useGameState } from '@/hooks/useGameState';
import { useTimer } from '@/hooks/useTimer';
import { generateAdditionProblem } from '@/lib/game-logic/addition';
import { ImageReveal } from '@/components/game/ImageReveal';
import { Timer } from '@/components/game/Timer';
import { Counter } from '@/components/game/Counter';
import { CelebrationVideo } from '@/components/game/CelebrationVideo';
import { ASSETS } from '@/lib/assets';
import type { Problem } from '@/types';

export default function AdditionGame() {
  const router = useRouter();
  const { user } = useAuth();
  const [timerEnabled, setTimerEnabled] = useState(false);
  const { seconds } = useTimer(timerEnabled);
  const { session, correctCount, submitAnswer, completeSession, isLoading } = useGameState({
    module: 'addition',
    userId: user?.id || ''
  });

  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);

  // Select random image and video
  const [selectedImage] = useState(() =>
    ASSETS.images[Math.floor(Math.random() * ASSETS.images.length)]
  );
  const [selectedVideo] = useState(() =>
    ASSETS.videos[Math.floor(Math.random() * ASSETS.videos.length)]
  );

  // Generate first problem
  useEffect(() => {
    setCurrentProblem(generateAdditionProblem());
  }, []);

  // Handle answer submission
  const handleSubmit = async (): Promise<void> => {
    if (!currentProblem || !session || !userAnswer.trim()) return;

    const correct = await submitAnswer(
      `${currentProblem.num1} + ${currentProblem.num2}`,
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
          setCurrentProblem(generateAdditionProblem());
          setUserAnswer('');
          setFeedback('');
          setAttemptNumber(1);
        }, 2000);
      }
    } else {
      setFeedback('Try Again!');
      setUserAnswer('');
      setAttemptNumber(prev => prev + 1);
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
      {/* Timer toggle and display */}
      <div className="absolute top-5 right-5 flex flex-col items-end gap-2">
        <label className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={timerEnabled}
            onChange={(e) => setTimerEnabled(e.target.checked)}
            className="w-5 h-5"
          />
          <span className="text-jungle font-bold">Timer</span>
        </label>
        {timerEnabled && <Timer seconds={seconds} />}
      </div>

      {/* Counter */}
      <Counter current={correctCount} total={25} />

      {/* Two-panel layout */}
      <div className="flex flex-col lg:flex-row gap-5 p-5 pt-20 max-w-7xl mx-auto min-h-screen items-center justify-center">
        {/* Left panel: Problem and input */}
        <div className="flex-1 bg-white/95 rounded-[30px] p-16 border-[6px] border-orange w-full max-w-2xl">
          <div className="text-8xl font-bold text-jungle text-center mb-10">
            {currentProblem.num1} + {currentProblem.num2}
          </div>

          <div className="flex flex-col items-center gap-8">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-6xl w-64 text-center p-5 border-4 border-jungle rounded-xl focus:outline-none focus:ring-4 focus:ring-orange"
              autoFocus
              placeholder="?"
            />

            <button
              onClick={handleSubmit}
              className="text-4xl px-20 py-6 bg-gradient-to-b from-orange to-orange-dark text-white rounded-xl font-bold hover:scale-105 transition-transform active:scale-95"
            >
              SUBMIT
            </button>

            <div
              className={`text-5xl font-bold min-h-20 flex items-center ${
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
