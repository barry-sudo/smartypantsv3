---
paths:
- src/lib/game-logic/**/*.ts
---

# Game Logic Guidelines

## Core Principle: Pure Functions

All game logic must be **pure functions**:
- Same inputs → same outputs (deterministic)
- No side effects (no database, no state mutations, no API calls)
- Easily testable (no mocks needed)

## Critical Patterns

**✅ DO:**
- Return typed `Problem` objects (not arrays/primitives)
- Keep framework-agnostic (no React, no setState)
- Accept config as parameters, return new objects (no mutation)

**❌ DON'T:**
- Include database calls (no Supabase in game logic)
- Mutate inputs or use global state
- Couple to UI components

## Constraints (2nd Grade Level)

- **Addition/Subtraction:** Numbers < 20, results ≥ 0
- **Multiplication:** Times tables 1-12
- **Spelling:** 172-word sight word list, track used words per session

## Testing

Pure functions need no mocks - test directly with property-based assertions.

## Examples

**See:** `src/lib/game-logic/subtraction.ts` (canonical pattern)
