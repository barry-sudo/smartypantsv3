---
paths:
- src/lib/supabase/**/*.ts
- src/hooks/**/*.ts
---

# Supabase Query Guidelines

## Organization

All queries in `src/lib/supabase/queries/`:
- `sessions.ts` - Session CRUD
- `attempts.ts` - Problem attempt logging
- `stats.ts` - Analytics queries
- `goals.ts` - Goal management

## Critical Patterns

**✅ DO:**
- Import client from `@/lib/supabase/client` (never create new clients)
- Use types from `@/types` for all query parameters and returns
- Handle errors explicitly (check `error` before using `data`)
- Use `.select().single()` after insert/update to return the row

**❌ DON'T:**
- Put queries directly in components (use query functions or hooks)
- Ignore errors (no silent failures)
- Hardcode user IDs (get from auth or pass as parameter)

## Error Handling

Always check `error` before using `data`. Return `null` or throw on failure - no silent errors.

## RLS Note

RLS policies enforce `user_id` isolation automatically.

## Examples

**See actual query implementations:**
- `src/lib/supabase/queries/sessions.ts` (canonical pattern)
- `src/lib/supabase/queries/stats.ts`
