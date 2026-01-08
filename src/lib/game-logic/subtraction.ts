import type { Problem } from '@/types';

/**
 * Generates a random subtraction problem for 2nd grade level.
 * Guarantees positive results (answer >= 0) and numbers < 20.
 *
 * @returns Problem with num1, num2, and answer where num1 - num2 = answer
 *
 * @example
 * const problem = generateSubtractionProblem();
 * // { num1: 15, num2: 7, answer: 8, operation: 'subtraction' }
 */
export function generateSubtractionProblem(): Problem {
  // Generate num1 first (1-19)
  const num1 = Math.floor(Math.random() * 19) + 1;

  // Generate num2 such that answer >= 0 (num2 can be 0 to num1)
  const num2 = Math.floor(Math.random() * (num1 + 1));

  const answer = num1 - num2;

  return {
    num1,
    num2,
    answer,
    operation: 'subtraction'
  };
}
