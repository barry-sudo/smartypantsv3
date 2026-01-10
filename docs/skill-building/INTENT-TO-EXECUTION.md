# Intent to Execution: PRD to Implementation Mapping

**Project:** Smarty Pants v3
**Created:** 2026-01-09
**Purpose:** Trace architectural intent (PRD) to actual execution (codebase)

---

## Document Overview

This document maps the Product Requirements Document (PRD) to the actual implementation, demonstrating the pattern of **Intent → Decision → Execution** for each major system component.

**How to read this document:**
- **Intent** = What the PRD specified
- **Decision** = Architectural choices made (referencing ADRs where applicable)
- **Execution** = Actual file structure and patterns implemented

---

## 1. Product Vision

### Intent (PRD Section 1)

> "Smarty Pants v3 is a comprehensive educational web application designed to help second-grade students improve their math and spelling skills through gamified learning experiences."

**Key personas:**
- **Sarah** (7-year-old user): Needs engaging, rewarding gameplay
- **Parent**: Needs progress visibility and goal management
- **Developer**: Needs maintainable, testable architecture

### Execution

The vision materialized into a three-tier architecture:

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (Next.js 14 App Router)                           │
│  - Child-facing: Game modules with jungle theme             │
│  - Parent-facing: Admin panel (hidden access)               │
│  - Analytics: Progress dashboard                            │
├─────────────────────────────────────────────────────────────┤
│  Backend (Supabase)                                         │
│  - PostgreSQL: Sessions, attempts, goals                    │
│  - Storage: Images, audio, video (CDN-delivered)            │
│  - Auth: Simple email/password (MVP: single hardcoded user) │
├─────────────────────────────────────────────────────────────┤
│  Deployment (Vercel + Supabase Cloud)                       │
│  - Zero-ops managed infrastructure                          │
│  - Auto-deploy on push to main                              │
└─────────────────────────────────────────────────────────────┘
```

**Production URL:** https://smartypantsv3.vercel.app

---

## 2. Functional Requirements Mapping

### FR-1: Math Games

#### Intent (PRD)

> "The application shall provide arithmetic practice through engaging, gamified math games."
> - Addition and subtraction modules
> - Numbers 1-20 for 2nd grade level
> - 25 questions per session
> - Visual feedback with image reveal

#### Decision: Pure Function Problem Generation

Math logic is implemented as pure functions with no side effects, enabling 100% test coverage:

```typescript
// Pattern: Pure function, deterministic output, fully testable
export function generateSubtractionProblem(): Problem {
  const num1 = Math.floor(Math.random() * 19) + 1;
  const num2 = Math.floor(Math.random() * (num1 + 1));
  return { num1, num2, answer: num1 - num2, operation: 'subtraction' };
}
```

#### Execution: File Structure

```
src/lib/game-logic/
├── addition.ts          # generateAdditionProblem()
├── addition.test.ts     # 100% coverage
├── subtraction.ts       # generateSubtractionProblem()
└── subtraction.test.ts  # 100% coverage

src/app/math/
├── page.tsx             # Module selection (Addition / Subtraction)
├── addition/
│   └── page.tsx         # Addition game (follows subtraction pattern)
└── subtraction/
    └── page.tsx         # Canonical game implementation
```

**Key pattern:** Subtraction was built first as the canonical pattern. Addition copies the pattern with only the problem generator changed.

---

### FR-2: Spelling Game

#### Intent (PRD)

> "The application shall provide spelling practice using audio pronunciation and letter-by-letter input."
> - 172 sight words for 2nd grade
> - Audio pronunciation on demand
> - Individual letter input boxes with auto-advance
> - No word repetition within session

#### Decision: Separate Word List Module

The 172-word list is maintained as a standalone module for easy updates:

```typescript
// Immutable word list, sourced from v2 spelling.html
export const WORD_LIST = [
  "and", "away", "big", "blue", /* ... 172 total */
] as const;
```

#### Execution: File Structure

```
src/lib/game-logic/
├── spelling.ts          # selectRandomWord(usedWords)
├── spelling.test.ts     # Tests randomization, no-repeat
└── word-list.ts         # 172 sight words

