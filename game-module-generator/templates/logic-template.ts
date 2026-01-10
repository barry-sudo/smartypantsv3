import type { Problem } from '@/types';

/**
 * Generates a random {{operation}} problem.
 * {{constraints_description}}
 *
 * @returns Problem with num1, num2, and answer where num1 {{operator}} num2 = answer
 *
 * @example
 * const problem = generate{{OperationPascal}}Problem();
 * // { num1: {{example_num1}}, num2: {{example_num2}}, answer: {{example_answer}}, operation: '{{operation}}' }
 */
export function generate{{OperationPascal}}Problem(): Problem {
  // Generate num1 ({{num1_range_description}})
  const num1 = {{num1_formula}};

  // Generate num2 ({{num2_range_description}})
  const num2 = {{num2_formula}};

  const answer = {{answer_formula}};

  return {
    num1,
    num2,
    answer,
    operation: '{{operation}}'
  };
}
