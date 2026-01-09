'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useGameState } from '@/hooks/useGameState';
import { useTimer } from '@/hooks/useTimer';
import { selectRandomWord } from '@/lib/game-logic/spelling';
import { ImageReveal } from '@/components/game/ImageReveal';
import { Timer } from '@/components/game/Timer';
import { Counter } from '@/components/game/Counter';
import { CelebrationVideo } from '@/components/game/CelebrationVideo';
import { LetterBoxes } from '@/components/game/LetterBoxes';
import { ASSETS } from '@/lib/assets';

export default function SpellingGame() {
  const router = useRouter();
  const { user } = useAuth();
  const [timerEnabled, setTimerEnabled] = useState(false);
  const { seconds } = useTimer(timerEnabled);
  const { session, correctCount, submitAnswer, completeSession, isLoading } = useGameState({
    module: 'spelling',
    userId: user?.id || ''
  });

  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [showWritePrompt, setShowWritePrompt] = useState(false);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  // Select random image and video
  const [selectedImage] = useState(() =>
    ASSETS.images[Math.floor(Math.random() * ASSETS.images.length)]
  );
  const [selectedVideo] = useState(() =>
    ASSETS.videos[Math.floor(Math.random() * ASSETS.videos.length)]
  );

  // Select first word and play audio
  useEffect(() => {
    const word = selectRandomWord(usedWords);
    setCurrentWord(word);
    playWordAudio(word);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playWordAudio = (word: string): void => {
    const audio = new Audio(ASSETS.getSpellingAudio(word));
    audio.play().catch(() => {
      setAudioError(true);
    });
  };

  const handlePlayAgain = (): void => {
    if (currentWord) {
      playWordAudio(currentWord);
      setAudioError(false);
    }
  };

  const handleWordComplete = async (): Promise<void> => {
    if (!currentWord || !session) return;

    // Word was spelled correctly (LetterBoxes only calls this on success)
    await submitAnswer(
      currentWord,
      currentWord,
      currentWord,
      attemptNumber
    );

    // Play tiger roar
    const audio = new Audio(ASSETS.tigerRoar);
    audio.play().catch(() => {
      // Handle autoplay restrictions
    });

    // Check if session complete
    const sessionComplete = correctCount + 1 >= 25;
    if (sessionComplete) {
      await completeSession(seconds);
      setIsSessionComplete(true);
    }

    // Show write prompt after 1.5 seconds (to let user see feedback)
    setTimeout(() => {
      setShowWritePrompt(true);
    }, 1500);
  };

  const handleWriteDone = (): void => {
    setShowWritePrompt(false);

    if (isSessionComplete) {
      setShowCelebration(true);
    } else {
      // Load next word
      const newUsedWords = [...usedWords, currentWord!];
      setUsedWords(newUsedWords);
      const nextWord = selectRandomWord(newUsedWords);
      setCurrentWord(nextWord);
      playWordAudio(nextWord);
      setAttemptNumber(1);
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

  if (!currentWord) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-jungle-dark via-jungle to-jungle-light flex items-center justify-center">
        <div className="text-4xl font-bold text-white">Loading word...</div>
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

      {/* Counter with Back to Home link */}
      <Counter current={correctCount} total={25} showBackLink />

      {/* Two-panel layout */}
      <div className="flex flex-col lg:flex-row gap-5 p-5 pt-20 max-w-7xl mx-auto min-h-screen items-center justify-center">
        {/* Left panel: Spelling interface */}
        <div className="flex-1 bg-white/95 rounded-[30px] p-16 border-[6px] border-orange w-full max-w-2xl relative">
          {/* Write prompt overlay */}
          {showWritePrompt && (
            <div className="absolute inset-0 bg-white/95 rounded-[30px] flex flex-col items-center justify-center z-10">
              <div className="text-5xl font-bold text-jungle text-center mb-8">
                Now write out the word
              </div>
              <div className="text-3xl text-jungle-dark text-center mb-12">
                &ldquo;{currentWord}&rdquo;
              </div>
              <button
                onClick={handleWriteDone}
                className="text-3xl px-16 py-8 bg-gradient-to-b from-orange to-orange-dark text-white rounded-xl font-bold hover:scale-105 transition-transform active:scale-95"
              >
                I&apos;m Done
              </button>
            </div>
          )}

          <div className="text-5xl font-bold text-jungle text-center mb-10">
            Spell the word:
          </div>

          <div className="flex flex-col items-center gap-12">
            {/* Play word button */}
            <button
              onClick={handlePlayAgain}
              className="text-3xl px-12 py-6 bg-gradient-to-b from-jungle to-jungle-dark text-white rounded-xl font-bold hover:scale-105 transition-transform active:scale-95"
            >
              🔊 Play Word {audioError ? '' : 'Again'}
            </button>

            {audioError && (
              <div className="text-orange text-xl text-center">
                Click button to hear the word
              </div>
            )}

            {/* Letter boxes */}
            <LetterBoxes
              wordLength={currentWord.length}
              correctWord={currentWord}
              onComplete={handleWordComplete}
            />

            <div className="text-2xl text-jungle-dark text-center">
              Type each letter to spell the word
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