src/components/game/
└── LetterBoxes.tsx      # Auto-advance letter inputs

src/app/spelling/
└── page.tsx             # Spelling game with write prompt
```

**Deviation from PRD:** Added "write prompt" step after each correct word (handwriting practice). Timer pauses during this phase.

---

### FR-3: Image Reveal System

#### Intent (PRD)

> "A 5x5 grid system progressively reveals a mystery image as the child answers correctly."
> - 25 cells total (one per correct answer)
> - Random cell reveal order
> - Smooth fade transition

#### Decision: CSS Grid with Opacity Animation

No JavaScript animation library needed. CSS handles transitions:

```typescript
// Pattern: State-driven reveal with CSS transitions
<div className={`
  transition-opacity duration-700
  ${revealedCells.has(i) ? 'opacity-0' : 'opacity-100'}
`} />
```

#### Execution: Component

```
src/components/game/
└── ImageReveal.tsx      # 5x5 grid overlay system
    └── ImageReveal.test.tsx
```

**Pattern:** Component receives `revealedCount` prop. Internally tracks which cells are revealed to ensure random selection.

---

### FR-4: Session Tracking

#### Intent (PRD)

> "Track all game sessions with accuracy, duration, and attempt details for analytics."
> - Session-level metrics (start, end, accuracy)
> - Problem-level attempts (for detailed analysis)
> - Database persistence (not localStorage)

#### Decision: Hook-Based State Management

Game state is managed by a custom hook that handles both local state and database sync:

```typescript
// Pattern: Hook manages session lifecycle
export function useGameState({ module, userId }): UseGameStateReturn {
  // Creates session on mount
  // Provides submitAnswer() for each problem
  // Provides completeSession() for session end
}
```

#### Execution: Database Schema

```sql
-- Sessions table (25 questions per session)
sessions (
  id, user_id, module,
  started_at, completed_at, duration_seconds,
  correct_count, total_attempts, completed
)

-- Individual problem attempts
problem_attempts (
  id, session_id,
  problem, expected_answer, user_answer,
  correct, attempt_number, timestamp
)
```

#### Execution: File Structure

```
src/hooks/
└── useGameState.ts      # Session lifecycle management

src/lib/supabase/queries/
├── sessions.ts          # createSession, updateSession
└── attempts.ts          # logAttempt
```

---

### FR-5: Goal System

#### Intent (PRD)

> "Parents can create reward goals with session requirements and optional accuracy thresholds."
> - Prize image upload
> - Sessions required count
> - Optional minimum accuracy
> - Module filtering (specific game or all)

#### Decision: Database View for Progress Calculation

Progress toward goals is computed via SQL view, not client-side:

```sql
-- Computed view for efficient progress queries
CREATE VIEW goal_progress AS
SELECT
  g.id, g.title, g.sessions_required,
  COUNT(s.id) FILTER (WHERE s.completed) AS sessions_completed,
  AVG(...) AS avg_accuracy,
  (sessions >= required AND accuracy >= min) AS goal_achieved
FROM goals g LEFT JOIN sessions s ON ...
```

#### Execution: File Structure

```
src/lib/supabase/queries/
└── goals.ts             # createGoal, updateGoal, getGoalProgress

src/components/admin/
├── GoalForm.tsx         # Create/edit goal form
└── GoalList.tsx         # Display active/achieved goals

src/components/dashboard/
└── GoalProgress.tsx     # Progress visualization

