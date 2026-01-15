'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { Problem } from '@/types';
import { Timer } from '@/components/game/Timer';

interface TestGridProps {
  problems: Problem[];
  seconds: number;
  operation: 'addition' | 'subtraction' | 'multiplication';
  onComplete: (answers: string[], correctCount: number) => void;
}

export function TestGrid({ problems, seconds, operation, onComplete }: TestGridProps): JSX.Element {
  const [answers, setAnswers] = useState<string[]>(Array(16).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleAnswerChange = (index: number, value: string): void => {
    // Only allow numeric input
    if (value !== '' && !/^\d*$/.test(value)) return;

    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);

    // Auto-advance to next input when 2+ digits entered (reasonable answer length)
    if (value.length >= 2 && index < 15) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      if (index < 15) {
        inputRefs.current[index + 1]?.focus();
      } else {
        // Last input - check if we should complete
        handleSubmit();
      }
    } else if (e.key === 'ArrowRight' && index < 15) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowDown' && index < 8) {
      inputRefs.current[index + 8]?.focus();
    } else if (e.key === 'ArrowUp' && index >= 8) {
      inputRefs.current[index - 8]?.focus();
    }
  };

  const handleSubmit = (): void => {
    // Calculate correct count
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer !== '' && parseInt(answer) === problems[index].answer) {
        correct++;
      }
    });

    onComplete(answers, correct);
  };

  const answeredCount = answers.filter(a => a !== '').length;
  const allAnswered = answeredCount === 16;

  const getOperatorSymbol = (): string => {
    switch (operation) {
      case 'addition':
        return '+';
      case 'subtraction':
        return '-';
      case 'multiplication':
        return '×';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-jungle-dark via-jungle to-jungle-light p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="flex items-center gap-6">
          <div className="bg-white/90 px-6 py-3 rounded-lg border-2 border-orange">
            <span className="text-2xl font-bold text-jungle">{answeredCount} out of 16</span>
          </div>
          <Link
            href="/"
            className="text-white hover:text-orange transition-colors font-medium text-lg"
          >
            ← Back to Home
          </Link>
        </div>
        <Timer seconds={seconds} />
      </div>

      {/* Grid Container */}
      <div className="bg-white/95 rounded-[30px] p-8 border-[6px] border-orange max-w-6xl mx-auto">
        {/* 2 rows x 8 columns grid */}
        <div className="grid grid-cols-8 gap-4">
          {problems.map((problem, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Problem Display - Vertical arithmetic */}
              <div className="text-center mb-2 font-mono">
                <div className="text-2xl font-bold text-jungle text-right pr-2">
                  {problem.num1}
                </div>
                <div className="text-2xl font-bold text-jungle flex items-center justify-end">
                  <span className="mr-1">{getOperatorSymbol()}</span>
                  <span>{problem.num2}</span>
                </div>
                <div className="border-t-2 border-jungle w-full mt-1 mb-2"></div>
              </div>

              {/* Answer Input */}
              <input
                ref={el => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={3}
                value={answers[index]}
                onChange={e => handleAnswerChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                className="w-16 h-12 text-xl text-center font-bold text-jungle border-2 border-orange rounded-lg focus:outline-none focus:ring-2 focus:ring-jungle bg-white"
                placeholder="?"
              />
            </div>
          ))}
        </div>

        {/* Submit button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`text-2xl px-16 py-4 rounded-xl font-bold transition-all ${
              allAnswered
                ? 'bg-gradient-to-b from-orange to-orange-dark text-white hover:scale-105 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {allAnswered ? 'SUBMIT' : `Answer all ${16 - answeredCount} remaining`}
          </button>
        </div>
      </div>
    </main>
  );
}
