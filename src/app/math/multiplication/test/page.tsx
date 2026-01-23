'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTimer } from '@/hooks/useTimer';
import { generateMultiplicationTestModeProblems } from '@/lib/game-logic/multiplication';
import { createSession, updateSession } from '@/lib/supabase/queries/sessions';
import { logAttempt } from '@/lib/supabase/queries/attempts';
import type { Problem } from '@/types';
import { NumberSelection, TestGrid, TestCompletion } from '@/components/test-mode';

type TestState = 'selection' | 'testing' | 'completed';

export default function MultiplicationTestPage() {
  const { user } = useAuth();

  const [testState, setTestState] = useState<TestState>('selection');
  const [isTimerActive, setIsTimerActive] = useState(false);
  const { seconds } = useTimer(isTimerActive);

  const [problems, setProblems] = useState<Problem[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const [userAnswersState, setUserAnswersState] = useState<string[]>([]);

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-jungle-dark via-jungle to-jungle-light flex items-center justify-center">
        <div className="text-4xl font-bold text-white">Loading...</div>
      </main>
    );
  }

  const handleStart = async (selectedNumber: number): Promise<void> => {
    // Generate 16 problems with fixed operand
    const testProblems = generateMultiplicationTestModeProblems(selectedNumber);
    setProblems(testProblems);

    // Create session in database
    const session = await createSession(user.id, 'multiplication', 'test');
    if (session) {
      setSessionId(session.id);
      setIsTimerActive(true);
      setTestState('testing');
    }
  };

  const handleComplete = async (answers: string[], correct: number): Promise<void> => {
    setIsTimerActive(false);
    setCorrectCount(correct);
    setFinalTime(seconds);
    setUserAnswersState(answers); // Store answers for completion display

    // Log all attempts to database
    if (sessionId) {
      for (let i = 0; i < problems.length; i++) {
        const userAnswer = answers[i] || '';
        const isCorrect = userAnswer !== '' && parseInt(userAnswer) === problems[i].answer;

        await logAttempt(sessionId, {
          problem: `${problems[i].num1} × ${problems[i].num2}`,
          expected_answer: problems[i].answer.toString(),
          user_answer: userAnswer,
          correct: isCorrect,
          attempt_number: 1
        });
      }

      // Update session as completed
      await updateSession(sessionId, {
        completed: true,
        completed_at: new Date().toISOString(),
        duration_seconds: seconds,
        correct_count: correct,
        total_attempts: 16
      });
    }

    setTestState('completed');
  };

  if (testState === 'selection') {
    return <NumberSelection operation="multiplication" onStart={handleStart} />;
  }

  if (testState === 'testing') {
    return (
      <TestGrid
        problems={problems}
        seconds={seconds}
        operation="multiplication"
        onComplete={handleComplete}
      />
    );
  }

  if (testState === 'completed') {
    return (
      <TestCompletion
        correctCount={correctCount}
        totalQuestions={16}
        timeInSeconds={finalTime}
        operation="multiplication"
        problems={problems}
        userAnswers={userAnswersState}
      />
    );
  }

  return null;
}