src/app/admin/
├── layout.tsx           # Admin layout with auth gate
└── page.tsx             # Goal management panel
```

**Access pattern:** Admin is hidden. Access via 3-second press on logo, then PIN: 2018.

---

## 3. Technical Architecture Mapping

### Stack Selection

#### Intent (PRD Section 4)

> "Modern JAMstack architecture with managed services for zero-ops deployment."

#### Decision: ADR-001

| Technology | Rationale |
|------------|-----------|
| Next.js 14 | App Router, React Server Components, TypeScript |
| Supabase | PostgreSQL, Auth, Storage in single service |
| Tailwind CSS | Rapid styling, no CSS-in-JS complexity |
| Vercel | Zero-config deploy, preview URLs |

#### Execution: Configuration

```
package.json dependencies:
├── next: 14.x
├── react: 18.x
├── typescript: 5.x
├── @supabase/supabase-js
└── tailwindcss

Configuration files:
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── vitest.config.ts
```

---

### State Management

#### Intent (PRD)

> "Three-layer state architecture: Server state (database), Client state (React), Asset references (static manifest)."

#### Decision: No Global State Library

React hooks + Supabase queries are sufficient for single-user MVP:

```
┌─────────────────────────────────────────┐
│ Server State (Supabase PostgreSQL)      │
│ - Sessions, attempts, goals, stats      │
│ - Source of truth for persistence       │
└─────────────────────────────────────────┘
        ↕ queries via hooks
┌─────────────────────────────────────────┐
│ Client State (React Hooks)              │
│ - useGameState: Active session          │
│ - useTimer: Stopwatch                   │
│ - useStats: Analytics queries           │
│ - useAuth: Current user                 │
└─────────────────────────────────────────┘
        ↕ references
┌─────────────────────────────────────────┐
│ Asset References (Static Manifest)      │
│ - src/lib/assets.ts                     │
│ - URLs to Supabase Storage CDN          │
└─────────────────────────────────────────┘
```

#### Execution: Hooks

```
src/hooks/
├── useAuth.ts           # User authentication state
├── useGameState.ts      # Game session management
├── useTimer.ts          # Stopwatch with pause support
├── useStats.ts          # Analytics queries
└── useAdminAuth.ts      # Admin PIN verification
```

---

### Component Architecture

#### Intent (PRD)

> "Shared components for DRY code. Each game module reuses common UI."

#### Decision: Game Components as Building Blocks

```
┌──────────────────────────────────────────────────────────┐
│                    Game Page Layout                       │
├─────────────────────────┬────────────────────────────────┤
│  Left Panel             │  Right Panel                   │
│  ┌───────────────────┐  │  ┌──────────────────────────┐  │
│  │ Problem Display   │  │  │ ImageReveal (5x5 grid)   │  │
│  │ or Audio Controls │  │  │                          │  │
│  │ ────────────────  │  │  │                          │  │
│  │ Answer Input      │  │  │                          │  │
│  │ ────────────────  │  │  │                          │  │
│  │ Feedback Message  │  │  │                          │  │
│  └───────────────────┘  │  └──────────────────────────┘  │
└─────────────────────────┴────────────────────────────────┘
           ↑ Timer (top-right)    ↑ Counter (top-left)
```

#### Execution: Component Structure

```
src/components/
├── game/
│   ├── ImageReveal.tsx      # 5x5 grid reveal system
│   ├── Timer.tsx            # MM:SS stopwatch display
│   ├── Counter.tsx          # "X out of 25" with back link
│   ├── LetterBoxes.tsx      # Spelling letter inputs
│   ├── CelebrationVideo.tsx # Fullscreen celebration
│   └── *.test.tsx           # Component tests
├── dashboard/
│   ├── SessionStats.tsx     # Overall statistics
│   ├── RecentSessions.tsx   # Session history list
│   ├── ModuleBreakdown.tsx  # Per-module metrics
│   └── GoalProgress.tsx     # Goal progress display
├── admin/
│   ├── AdminAuth.tsx        # PIN gate
│   ├── GoalForm.tsx         # Goal create/edit
│   └── GoalList.tsx         # Goal management
└── providers/
    └── AuthProvider.tsx     # Auth context
