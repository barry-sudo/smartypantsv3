'use client';

import { useState, useRef, useEffect } from 'react';
import { validateLetter } from '@/lib/game-logic/spelling';

export interface LetterBoxesProps {
  wordLength: number;
  correctWord: string;
  onComplete: () => void;
}

/**
 * LetterBoxes component for spelling game
 * Displays individual input boxes for each letter with auto-advance functionality
 *
 * Features:
 * - Auto-focus on first box
 * - Auto-advance to next box on correct letter
 * - Shake animation on incorrect letter
 * - Disabled state for completed letters
 * - Uppercase display of letters
 */
export function LetterBoxes({ wordLength, correctWord, onComplete }: LetterBoxesProps) {
  const [values, setValues] = useState<string[]>(Array(wordLength).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first box on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Reset when word changes
  useEffect(() => {
    setValues(Array(wordLength).fill(''));
    inputRefs.current[0]?.focus();
  }, [wordLength, correctWord]);

  const handleInput = (index: number, value: string): void => {
    if (!value) return; // Ignore empty input

    const letter = value.toLowerCase();

    if (validateLetter(letter, correctWord, index)) {
      // Correct letter
      const newValues = [...values];
      newValues[index] = letter;
      setValues(newValues);

      if (index < wordLength - 1) {
        // Move to next box
        inputRefs.current[index + 1]?.focus();
      } else {
        // Word complete!
        onComplete();
      }
    } else {
      // Incorrect letter - shake and clear
      const input = inputRefs.current[index];
      if (input) {
        input.classList.add('animate-shake');
        setTimeout(() => {
          input.classList.remove('animate-shake');
          input.value = '';
        }, 300);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    // Handle backspace to go to previous box
    if (e.key === 'Backspace' && index > 0 && !values[index]) {
      e.preventDefault();
      const newValues = [...values];
      newValues[index - 1] = '';
      setValues(newValues);
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-4 justify-center flex-wrap">
      {Array.from({ length: wordLength }, (_, i) => (
        <input
          key={i}
          ref={el => { inputRefs.current[i] = el; }}
          type="text"
          maxLength={1}
          className="w-20 h-20 text-4xl text-center border-4 border-jungle rounded-xl uppercase bg-cream focus:outline-none focus:ring-4 focus:ring-orange disabled:bg-green-100 disabled:border-jungle-dark"
          value={values[i]}
          onChange={(e) => handleInput(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          disabled={values[i] !== ''}
          autoFocus={i === 0}
        />
      ))}
    </div>
  );
}
