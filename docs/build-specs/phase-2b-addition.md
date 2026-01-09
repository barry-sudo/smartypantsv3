# Build Spec: Phase 2B - Addition Game

**Phase:** 2B
**Feature:** Addition game module
**Complexity:** Simple (follows Phase 2A pattern)
**Estimated Time:** ~2 hours
**Status:** ✅ Complete (Deployed 2026-01-08)

> **Note:** This spec was written during the architecture phase. The actual implementation includes post-launch enhancements: vertical arithmetic layout, always-visible stopwatch timer, auto-focus input, and "← Back to Home" navigation. See `DEPLOYMENT-LOG.md` for details.

---

## Objective

Build addition game module following the exact pattern from Phase 2A (Subtraction). Only difference: problem generator logic.

---

## Prerequisites

- [x] Phase 2A complete (Subtraction game establishes pattern)
- [x] All shared components exist (ImageReveal, Timer, Counter, etc.)
- [x] useGameState hook available

---

## What to Build

### Files to Create

1. `src/lib/game-logic/addition.ts` - Addition problem generator
2. `src/lib/game-logic/addition.test.ts` - 100% test coverage
3. `src/app/math/addition/page.tsx` - Game page (copy from subtraction)

**That's it.** Everything else is reused from Phase 2A.

---

## Problem Generator Specification

**Location:** `src/lib/game-logic/addition.ts`

```typescript
import type { Problem } from '@/types';

/**
 * Generates a random addition problem for 2nd grade level.
 * Uses numbers 1-20, result can be up to 40.
 */
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

**Tests (same pattern as subtraction):**
```typescript
describe('generateAdditionProblem', () => {
  it('uses numbers between 1 and 20', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generateAdditionProblem();
      expect(problem.num1).toBeGreaterThanOrEqual(1);
      expect(problem.num1).toBeLessThanOrEqual(20);
      expect(problem.num2).toBeGreaterThanOrEqual(1);
      expect(problem.num2).toBeLessThanOrEqual(20);
    }
  });
  
  it('answer equals num1 plus num2', () => {
    const problem = generateAdditionProblem();
    expect(problem.num1 + problem.num2).toBe(problem.answer);
  });
  
  it('returns operation as addition', () => {
    const problem = generateAdditionProblem();
    expect(problem.operation).toBe('addition');
  });
});
```

---

## Game Page

**Location:** `src/app/math/addition/page.tsx`

**Implementation:**
1. Copy `src/app/math/subtraction/page.tsx`
2. Change import: `generateSubtractionProblem` → `generateAdditionProblem`
3. Change module: `module: 'subtraction'` → `module: 'addition'`
4. Change problem display: `{num1} - {num2}` → `{num1} + {num2}`
5. Change feedback: `'ROAR!'` → `'AWESOME!'` (optional variation)

**Everything else stays the same** - components, hooks, database queries all work identically.

---

## Success Criteria

### Functional
- [x] Can start addition game
- [x] Problems generate correctly (1-20, correct sums)
- [x] Correct answers show feedback and play audio
- [x] Grid reveals work
- [x] Counter updates
- [x] Celebration plays after 25 correct
- [x] Session logged to database

### Technical
- [x] Problem generator 100% tested
- [x] No code duplication (reuses Phase 2A components)
- [x] Follows same patterns

### Post-Launch Enhancements (2026-01-09)
- [x] Vertical arithmetic layout (worksheet style)
- [x] Auto-focus on answer input
- [x] "← Back to Home" navigation link
- [x] Always-visible stopwatch timer

---

## Estimated Complexity

**Simple** - ~2 hours

**Breakdown:**
- Problem generator + tests: 30 min
- Copy/adapt game page: 30 min
- Testing: 30 min
- Cleanup: 30 min

**Simplified because:** All UI components, hooks, and database logic already exist.

---

## Reference Materials

- **Primary reference:** `src/app/math/subtraction/page.tsx` (copy this)
- Problem generator pattern: `src/lib/game-logic/subtraction.ts`
- Architecture: `docs/architecture/overview.md`

---

## Notes

**This demonstrates the power of the Phase 2A pattern:** Once established, new game modules are quick to add.

**Math selection page:** Update `src/app/math/page.tsx` to include Addition button if not already present.