```

---

### Routing Architecture

#### Intent (PRD)

> "Next.js App Router with clean URL structure."

#### Decision: File-System Routing

```
URL                    → File
/                      → src/app/page.tsx (Landing)
/math                  → src/app/math/page.tsx (Module selection)
/math/addition         → src/app/math/addition/page.tsx
/math/subtraction      → src/app/math/subtraction/page.tsx
/spelling              → src/app/spelling/page.tsx
/progress              → src/app/progress/page.tsx
/admin                 → src/app/admin/page.tsx (Hidden)
```

#### Execution: Navigation Flow

```
Landing Page (profile image, Math/Spelling buttons)
     ↓
┌────┴────┐
↓         ↓
Math      Spelling
Selection Game
     ↓         ↓
Addition  ──────┤
or             │
Subtraction    │
     ↓         ↓
Game (with "← Back to Home" link)
     ↓
Celebration Video (on 25 correct)
     ↓
Return to Landing
```

---

## 4. Design System Mapping

### Intent (PRD Section 5)

> "Jungle theme with playful typography and high-contrast colors for child engagement."

### Decision: Tailwind Custom Theme

```javascript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      jungle: {
        dark: '#2d5016',
        DEFAULT: '#4a7c2c',
        light: '#356b1f'
      },
      orange: '#ff8c3c'
    }
  }
}
```

### Execution: Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `jungle-dark` | `#2d5016` | Background gradient start |
| `jungle` | `#4a7c2c` | Primary green |
| `jungle-light` | `#356b1f` | Background gradient end |
| `orange` | `#ff8c3c` | Accents, borders |
| White panels | `bg-white/95` | Content cards |
| Font | Comic Sans MS | Child-friendly game UI |

### Execution: Layout Patterns

```typescript
// Game page container pattern
<main className="min-h-screen bg-gradient-to-br from-jungle-dark via-jungle to-jungle-light">
  {/* Timer: absolute positioned top-right */}
  <div className="absolute top-5 right-5">
    <Timer seconds={seconds} />
  </div>

  {/* Counter: top-left area */}
  <Counter current={correctCount} total={25} showBackLink />

  {/* Two-panel layout */}
  <div className="flex flex-col lg:flex-row gap-5 p-5 pt-20 max-w-7xl mx-auto">
    {/* Left: Problem panel */}
    <div className="flex-1 bg-white/95 rounded-[30px] p-10 border-[6px] border-orange">
      {/* Content */}
    </div>

    {/* Right: Image reveal panel */}
    <div className="flex-1 bg-white/95 rounded-[30px] p-10 border-[6px] border-orange h-[600px]">
      <ImageReveal imageUrl={selectedImage} revealedCount={correctCount} />
    </div>
  </div>
</main>
```

---

## 5. Database Schema Mapping

### Intent (PRD Section 6)

> "PostgreSQL with Row Level Security for user data isolation."

### Decision: Four Tables + One View

```
┌─────────────┐     ┌─────────────────┐
│   users     │←────│    sessions     │
│             │     │                 │
│ id          │     │ id              │
│ name        │     │ user_id (FK)    │
│ photo_url   │     │ module          │
└─────────────┘     │ duration_seconds│
      ↑             │ correct_count   │
      │             │ total_attempts  │
      │             │ completed       │
      │             └────────┬────────┘
      │                      │
      │             ┌────────↓────────┐
      │             │ problem_attempts│
      │             │                 │
      │             │ session_id (FK) │
      │             │ problem         │
      │             │ user_answer     │
      │             │ correct         │
      │             └─────────────────┘
      │
┌─────┴───────┐     ┌─────────────────┐
│   goals     │────→│  goal_progress  │
│             │     │     (VIEW)      │
│ user_id     │     │                 │
│ title       │     │ sessions_completed
│ sessions_   │     │ avg_accuracy    │
│   required  │     │ goal_achieved   │
│ min_accuracy│     └─────────────────┘
└─────────────┘
```

