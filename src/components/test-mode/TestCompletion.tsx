'use client';

import Link from 'next/link';
import { formatTime } from '@/lib/utils';
import IncorrectProblemsList from './IncorrectProblemsList';

interface Problem {
  num1: number;
  num2: number;
  answer: number;
  operation: 'addition' | 'subtraction' | 'multiplication';
}

interface TestCompletionProps {
  correctCount: number;
  totalQuestions: number;
  timeInSeconds: number;
  operation: 'addition' | 'subtraction' | 'multiplication';
  problems?: Problem[];
  userAnswers?: string[];
}

export function TestCompletion({
  correctCount,
  totalQuestions,
  timeInSeconds,
  operation,
  problems,
  userAnswers
}: TestCompletionProps): JSX.Element {
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Determine message based on performance
  const getMessage = (): string => {
    if (percentage === 100) return 'Perfect Score!';
    if (percentage >= 90) return 'Excellent Work!';
    if (percentage >= 80) return 'Great Job!';
    if (percentage >= 70) return 'Good Effort!';
    return 'Keep Practicing!';
  };

  const operationTitle = operation.charAt(0).toUpperCase() + operation.slice(1);

  // Determine if we should show incorrect problems
  const showIncorrectProblems =
    problems &&
    userAnswers &&
    correctCount < totalQuestions;

  return (
    <main className="min-h-screen bg-gradient-to-br from-jungle-dark via-jungle to-jungle-light flex items-center justify-center p-8">
      <div className={`flex ${showIncorrectProblems ? 'flex-row gap-6 max-w-6xl' : 'justify-center'} w-full`}>
        {/* Completion Card */}
        <div className={`bg-white/95 rounded-[30px] p-16 border-[6px] border-orange text-center ${showIncorrectProblems ? 'w-96 flex-shrink-0' : 'max-w-2xl w-full'}`}>
          <h1 className="text-5xl font-bold text-orange mb-4">
            {operationTitle} Test Complete!
          </h1>

          <p className="text-3xl font-bold text-jungle mb-8">
            {getMessage()}
          </p>

          <div className="space-y-6 mb-10">
            <div className="text-2xl text-jungle">
              <span className="font-bold text-4xl text-orange">{correctCount}</span>
              <span className="mx-2">out of</span>
              <span className="font-bold text-4xl">{totalQuestions}</span>
              <span className="ml-2">correct</span>
            </div>

            <div className="text-6xl font-bold text-jungle">
              {percentage}%
            </div>

            <div className="text-2xl text-jungle">
              Time: <span className="font-bold font-mono">{formatTime(timeInSeconds)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              href={`/math/${operation}/test`}
              className="text-2xl px-12 py-5 bg-gradient-to-b from-orange to-orange-dark text-white rounded-xl font-bold hover:scale-105 transition-transform inline-block"
            >
              Try Again
            </Link>

            <Link
              href="/"
              className="text-xl px-8 py-4 bg-gradient-to-b from-jungle to-jungle-dark text-white rounded-xl font-bold hover:scale-105 transition-transform inline-block"
            >
              Return to Home
            </Link>
          </div>
        </div>

        {/* Incorrect Problems Display */}
        {showIncorrectProblems && (
          <div className="flex-1 flex items-center">
            <IncorrectProblemsList
              problems={problems}
              userAnswers={userAnswers}
              operation={operation}
            />
          </div>
        )}
      </div>
    </main>
  );
}
