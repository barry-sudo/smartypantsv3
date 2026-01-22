---
paths:
- src/hooks/**/*.ts
---

# Custom Hooks Guidelines

## Critical Patterns

**✅ DO:**
- Name with `use` prefix (required for React hooks)
- Return object for multiple values (not array - easier to destructure)
- Encapsulate side effects (`useEffect` lives in hooks, not components)
- Call query functions from `@/lib/supabase/queries/` (not Supabase directly)

**❌ DON'T:**
- Call hooks conditionally (violates Rules of Hooks)
- Put business logic in hooks (import from `@/lib/game-logic/`)
- Call Supabase directly (use query functions)

## Data Fetching Pattern

Hooks call query functions from `@/lib/supabase/queries/` and manage state/effects.

## Examples

**See:** `src/hooks/useGameState.ts` (canonical pattern)
