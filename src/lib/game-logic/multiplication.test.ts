import { describe, it, expect } from 'vitest';
import { generateMultiplicationProblem } from './multiplication';

describe('generateMultiplicationProblem', () => {
  it('uses num1 within valid range (1-12)', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generateMultiplicationProblem();
      expect(problem.num1).toBeGreaterThanOrEqual(1);
      expect(problem.num1).toBeLessThanOrEqual(12);
    }
  });

  it('uses num2 within valid range (1-12)', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generateMultiplicationProblem();
      expect(problem.num2).toBeGreaterThanOrEqual(1);
      expect(problem.num2).toBeLessThanOrEqual(12);
    }
  });

  it('never generates zero for num1', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generateMultiplicationProblem();
      expect(problem.num1).not.toBe(0);
    }
  });

  it('never generates zero for num2', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generateMultiplicationProblem();
      expect(problem.num2).not.toBe(0);
    }
  });

  it('answer equals num1 times num2', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generateMultiplicationProblem();
      expect(problem.num1 * problem.num2).toBe(problem.answer);
    }
  });

  it('returns operation as multiplication', () => {
    const problem = generateMultiplicationProblem();
    expect(problem.operation).toBe('multiplication');
  });

  it('generates answers within expected range (1-144)', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generateMultiplicationProblem();
      expect(problem.answer).toBeGreaterThanOrEqual(1);
      expect(problem.answer).toBeLessThanOrEqual(144);
    }
  });

  it('generates problems with different values', () => {
    const problems = Array.from({ length: 20 }, () => generateMultiplicationProblem());
    const uniqueProblems = new Set(problems.map(p => `${p.num1}-${p.num2}`));
    // Should generate at least some variety (not all identical)
    expect(uniqueProblems.size).toBeGreaterThan(1);
  });
});
