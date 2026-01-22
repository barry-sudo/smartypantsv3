---
paths:
- src/app/**/*.tsx
- src/app/**/*.ts
---

# Next.js App Router Guidelines

## Route Structure

Each directory with `page.tsx` becomes a route. Use `layout.tsx` only when routes share UI.

## Critical Patterns

**✅ DO:**
- Use Server Components by default (no `'use client'` unless needed)
- Add `'use client'` only for: hooks, state, browser APIs, interactivity
- Use `Link` for navigation, `useRouter` for programmatic navigation
- Export `metadata` for SEO on each page
- Keep database queries in `@/lib/supabase/queries/` (not in page components)

**❌ DON'T:**
- Put Supabase queries directly in page components
- Create empty layouts without shared UI
- Use API routes (Supabase client handles everything)

## Client vs Server Components

- **Client (`'use client'`):** Game pages, forms, audio/timer (needs hooks/events)
- **Server (default):** Landing, selection, static content pages

## Examples

**See:** `src/app/math/subtraction/page.tsx` (canonical game route)
