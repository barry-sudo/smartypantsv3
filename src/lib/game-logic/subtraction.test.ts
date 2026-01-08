import { describe, it, expect } from 'vitest';
import { generateSubtractionProblem } from './subtraction';

describe('generateSubtractionProblem', () => {
  it('always generates positive answers', () => {
    for (let i = 0; i < 1000; i++) {
      const problem = generateSubtractionProblem();
      expect(problem.answer).toBeGreaterThanOrEqual(0);
    }
  });

  it('uses numbers less than 20', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generateSubtractionProblem();
      expect(problem.num1).toBeLessThan(20);
      expect(problem.num2).toBeLessThan(20);
    }
  });

  it('answer equals num1 minus num2', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generateSubtractionProblem();
      expect(problem.num1 - problem.num2).toBe(problem.answer);
    }
  });

  it('returns operation as subtraction', () => {
    const problem = generateSubtractionProblem();
    expect(problem.operation).toBe('subtraction');
  });

  it('generates num1 greater than or equal to num2', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generateSubtractionProblem();
      expect(problem.num1).toBeGreaterThanOrEqual(problem.num2);
    }
  });

  it('generates answer less than 20', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generateSubtractionProblem();
      expect(problem.answer).toBeLessThan(20);
    }
  });

  it('generates problems with different values', () => {
    const problems = Array.from({ length: 20 }, () => generateSubtractionProblem());
    const uniqueProblems = new Set(problems.map(p => `${p.num1}-${p.num2}`));
    // Should generate at least some variety (not all identical)
    expect(uniqueProblems.size).toBeGreaterThan(1);
  });
});
