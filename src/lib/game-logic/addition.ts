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

/**
 * Generates 16 unique addition problems for Test Mode.
 * Fixed operand is always the second addend.
 *
 * @param fixedOperand - The second addend (1-9)
 * @returns Array of 16 unique addition problems
 *
 * @example
 * generateAdditionTestModeProblems(5) => [
 *   { num1: 3, num2: 5, answer: 8, operation: 'addition' },
 *   { num1: 7, num2: 5, answer: 12, operation: 'addition' },
 *   ...
 * ]
 */
export function generateAdditionTestModeProblems(
  fixedOperand: number
): Problem[] {
  const problems: Problem[] = [];
  const used = new Set<number>();

  // Generate 16 unique problems
  // First addend ranges from 1 to (20 - fixedOperand) to keep sums ≤ 20
  const maxFirstOperand = Math.min(20 - fixedOperand, 20);

  while (problems.length < 16) {
    const num1 = Math.floor(Math.random() * maxFirstOperand) + 1;

    if (!used.has(num1)) {
      problems.push({
        num1,
        num2: fixedOperand,
        answer: num1 + fixedOperand,
        operation: 'addition'
      });
      used.add(num1);
    }
  }

  return problems;
}
