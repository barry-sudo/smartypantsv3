import type { Problem } from '@/types';

/**
 * Generates a random multiplication problem for times tables practice.
 * Uses numbers 1-12 (standard times tables), no zeros.
 *
 * @returns Problem with num1, num2, and answer where num1 * num2 = answer
 *
 * @example
 * const problem = generateMultiplicationProblem();
 * // { num1: 7, num2: 8, answer: 56, operation: 'multiplication' }
 */
export function generateMultiplicationProblem(): Problem {
  // Generate num1 (1-12, no zeros)
  const num1 = Math.floor(Math.random() * 12) + 1;

  // Generate num2 (1-12, no zeros)
  const num2 = Math.floor(Math.random() * 12) + 1;

  const answer = num1 * num2;

  return {
    num1,
    num2,
    answer,
    operation: 'multiplication'
  };
}
