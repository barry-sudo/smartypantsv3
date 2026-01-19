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

  // Generate 16 problems (duplicates allowed to maintain range constraints)
  // Architectural principle: Range control > uniqueness
  // Keeps sums ≤ 20 for narrow-range pedagogy (e.g., drilling single-digit facts)
  const maxFirstOperand = Math.max(1, 20 - fixedOperand);

  for (let i = 0; i < 16; i++) {
    const num1 = Math.floor(Math.random() * maxFirstOperand) + 1;

    problems.push({
      num1,
      num2: fixedOperand,
      answer: num1 + fixedOperand,
      operation: 'addition'
    });
  }

  return problems;
}