### Execution: Migration Files

```
supabase/migrations/
├── 20250106000001_initial_schema.sql  # Full schema + RLS policies
└── 20250108000001_disable_rls_mvp.sql # MVP: Relaxed RLS for single user
```

### Execution: TypeScript Types

```typescript
// src/types/index.ts
export type GameModule = 'addition' | 'subtraction' | 'spelling';

export interface Session {
  id: string;
  user_id: string;
  module: GameModule;
  started_at: string;
  completed_at: string | null;
  duration_seconds: number;
  correct_count: number;
  total_attempts: number;
  completed: boolean;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  sessions_required: number;
  min_accuracy: number | null;
  module_filter: GameModule | null;
  active: boolean;
  achieved_at: string | null;
}
```

---

## 6. Testing Strategy Mapping

### Intent (PRD Section 8)

> "Unit tests on pure logic, component tests on UI, skip E2E for MVP."

### Decision: ADR-004

| Layer | Coverage Target | Tools |
|-------|-----------------|-------|
| Game logic (pure functions) | 100% | Vitest |
| Components | 80% | React Testing Library |
| Hooks | Key paths | Vitest + mock Supabase |
| E2E | Skip (MVP) | N/A |

### Execution: Test Structure

```
src/
├── lib/game-logic/
│   ├── subtraction.ts
│   └── subtraction.test.ts     # 100% coverage
├── components/game/
│   ├── ImageReveal.tsx
│   └── ImageReveal.test.tsx    # Render + interaction tests
├── hooks/
│   ├── useGameState.ts
│   └── useGameState.test.ts    # Mocked database calls
└── test/
    └── setup.ts                # Test configuration
```

