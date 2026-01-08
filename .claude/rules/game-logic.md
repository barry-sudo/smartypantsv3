---
paths:
- src/lib/game-logic/**/*.ts
---

# Game Logic Guidelines

## Pure Functions Only

All game logic must be pure functions (deterministic, no side effects):

```typescript
// ✅ Good - pure function
export function generateSubtractionProblem(): Problem {
  const answer = Math.floor(Math.random() * 20);
  const addAmount = Math.floor(Math.random() * (19 - answer)) + 1;
  return {
    num1: answer + addAmount,
    num2: addAmount,
    answer: answer
  };
}

// ❌ Bad - side effects
export function generateProblem(): Problem {
  saveToDatabase(); // Side effect!
  updateUI(); // Side effect!
  return problem;
}
```

## File Organization

```
src/lib/game-logic/
├── subtraction.ts       # Subtraction problem generation
├── addition.ts          # Addition problem generation
├── spelling.ts          # Word selection logic
└── scoring.ts           # Score calculation utilities
```

One file per game module, plus shared utilities.

## Problem Generation Pattern

```typescript
interface Problem {
  num1: number;
  num2: number;
  answer: number;
  operation: 'addition' | 'subtraction';
}

export function generateAdditionProblem(): Problem {
  const num1 = Math.floor(Math.random() * 20) + 1; // 1-20
  const num2 = Math.floor(Math.random() * 20) + 1; // 1-20
  
  return {
    num1,
    num2,
    answer: num1 + num2,
    operation: 'addition'
  };
}
```

## Constraints

**Math problems:**
- All numbers < 20 (2nd grade level)
- Subtraction results must be ≥ 0 (no negative numbers)
- Generate answer first, then work backwards for subtraction

**Spelling:**
- 172-word sight word list (no single-letter words)
- Track used words to avoid repetition within session
- Random selection from available pool

## Testing Requirements

Game logic requires 100% test coverage. Every function must have:

1. **Happy path test** - Normal inputs work correctly
2. **Edge case tests** - Boundaries (0, 19, etc.)
3. **Property tests** - Invariants hold (subtraction always positive)

```typescript
// src/lib/game-logic/subtraction.test.ts
describe('generateSubtractionProblem', () => {
  it('generates problems with positive answers', () => {
    for (let i = 0; i < 1000; i++) {
      const problem = generateSubtractionProblem();
      expect(problem.answer).toBeGreaterThanOrEqual(0);
    }
  });
  
  it('uses numbers less than 20', () => {
    const problem = generateSubtractionProblem();
    expect(problem.num1).toBeLessThan(20);
    expect(problem.num2).toBeLessThan(20);
  });
  
  it('answer equals num1 minus num2', () => {
    const problem = generateSubtractionProblem();
    expect(problem.num1 - problem.num2).toBe(problem.answer);
  });
});
```

## Scoring and Analytics

Calculation functions also pure:

```typescript
export function calculateAccuracy(
  correctCount: number,
  totalAttempts: number
): number {
  if (totalAttempts === 0) return 0;
  return (correctCount / totalAttempts) * 100;
}

export function calculateFirstTryAccuracy(
  attempts: ProblemAttempt[]
): number {
  const firstTries = attempts.filter(a => a.attempt_number === 1);
  const correct = firstTries.filter(a => a.correct).length;
  return (correct / firstTries.length) * 100;
}
```

## No Direct Database Access

Game logic never touches database:

```typescript
// ❌ Bad - database in logic
export function generateProblem() {
  const problem = { /* ... */ };
  await supabase.insert(problem); // NO!
  return problem;
}

// ✅ Good - pure function
export function generateProblem() {
  return { /* ... */ };
}

// Database logic happens in hooks/components
```

## Adaptive Difficulty (Future)

Structure for future adaptive difficulty:

```typescript
export function generateProblem(
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Problem {
  const maxNumber = difficulty === 'easy' ? 10 
                  : difficulty === 'medium' ? 20 
                  : 30;
  // Use maxNumber in generation
}
```

Not implemented in MVP, but structure supports it.

## Documentation

Every exported function needs JSDoc:

```typescript
/**
 * Generates a random subtraction problem for 2nd grade level.
 * Guarantees positive results (answer >= 0) and numbers < 20.
 * 
 * @returns Problem with num1, num2, and answer where num1 - num2 = answer
 * 
 * @example
 * const problem = generateSubtractionProblem();
 * // { num1: 15, num2: 7, answer: 8 }
 */
export function generateSubtractionProblem(): Problem {
  // Implementation
}
```
