import type { Problem } from '@/types';

/**
 * Generates a random addition problem for 2nd grade level.
 * Guarantees sum < 20 and all numbers are positive.
 *
 * @returns Problem with num1, num2, and answer where num1 + num2 = answer
 *
 * @example
 * const problem = generateAdditionProblem();
 * // { num1: 7, num2: 8, answer: 15, operation: 'addition' }
 */
export function generateAdditionProblem(): Problem {
  // Generate num1 first (1-18 to leave room for num2)
  const num1 = Math.floor(Math.random() * 18) + 1;

  // Generate num2 such that sum < 20
  const maxNum2 = 19 - num1;
  const num2 = Math.floor(Math.random() * maxNum2) + 1;

  const answer = num1 + num2;

  return {
    num1,
    num2,
    answer,
    operation: 'addition'
  };
}
