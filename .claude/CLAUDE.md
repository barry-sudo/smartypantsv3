# Smarty Pants v3

Educational web application for 2nd-grade learning (math and spelling modules). Built with Next.js 14 (App Router, React, TypeScript, Tailwind CSS) and Supabase (PostgreSQL database, Storage, Authentication). Features gamified learning sessions with progress tracking, analytics dashboard, and parent-managed reward goals.

**Migration:** v3 rebuilds v2 (static HTML/JavaScript/localStorage) into production architecture with proper database persistence, component architecture, and maintainable patterns.

---

## Essential Commands

**Development:**
- `npm run dev` - Start Next.js dev server (localhost:3000)
- `npm run db:start` - Start local Supabase (if using local development)
- `npm run db:reset` - Reset local database to migrations

**Testing:**
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report

**Database:**
- `npm run db:migrate` - Run pending migrations
- `npm run db:generate` - Generate migration from schema changes
- `npm run db:seed` - Seed database with test data

**Build & Deploy:**
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

---

## Project Structure

```
smarty-pants-v3/
├── .claude/                      # Claude Code documentation
│   ├── CLAUDE.md                 # This file
│   └── rules/                    # Context-specific rules
├── docs/                         # Detailed documentation
├── src/
│   ├── app/                      # Next.js 14 App Router pages
│   │   ├── page.tsx              # Landing page
│   │   ├── progress/             # Analytics dashboard
│   │   ├── admin/                # Parent goal management
│   │   ├── math/
│   │   │   ├── page.tsx          # Math module selection
│   │   │   ├── addition/         # Addition game
│   │   │   └── subtraction/      # Subtraction game
│   │   └── spelling/             # Spelling game
│   ├── components/               # React components
│   │   ├── game/                 # Game UI (ImageReveal, Timer, etc.)
│   │   ├── dashboard/            # Dashboard components
│   │   └── admin/                # Admin panel components
│   ├── lib/                      # Core application logic
│   │   ├── game-logic/           # Problem generators (pure functions)
│   │   ├── analytics/            # Calculations and statistics
│   │   ├── supabase/             # Database client and queries
│   │   └── assets.ts             # Asset manifest (Supabase URLs)
│   ├── hooks/                    # Custom React hooks
│   │   ├── useGameState.ts       # Game session management
│   │   ├── useTimer.ts           # Timer functionality
│   │   └── useStats.ts           # Statistics queries
│   └── types/                    # TypeScript type definitions
├── supabase/
│   └── migrations/               # Database migrations
└── public/                       # Static assets (minimal)
```

---

## Documentation Index

**When starting development:**
- Setup guide: `docs/build-specs/phase-0-setup.md`
- Architecture overview: `docs/architecture/overview.md`

**When working on game modules:**
- Game flow architecture: `docs/architecture/game-flow.md`
- Problem generation patterns: `docs/quick-reference/component-patterns.md`
- See rules: `.claude/rules/game-logic.md`

**When working on React components:**
- Component patterns: `docs/quick-reference/component-patterns.md`
- Design system (colors, fonts, layout): `docs/architecture/overview.md` (Design section)
- See rules: `.claude/rules/react-components.md`

**When working with database:**
- Complete schema: `docs/api/database-schema.md`
- Query patterns: `docs/api/supabase-queries.md`
- See rules: `.claude/rules/supabase-queries.md`

**When working on Next.js routes:**
- Routing conventions: `docs/architecture/overview.md` (Routing section)
- See rules: `.claude/rules/nextjs-routes.md`

**When writing tests:**
- Testing strategy: `docs/architecture/overview.md` (Testing section)
- See rules: `.claude/rules/testing.md`

**When debugging:**
- Migration reference (old HTML code): `docs/migration/html-reference.md`
- Common patterns from v2: `docs/migration/migration-checklist.md`

**For complete project context:**
- All architectural decisions: `docs/decisions/` (ADR-001, ADR-002, etc.)
- All build specifications: `docs/build-specs/` (phase-1, phase-2a, etc.)
- Complete documentation index: `docs/INDEX.md`

---

## Critical Conventions

**TypeScript:**
- Strict mode enabled (no `any` types ever - use `unknown` if truly unknown)
- Explicit return types on all exported functions
- Interfaces for component props (no inline types)