### Execution: Test Commands

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Generate coverage report
```

---

## 7. Asset Management Mapping

### Intent (PRD Section 7)

> "All media assets served via Supabase Storage CDN."

### Decision: Centralized Asset Manifest

All asset URLs defined in single file, never hardcoded in components:

```typescript
// src/lib/assets.ts
export const ASSETS = {
  images: [
    'https://...supabase.co/storage/v1/object/public/images/tiger1.jpg',
    'https://...supabase.co/storage/v1/object/public/images/tiger2.jpg',
    // ... 5 total
  ],
  videos: [...],    // 3 celebration videos
  audio: {
    tigerRoar: '...',
    getSpellingWord: (word: string) => `.../${word}.mp3`
  },
  profileImage: '...'
}
```

### Execution: Storage Buckets

```
Supabase Storage:
├── images/        # Tiger reveal images (5)
├── videos/        # Celebration videos (3)
├── audio/         # Tiger roar + 172 spelling words
└── prizes/        # Goal prize images
```

---

## 8. Development Phases Mapping

### Intent (PRD Section 9)

> "Phased development: Foundation → Game Modules → Features → Polish"

### Execution: Build Phases

| Phase | Intent | Status | Key Deliverables |
|-------|--------|--------|------------------|
| 0 | Supabase setup | ✅ Complete | Storage buckets, asset upload |
| 1 | Next.js scaffold | ✅ Complete | Routes, auth, database client |
| 2A | Subtraction game | ✅ Complete | Canonical game pattern |
| 2B | Addition game | ✅ Complete | Follows 2A pattern |
| 2C | Spelling game | ✅ Complete | Audio, LetterBoxes, write prompt |
| 3 | Progress dashboard | ✅ Complete | Stats, trends, charts |
| 4 | Admin + Goals | ✅ Complete | Goal CRUD, progress tracking |
| 5 | Polish + Deploy | ✅ Complete | UX refinements, production |

### Post-Launch Enhancements (2026-01-09)

| Enhancement | Intent | Execution |
|-------------|--------|-----------|
| Write prompt | Handwriting practice | Timer pauses, overlay displays word |
| Vertical layout | Match homework style | CSS grid for arithmetic display |
| Auto-focus | Reduce friction | `inputRef.current?.focus()` |
| Back link | Easy navigation | Counter component prop |
| Stopwatch | Always-visible timer | Removed checkbox toggle |

---

## 9. Deviations from PRD

### Intentional Deviations

| PRD Specification | Actual Implementation | Rationale |
|-------------------|----------------------|-----------|
| Timer toggle checkbox | Always-visible stopwatch | Better UX, consistent visibility |
| Horizontal math problems | Vertical arithmetic layout | Matches homework worksheets |
| No write prompt | Spelling includes write step | Preserved from v2, handwriting practice |
| Click to focus input | Auto-focus on load | Reduces friction for child user |

### Future Considerations (Not Yet Implemented)

| PRD Feature | Status | Notes |
|-------------|--------|-------|
| Multi-user accounts | Deferred | Schema supports it, auth UI not built |
| Multiplication/Division | Deferred | Follow 2A pattern when needed |
| Achievements/Badges | Deferred | Table schema TBD |
| Offline mode (PWA) | Deferred | Would require sync strategy |

---

## 10. Quick Reference

### File Tree Summary

```
smartypantsv3/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── page.tsx            # Landing
│   │   ├── layout.tsx          # Root layout + providers
│   │   ├── math/
│   │   │   ├── page.tsx        # Module selection
│   │   │   ├── addition/page.tsx
│   │   │   └── subtraction/page.tsx
│   │   ├── spelling/page.tsx
│   │   ├── progress/page.tsx
│   │   └── admin/
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── components/
│   │   ├── game/               # ImageReveal, Timer, Counter, etc.
│   │   ├── dashboard/          # SessionStats, GoalProgress, etc.
│   │   ├── admin/              # GoalForm, GoalList, AdminAuth
│   │   └── providers/          # AuthProvider
│   ├── hooks/                  # useGameState, useTimer, useAuth, etc.
│   ├── lib/
│   │   ├── game-logic/         # Pure functions + tests
│   │   ├── supabase/           # Client + queries
│   │   ├── analytics/          # Calculation functions
│   │   └── assets.ts           # Asset URL manifest
│   └── types/index.ts          # TypeScript interfaces
├── supabase/migrations/        # Database schema
├── docs/                       # Documentation
└── public/                     # Static assets (minimal)
```

### Key Patterns

1. **Game logic** = Pure functions in `src/lib/game-logic/`
2. **Game state** = `useGameState` hook manages session lifecycle
3. **Database access** = Query functions in `src/lib/supabase/queries/`
4. **Asset references** = Never hardcode URLs, use `ASSETS` from `src/lib/assets.ts`
5. **Shared components** = Build once in `src/components/game/`, use everywhere

### Canonical Files

| Pattern | Reference File |
|---------|----------------|
| Game page | `src/app/math/subtraction/page.tsx` |
| Problem generator | `src/lib/game-logic/subtraction.ts` |
| Custom hook | `src/hooks/useGameState.ts` |
| Database query | `src/lib/supabase/queries/sessions.ts` |
| Component | `src/components/game/ImageReveal.tsx` |
| Component test | `src/components/game/ImageReveal.test.tsx` |

---

## 11. Related Documentation

- **PRD:** Original product requirements document
- **CLAUDE.md:** Developer onboarding and conventions
- **Architecture Overview:** `docs/architecture/overview.md`
- **Database Schema:** `docs/api/database-schema.md`
- **Build Specs:** `docs/build-specs/phase-*.md`
- **ADRs:** `docs/decisions/ADR-*.md`
- **Deployment Log:** `DEPLOYMENT-LOG.md`

---

*Document generated 2026-01-09. Reflects production state at https://smartypantsv3.vercel.app*
