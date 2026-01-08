import { describe, it, expect } from 'vitest';
import { generateAdditionProblem } from './addition';

describe('generateAdditionProblem', () => {
  it('always generates sums less than 20', () => {
    for (let i = 0; i < 1000; i++) {
      const problem = generateAdditionProblem();
      expect(problem.answer).toBeLessThan(20);
    }
  });

  it('uses positive numbers', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generateAdditionProblem();
      expect(problem.num1).toBeGreaterThan(0);
      expect(problem.num2).toBeGreaterThan(0);
    }
  });

  it('uses numbers less than 20', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generateAdditionProblem();
      expect(problem.num1).toBeLessThan(20);
      expect(problem.num2).toBeLessThan(20);
    }
  });

  it('answer equals num1 plus num2', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generateAdditionProblem();
      expect(problem.num1 + problem.num2).toBe(problem.answer);
    }
  });

  it('returns operation as addition', () => {
    const problem = generateAdditionProblem();
    expect(problem.operation).toBe('addition');
  });

  it('generates answer greater than 1', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generateAdditionProblem();
      expect(problem.answer).toBeGreaterThan(1);
    }
  });

  it('generates problems with different values', () => {
    const problems = Array.from({ length: 20 }, () => generateAdditionProblem());
    const uniqueProblems = new Set(problems.map(p => `${p.num1}+${p.num2}`));
    // Should generate at least some variety (not all identical)
    expect(uniqueProblems.size).toBeGreaterThan(1);
  });
});
