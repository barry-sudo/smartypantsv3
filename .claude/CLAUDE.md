# Smarty Pants v3

Educational web app for 2nd-grade learning. Built with Next.js 14, React, TypeScript, Tailwind, and Supabase. Features: gamified math/spelling sessions, progress tracking, analytics dashboard, parent-managed reward goals.

**Note:** v3 rebuilds v2 (static HTML) with Next.js + Supabase architecture.

---

## Current Status

**Version:** v3 (Next.js 14 + Supabase + Vercel)
**Last Major Update:** January 16, 2026 - Math Facts Test Mode
**Production URL:** https://smartypantsv3.vercel.app

### Active Features
- ✅ **Math Games (Study Mode):** Addition, Subtraction, Multiplication (25 questions each)
- ✅ **Math Games (Test Mode):** Addition, Subtraction, Multiplication (16 questions each)
- ✅ **Spelling Game:** Word practice with audio pronunciation
- ✅ **Progress Dashboard:** Analytics with Study/Test mode separation
- ✅ **Admin Panel:** Parent goal management (hidden, 3s press + PIN 2018)

### Recent Deployments
- **2026-01-16:** Math Facts Test Mode feature (Phases 1-5)
- **2026-01-10:** Multiplication module with database constraint fix
- **2026-01-09:** UX enhancements (vertical arithmetic, auto-focus, always-visible stopwatch)
- **2026-01-08:** Initial v3 deployment with auth/database fixes

---

## Essential Commands

**Development:**
- `npm run dev` - Start Next.js dev server (localhost:3000)

**Testing:**
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report

**Database:**
- Supabase Cloud (migrations via Dashboard/CLI) - See `docs/api/database-schema.md`

**Build & Deploy:**
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

---

## Project Structure

- `src/app/` - Next.js App Router pages and routes
- `src/components/` - Reusable React components
- `src/lib/` - Business logic (game-logic, supabase, analytics, assets)
- `src/hooks/` - Custom React hooks
- `src/types/` - TypeScript type definitions
- `supabase/migrations/` - Database schema migrations

**See:** `docs/architecture/overview.md` for complete structure and architecture.

---

## Documentation Index

**Context-Specific Rules:**
- Game logic → `.claude/rules/game-logic.md`
- React components → `.claude/rules/react-components.md`
- Database queries → `.claude/rules/supabase-queries.md`
- Next.js routes → `.claude/rules/nextjs-routes.md`
- Testing → `.claude/rules/testing.md`

**Architecture & Design:**
- Overview: `docs/architecture/overview.md`
- Game flow: `docs/architecture/game-flow.md`
- Component patterns: `docs/quick-reference/component-patterns.md`

**Database & API:**
- Schema: `docs/api/database-schema.md`
- Query patterns: `docs/api/supabase-queries.md`

**Migration Reference:**
- v2 HTML code: `docs/migration/html-reference.md`
- Migration checklist: `docs/migration/migration-checklist.md`

**Complete Index:**
- All docs: `docs/INDEX.md`
- Build specs: `docs/build-specs/`
- ADRs: `docs/decisions/`

---

## Critical Conventions

**TypeScript:**
- Strict mode enabled, no `any` types
- Use path alias `@/*` for all imports

**File Organization:**
- Named exports only (no default exports)
- Database queries ONLY via `src/lib/supabase/queries/`
- Pure functions in `src/lib/game-logic/`

**Assets:**
- Never hardcode URLs, use `src/lib/assets.ts`
- All media via Supabase Storage

**See:** `.claude/rules/*.md` for detailed domain-specific conventions.

---

## Migration & Deployment

**Migration:** v3 rebuilds v2 (static HTML → Next.js + Supabase). See `docs/migration/overview.md`

**Production:** https://smartypantsv3.vercel.app - See `DEPLOYMENT-LOG.md` for status.

---

## Test Mode Routes

Math game routes support mode selection:
```
/math/{operation}/           → Mode selection (Study vs Test)
/math/{operation}/study/     → Study Mode (25 questions, gamified)
/math/{operation}/test/      → Test Mode (16 questions, homework-like)
```

**Mode Selection Pages:**
- `src/app/math/addition/page.tsx`
- `src/app/math/subtraction/page.tsx`
- `src/app/math/multiplication/page.tsx`

**Test Mode Components:**
- `src/components/test-mode/NumberSelection.tsx` - Fixed operand selection (1-9)
- `src/components/test-mode/TestGrid.tsx` - 2x8 problem grid
- `src/components/test-mode/TestCompletion.tsx` - Results screen

**Database Tracking:**
- Sessions have `mode` field ('study' | 'test')
- Analytics dashboard separates Study/Test statistics
- Test Mode sessions currently excluded from goal tracking

---

## Quick Reference

**Primary Docs:** `docs/INDEX.md` | **Architecture:** `docs/architecture/overview.md` | **Schema:** `docs/api/database-schema.md`
