import { describe, it, expect } from 'vitest';
import { generate{{OperationPascal}}Problem } from './{{operation}}';

describe('generate{{OperationPascal}}Problem', () => {
  it('uses num1 within valid range ({{num1_min}}-{{num1_max}})', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generate{{OperationPascal}}Problem();
      expect(problem.num1).toBeGreaterThanOrEqual({{num1_min}});
      expect(problem.num1).toBeLessThanOrEqual({{num1_max}});
    }
  });

  it('uses num2 within valid range ({{num2_min}}-{{num2_max}})', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generate{{OperationPascal}}Problem();
      expect(problem.num2).toBeGreaterThanOrEqual({{num2_min}});
      expect(problem.num2).toBeLessThanOrEqual({{num2_max}});
    }
  });

  it('answer equals num1 {{operator_word}} num2', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generate{{OperationPascal}}Problem();
      expect({{answer_verification}}).toBe(problem.answer);
    }
  });

  it('returns operation as {{operation}}', () => {
    const problem = generate{{OperationPascal}}Problem();
    expect(problem.operation).toBe('{{operation}}');
  });

  {{additional_constraint_tests}}

  it('generates problems with different values', () => {
    const problems = Array.from({ length: 20 }, () => generate{{OperationPascal}}Problem());
    const uniqueProblems = new Set(problems.map(p => `${p.num1}-${p.num2}`));
    // Should generate at least some variety (not all identical)
    expect(uniqueProblems.size).toBeGreaterThan(1);
  });
});
