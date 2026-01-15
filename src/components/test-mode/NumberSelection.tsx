'use client';

import { useState } from 'react';
import Link from 'next/link';

interface NumberSelectionProps {
  operation: 'addition' | 'subtraction' | 'multiplication';
  onStart: (selectedNumber: number) => void;
}

export function NumberSelection({ operation, onStart }: NumberSelectionProps): JSX.Element {
  const [selectedNumber, setSelectedNumber] = useState<string>('');
  const [isValid, setIsValid] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;

    // Only allow digits 1-9
    if (value === '' || /^[1-9]$/.test(value)) {
      setSelectedNumber(value);
      setIsValid(value !== '' && parseInt(value) >= 1 && parseInt(value) <= 9);
    }
  };

  const handleStart = (): void => {
    if (isValid) {
      onStart(parseInt(selectedNumber));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && isValid) {
      handleStart();
    }
  };

  const operationTitle = operation.charAt(0).toUpperCase() + operation.slice(1);

  return (
    <main className="min-h-screen bg-gradient-to-br from-jungle-dark via-jungle to-jungle-light flex items-center justify-center p-8">
      <div className="bg-white/95 rounded-[30px] p-16 border-[6px] border-orange max-w-xl w-full">
        <h1 className="text-5xl font-bold text-orange text-center mb-4">
          {operationTitle} Test
        </h1>

        <p className="text-2xl text-jungle text-center mb-8">
          Choose your <strong>number</strong> (1-9)
        </p>

        <div className="flex justify-center mb-8">
          <input
            type="text"
            inputMode="numeric"
            pattern="[1-9]"
            maxLength={1}
            value={selectedNumber}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="w-32 h-32 text-7xl text-center font-bold text-jungle border-4 border-orange rounded-2xl focus:outline-none focus:ring-4 focus:ring-jungle bg-white"
            placeholder="?"
            autoFocus
          />
        </div>

        {isValid && (
          <div className="space-y-6">
            <p className="text-xl text-jungle text-center px-4">
              Remember your strategies and press Start to begin - Good Luck!
            </p>

            <button
              onClick={handleStart}
              className="w-full text-3xl px-12 py-6 bg-gradient-to-b from-orange to-orange-dark text-white rounded-xl font-bold hover:scale-105 transition-transform"
            >
              START
            </button>
          </div>
        )}

        <Link
          href={`/math/${operation}`}
          className="block text-xl text-jungle text-center mt-10 hover:text-orange transition-colors"
        >
          ← Back to Mode Selection
        </Link>
      </div>
    </main>
  );
}
