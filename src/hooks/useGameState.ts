'use client';

import { useState, useEffect } from 'react';
import { createSession, updateSession } from '@/lib/supabase/queries/sessions';
import { logAttempt } from '@/lib/supabase/queries/attempts';
import type { Session, GameModule } from '@/types';

interface UseGameStateOptions {
  module: GameModule;
  userId: string;
  mode?: 'study' | 'test';
}

interface UseGameStateReturn {
  session: Session | null;
  correctCount: number;
  totalAttempts: number;
  isLoading: boolean;
  submitAnswer: (
    problem: string,
    expectedAnswer: string,
    userAnswer: string,
    attemptNumber: number
  ) => Promise<boolean>;
  completeSession: (durationSeconds: number) => Promise<void>;
}

export function useGameState({ module, userId, mode = 'study' }: UseGameStateOptions): UseGameStateReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Create session on mount
  useEffect(() => {
    if (userId) {
      createSession(userId, module, mode).then(newSession => {
        setSession(newSession);
        setIsLoading(false);
      });
    }
  }, [userId, module, mode]);

  // Submit answer attempt
  const submitAnswer = async (
    problem: string,
    expectedAnswer: string,
    userAnswer: string,
    attemptNumber: number
  ): Promise<boolean> => {
    if (!session) return false;

    const correct = userAnswer.trim() === expectedAnswer.trim();

    // Log attempt to database
    await logAttempt(session.id, {
      problem,
      expected_answer: expectedAnswer,
      user_answer: userAnswer,
      correct,
      attempt_number: attemptNumber
    });

    // Update local state
    setTotalAttempts(prev => prev + 1);
    if (correct) {
      setCorrectCount(prev => prev + 1);
    }

    // Update session in database every 5 correct answers
    if (correct && (correctCount + 1) % 5 === 0) {
      await updateSession(session.id, {
        correct_count: correctCount + 1,
        total_attempts: totalAttempts + 1
      });
    }

    return correct;
  };

  // Complete session
  const completeSession = async (durationSeconds: number): Promise<void> => {
    if (!session) return;

    await updateSession(session.id, {
      completed: true,
      completed_at: new Date().toISOString(),
      duration_seconds: durationSeconds,
      correct_count: correctCount,
      total_attempts: totalAttempts
    });
  };

  return {
    session,
    correctCount,
    totalAttempts,
    isLoading,
    submitAnswer,
    completeSession
  };
}
