'use client';

import React from 'react';

interface Problem {
  num1: number;
  num2: number;
  answer: number;
  operation: 'addition' | 'subtraction' | 'multiplication';
}

interface IncorrectProblemsListProps {
  problems: Problem[];
  userAnswers: string[];
  operation: 'addition' | 'subtraction' | 'multiplication';
}

function getOperationSymbol(operation: string): string {
  switch (operation) {
    case 'addition': return '+';
    case 'subtraction': return '−';
    case 'multiplication': return '×';
    default: return '+';
  }
}

export default function IncorrectProblemsList({
  problems,
  userAnswers,
  operation
}: IncorrectProblemsListProps) {
  // Filter to get incorrect problems (max 6)
  const incorrectProblems = problems
    .map((problem, index) => ({
      problem,
      userAnswer: userAnswers[index] || '',
      index
    }))
    .filter(({ problem, userAnswer }) => {
      const userNum = parseInt(userAnswer);
      return isNaN(userNum) || userNum !== problem.answer;
    })
    .slice(0, 6); // Max 6 incorrect problems

  if (incorrectProblems.length === 0) {
    return null;
  }

  const symbol = getOperationSymbol(operation);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold text-jungle-dark text-center mb-2">
        Review Your Mistakes
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {incorrectProblems.map(({ problem, userAnswer, index }) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 shadow-md border-2 border-jungle"
          >
            {/* Problem Display */}
            <div className="text-center mb-3">
              <div className="text-2xl font-bold text-jungle-dark">
                {problem.num1}
              </div>
              <div className="text-2xl font-bold text-jungle-dark">
                {symbol} {problem.num2}
              </div>
              <div className="border-t-2 border-jungle-dark mt-1 mb-2"></div>
            </div>

            {/* Answers Comparison */}
            <div className="grid grid-cols-2 gap-2 text-center">
              {/* User's Answer */}
              <div>
                <div className="text-sm text-gray-600 mb-1">Your answer</div>
                <div className="text-xl font-bold text-red-600 bg-red-50 rounded p-2">
                  {userAnswer || '—'}
                </div>
              </div>

              {/* Correct Answer */}
              <div>
                <div className="text-sm font-bold mb-1" style={{ color: '#d4af37' }}>
                  Correct answer
                </div>
                <div className="text-xl font-bold bg-green-50 rounded p-2" style={{ color: '#d4af37' }}>
                  {problem.answer}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
