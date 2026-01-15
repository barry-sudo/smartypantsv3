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

/**
 * Generates 16 unique multiplication problems for Test Mode.
 * Fixed operand is always the second factor.
 *
 * @param fixedOperand - The second factor (1-9)
 * @returns Array of 16 unique multiplication problems
 *
 * @example
 * generateMultiplicationTestModeProblems(5) => [
 *   { num1: 1, num2: 5, answer: 5, operation: 'multiplication' },
 *   { num1: 2, num2: 5, answer: 10, operation: 'multiplication' },
 *   ...
 * ]
 */
export function generateMultiplicationTestModeProblems(
  fixedOperand: number
): Problem[] {
  const problems: Problem[] = [];
  const used = new Set<number>();

  // Generate 16 unique problems
  // First factor ranges from 1 to 20
  while (problems.length < 16) {
    const num1 = Math.floor(Math.random() * 20) + 1;

    if (!used.has(num1)) {
      problems.push({
        num1,
        num2: fixedOperand,
        answer: num1 * fixedOperand,
        operation: 'multiplication'
      });
      used.add(num1);
    }
  }

  return problems;
}