**File Naming:**
- Components: PascalCase (`ImageReveal.tsx`, `Timer.tsx`)
- Utilities/logic: kebab-case (`problem-generator.ts`, `time-utils.ts`)
- Test files: Same name as file + `.test.ts` or `.test.tsx`

**Exports:**
- Named exports only (no default exports anywhere)
- Export from index.ts files for clean imports

**Database:**
- All queries through `src/lib/supabase/queries/` (no raw SQL in components)
- Use Supabase client from `src/lib/supabase/client.ts`
- Handle errors explicitly (never silent failures)

**State Management:**
- Local state: `useState` for component-only state
- Shared state: Custom hooks in `src/hooks/`
- Server state: React Query patterns (if added later)

**Game Logic:**
- Pure functions in `src/lib/game-logic/`
- Fully tested (100% coverage expected)
- No side effects (deterministic, testable)

**Assets:**
- All images/audio/video via Supabase Storage
- URLs defined in `src/lib/assets.ts`
- Never hardcode asset URLs in components

**Code Quality:**
- No `console.log` in committed code (use proper logging if needed)
- No commented-out code (use git history)
- Meaningful variable names (no single letters except loop counters)

---

## Important File Patterns

**Canonical game module:**
- First to be built: `src/app/math/subtraction/page.tsx`
- Demonstrates: Game loop, ImageReveal, Timer, database logging
- Pattern to follow for Addition and Spelling

**Canonical game logic:**
- Example: `src/lib/game-logic/subtraction.ts`
- Pure function, fully tested, documented

**Canonical component:**
- TBD - will document when first shared component is created
- Location: `src/components/game/[ComponentName].tsx`

**Canonical hook:**
- Example: `src/hooks/useGameState.ts`
- Demonstrates: Session management, database integration, state handling

**Canonical database query:**
- Example: `src/lib/supabase/queries/sessions.ts`
- Demonstrates: Error handling, type safety, query patterns

**Canonical test:**
- Unit test: `src/lib/game-logic/subtraction.test.ts`
- Component test: TBD (will document with first component test)

---

## Migration Notes

This is v3, a complete rebuild of v2 (static HTML). Key changes:

**Architecture:**
- HTML files → Next.js pages and components
- Inline JavaScript → TypeScript with type safety
- localStorage → Supabase PostgreSQL (persistent, reliable)
- Duplicate code → Shared components (DRY)

**Fixed Issues from v2:**
- Timer bugs → React hooks with proper lifecycle
- Inconsistent stats → Database-backed analytics
- No progress tracking → Complete dashboard with trends
- Manual goal tracking → Automated system with parent admin

**Preserved from v2:**
- 5x5 grid reveal system (excellent UX)
- Audio feedback patterns (tiger roar, word pronunciation)
- Jungle theme design (green/orange color palette)
- 25-question session structure

**Reference:**
- Old HTML code: `docs/migration/html-reference.md`
- Migration checklist: `docs/migration/migration-checklist.md`

---

## Build Phase Status

Legend: ✅ Complete | 🚧 In Progress | ⏳ Planned | ❌ Not Started

**Foundation:**
- ✅ Phase 0: Supabase setup + asset upload
- ✅ Phase 1: Next.js scaffold + database + auth

**Game Modules:**
- ✅ Phase 2A: Subtraction game
- ✅ Phase 2B: Addition game
- ✅ Phase 2C: Spelling game (with write prompt)
- ✅ Phase 2D: Multiplication game (times tables 1-12)

**Features:**
- ✅ Phase 3: Progress Dashboard
- ✅ Phase 4: Admin Panel + Goals
- ✅ Phase 5: Polish + Deploy

**Production URL:** https://smartypantsv3.vercel.app

**Post-Launch Enhancements:** See `DEPLOYMENT-LOG.md` for UX improvements (2026-01-09) and multiplication module (2026-01-10)

**Detailed specs:** See `docs/build-specs/` for each phase

---

## Quick Links

- Architecture overview: `docs/architecture/overview.md`
- Database schema: `docs/api/database-schema.md`
- All documentation: `docs/INDEX.md`
- Build specifications: `docs/build-specs/`
- How to use this system: `_ARCHITECTURE-PROTOCOL.md`
