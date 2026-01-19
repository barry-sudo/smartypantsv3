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

/**
 * Generates 16 unique subtraction problems for Test Mode.
 * Fixed operand is always the subtrahend (second number).
 * Ensures positive answers (including zero).
 *
 * @param fixedOperand - The subtrahend (1-9)
 * @returns Array of 16 unique subtraction problems
 *
 * @example
 * generateSubtractionTestModeProblems(5) => [
 *   { num1: 8, num2: 5, answer: 3, operation: 'subtraction' },
 *   { num1: 10, num2: 5, answer: 5, operation: 'subtraction' },
 *   ...
 * ]
 */
export function generateSubtractionTestModeProblems(
  fixedOperand: number
): Problem[] {
  const problems: Problem[] = [];

  // Generate 16 problems (duplicates allowed to maintain range constraints)
  // Architectural principle: Range control > uniqueness
  // Minuend ranges from fixedOperand to 20 to ensure non-negative results
  const maxMinuend = 20;

  for (let i = 0; i < 16; i++) {
    const num1 = Math.floor(Math.random() * (maxMinuend - fixedOperand + 1)) + fixedOperand;

    problems.push({
      num1,
      num2: fixedOperand,
      answer: num1 - fixedOperand,
      operation: 'subtraction'
    });
  }

  return problems;
}
