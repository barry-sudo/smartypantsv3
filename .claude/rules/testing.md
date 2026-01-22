---
paths:
- src/**/*.test.ts
- src/**/*.test.tsx
---

# Testing Guidelines

## Test Stack

- **Framework**: Vitest (fast, Vite-powered)
- **Component Testing**: React Testing Library + jsdom
- **Commands**: `npm test`, `npm run test:watch`, `npm run test:coverage`

## File Organization

**Co-locate tests with source files:**
```
src/lib/game-logic/
  ├── addition.ts
  └── addition.test.ts          ← Test next to implementation
```
Test file naming: `[filename].test.ts` or `[filename].test.tsx`

## Critical Patterns

**✅ DO:**
- Test behavior, not implementation (test what function does, not how)
- Use Testing Library queries: `getByRole`, `getByText`, `getByLabelText`
- Test pure functions directly without mocks

**❌ DON'T:**
- Mock excessively (only mock: Supabase, browser APIs, heavy deps)
- Use snapshot tests (brittle, don't test behavior)
- Query by test IDs (use accessible queries instead)

## Coverage Expectations

| Priority | Target | Files |
|----------|--------|-------|
| High | 80-100% | `src/lib/game-logic/*.ts`, `src/lib/supabase/queries/*.ts` |
| Medium | 50-80% | `src/hooks/*.ts`, `src/lib/*.ts` |
| Low | Manual | UI components, route pages |

## Examples

**See actual test files for patterns:**
- Pure functions: `src/lib/game-logic/subtraction.test.ts`
- Components: `src/components/game/ImageReveal.test.tsx`
- Hooks: `src/hooks/useGameState.test.ts`
