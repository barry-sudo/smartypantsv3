---
name: Game Module Generator
description: Generate production-ready math game modules for Smarty Pants v3 following the canonical subtraction pattern
version: 1.0.0
license: MIT
---

# Game Module Generator

## What This Skill Does

Generates complete, production-ready math game modules for Smarty Pants v3. Given an operation type and number range, this skill produces:

1. **Logic file** - Pure function problem generator (`{operation}.ts`)
2. **Test file** - Comprehensive test suite with 100% coverage (`{operation}.test.ts`)
3. **Page component** - Next.js game page (`src/app/math/{operation}/page.tsx`)

All generated code follows the canonical subtraction pattern exactly, ensuring zero architectural drift.

---

## When to Use This Skill

Use this skill when you need to add a new math operation game to Smarty Pants v3:
- Multiplication
- Division
- Modulo
- Any arithmetic operation that follows the pattern: two numbers → one answer

**Do NOT use for:**
- Spelling games (different pattern)
- Multi-step problems
- Non-arithmetic games

---

## Required Input Parameters

Before generating, gather these parameters:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `operation` | The math operation name (lowercase) | `multiplication` |
| `operationPascal` | PascalCase version | `Multiplication` |
| `operator` | The math symbol | `×` (or `*`) |
| `num1Range` | Range for first number | `{ min: 1, max: 12 }` |
| `num2Range` | Range for second number | `{ min: 1, max: 12 }` |
| `constraints` | Special rules | `"no zeros"`, `"num1 >= num2"` |
| `displayName` | UI display text | `"Multiplication"` |

---

## Step-by-Step Generation Process

### Step 1: Study the Canonical Pattern

Read the example files in `resources/examples/`:
- `subtraction.ts` - Logic pattern
- `subtraction.test.ts` - Test pattern
- `subtraction-page.tsx` - Component pattern

### Step 2: Generate Logic File

Create `{operation}.ts` following this structure:

```typescript
import type { Problem } from '@/types';

/**
 * Generates a random {{operation}} problem.
 * {{constraints_description}}
 *
 * @returns Problem with num1, num2, and answer where num1 {{operator}} num2 = answer
 *
 * @example
 * const problem = generate{{OperationPascal}}Problem();
 * // { num1: 7, num2: 3, answer: {{example_answer}}, operation: '{{operation}}' }
 */
export function generate{{OperationPascal}}Problem(): Problem {
  // {{num1_generation_logic}}
  const num1 = {{num1_formula}};

  // {{num2_generation_logic}}
  const num2 = {{num2_formula}};

  const answer = {{answer_formula}};

  return {
    num1,
    num2,
    answer,
    operation: '{{operation}}'
  };
}
```

### Step 3: Generate Test File

Create `{operation}.test.ts` with these required test cases:

1. **Range validation** - Numbers within specified ranges
2. **Answer correctness** - Mathematical accuracy
3. **Operation type** - Returns correct operation string
4. **Constraints** - Enforces any special rules (no zeros, etc.)
5. **Edge cases** - Boundary conditions
6. **Variety** - Generates different problems

### Step 4: Generate Page Component

Create `src/app/math/{operation}/page.tsx` by:

1. Copy the subtraction page structure exactly
2. Replace all occurrences:
   - `subtraction` → `{operation}`
   - `Subtraction` → `{OperationPascal}`
   - `-` operator → `{operator}`
   - Import path → `@/lib/game-logic/{operation}`

### Step 5: Document Integration Steps

Create `INTEGRATION-STEPS.md` with file placement and config updates.

---

## Output Structure

```
Generated files:
├── {operation}.ts              → Place in src/lib/game-logic/
├── {operation}.test.ts         → Place in src/lib/game-logic/
├── page.tsx                    → Place in src/app/math/{operation}/
├── SKILL-DOCUMENTATION.md      → Keep for reference
└── INTEGRATION-STEPS.md        → Follow to complete integration
```

---

## Critical Pattern Rules

### Logic File Rules
- **Pure function** - No side effects, no external dependencies except types
- **Single responsibility** - Only generates one problem
- **Type safety** - Returns `Problem` interface exactly
- **Randomness** - Use `Math.random()` with `Math.floor()`

### Test File Rules
- **100% coverage** - Every code path tested
- **Loop testing** - Run 100+ iterations for random functions
- **Edge cases** - Test min/max values
- **Variety check** - Ensure randomness produces different results

### Page Component Rules
- **Exact structure** - Match subtraction page layout
- **Same imports** - Use all shared components
- **Same hooks** - `useAuth`, `useGameState`, `useTimer`
- **Same UI** - Two-panel layout, vertical arithmetic, feedback messages

---

## Template Variables Reference

When generating, replace these placeholders:

| Placeholder | Description |
|-------------|-------------|
| `{{operation}}` | Lowercase operation name |
| `{{OperationPascal}}` | PascalCase operation name |
| `{{operator}}` | Math symbol (-, +, ×, ÷) |
| `{{num1_formula}}` | Code to generate num1 |
| `{{num2_formula}}` | Code to generate num2 |
| `{{answer_formula}}` | Code to calculate answer |
| `{{problem_string}}` | Format: `${num1} {{operator}} ${num2}` |

---

## Example: Multiplication Generation

**Input:**
- Operation: multiplication
- Range: 1-12 for both numbers
- Constraints: No zeros

**Generated Logic:**
```typescript
export function generateMultiplicationProblem(): Problem {
  const num1 = Math.floor(Math.random() * 12) + 1; // 1-12
  const num2 = Math.floor(Math.random() * 12) + 1; // 1-12
  const answer = num1 * num2;
  return { num1, num2, answer, operation: 'multiplication' };
}
```

**Problem String Format:**
```typescript
`${currentProblem.num1} × ${currentProblem.num2}`
```

---

## Quality Checklist

Before delivering generated files, verify:

- [ ] Logic file compiles with no TypeScript errors
- [ ] All tests pass on first run
- [ ] Test coverage is 100%
- [ ] Page component matches subtraction pattern exactly
- [ ] All imports are correct
- [ ] Problem type added to `src/types/index.ts` union (in integration steps)
- [ ] Module added to `GameModule` type (in integration steps)

---

## Related Files

**Templates:**
- `templates/logic-template.ts`
- `templates/test-template.ts`
- `templates/page-template.tsx`

**Examples:**
- `resources/examples/subtraction.ts`
- `resources/examples/subtraction.test.ts`
- `resources/examples/subtraction-page.tsx`

**Codebase References:**
- `src/types/index.ts` - Type definitions
- `src/hooks/useGameState.ts` - Session hook
- `src/components/game/` - Shared components
