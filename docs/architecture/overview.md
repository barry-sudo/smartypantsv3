# Architecture Overview

**Project:** Smarty Pants v3
**Last Updated:** 2026-01-09
**Status:** ✅ Deployed to Production (https://smartypantsv3.vercel.app)

---

## System Design

Smarty Pants v3 is a client-server web application with:

- **Frontend:** Next.js 14 (React, TypeScript, Tailwind CSS)
- **Backend:** Supabase (PostgreSQL, Authentication, Storage)
- **Deployment:** Vercel (frontend) + Supabase Cloud (backend)
- **Assets:** Supabase Storage CDN (images, audio, video)

### Architecture Pattern

**Serverless JAMstack** approach:
- Static frontend (Next.js App Router)
- API-less design (direct Supabase client connections)
- CDN-delivered assets
- Database-driven state

### Why This Stack

See [ADR-001](../decisions/ADR-001-stack-selection.md) for detailed rationale. Summary:

- **Zero DevOps:** Both Vercel and Supabase are fully managed
- **Free tier adequate:** Covers single-user needs indefinitely
- **TypeScript end-to-end:** Type safety from database to UI
- **Rapid development:** Minimal boilerplate, fast iterations
- **Production-ready:** Scales when needed (multi-user, features)

---

## Major Components

### Frontend (Next.js 14 App Router)

```
src/app/
├── page.tsx              # Landing (module selection)
├── layout.tsx            # Root layout
├── progress/             # Analytics dashboard
├── admin/                # Parent goal management
├── math/
│   ├── addition/         # Addition game
│   └── subtraction/      # Subtraction game
└── spelling/             # Spelling game
```

**Key decisions:**
- App Router (not Pages Router) - Server components by default
- Client components only where needed (game interactivity, state)
- Minimal layouts (no complex nesting)

### Backend (Supabase)

**PostgreSQL Database:**
- `users` - User accounts (references `auth.users`)
- `sessions` - Game session tracking
- `problem_attempts` - Individual answer attempts
- `goals` - Parent-created reward goals

**Row Level Security:**
- All tables enforce `user_id` isolation
- Users can only access their own data
- Policies applied automatically at database level

**Storage:**
- `images/` - Tiger reveal images (5 files)
- `videos/` - Celebration videos (3 files)
- `audio/` - Tiger roar + 172 spelling words
- `prizes/` - Current goal prize photo

**Authentication:**
- Email/password (simple for family use)
- JWT tokens in httpOnly cookies
- Single user for MVP (extensible to multi-user)

### Shared Logic

```
src/lib/
├── game-logic/           # Pure functions (problem generation)
├── analytics/            # Statistics calculations
├── supabase/             # Database client & queries
└── assets.ts             # Asset URL manifest
```

**Pure functions principle:**
- Game logic has no side effects
- 100% testable in isolation
- Deterministic outputs

### State Management

**Three layers:**

1. **Server state** (Supabase database)
   - Sessions, attempts, goals, stats
   - Source of truth for all persistent data
   - Queried via custom hooks

2. **Client state** (React hooks)
   - `useGameState` - Active game session
   - `useTimer` - Session timer
   - `useStats` - Analytics queries
   - Local UI state (`useState`)

3. **Asset references** (Static manifest)
   - `src/lib/assets.ts` - URLs to all media
   - Preloaded or lazy-loaded as needed

**No global state library needed** - hooks + database queries sufficient.

---

## Data Flow

### Game Session Flow

**Math Games (Addition/Subtraction):**
```
1. User selects game module
   ↓
2. Game component loads, stopwatch timer starts at 00:00
   ↓
3. useGameState hook creates session in database
   ↓
4. Problem displayed in vertical arithmetic format (worksheet style)
   ↓
5. Answer input auto-focused, user types answer
   ↓
6. On submit: Answer validated, attempt logged to database
   ↓
7. If correct:
   - Play tiger roar audio
   - Show "ROAR!" feedback
   - Reveal random grid cell
   - Generate next problem (input re-focused)
   ↓
8. If incorrect:
   - Show "Try Again!" feedback
   - Clear input (re-focused)
   - Increment attempt counter
   ↓
9. After 25 correct:
   - Complete session with timer value
   - Show celebration video
   - Navigate to landing page
```

**Spelling Game:**
```
1-7. Same as math games (audio plays word instead of showing problem)
   ↓
8. After correct spelling:
   - Timer PAUSES
   - Show "Now write out the word" prompt
   - User clicks "I'm Done" after handwriting practice
   - Timer RESUMES, next word loads
   ↓
9. After 25 correct: Same as math games
```

### Authentication Flow (Phase 1)

```
1. App loads, checks for authenticated user
   ↓
2. If no user: Create/sign in hardcoded user (MVP)
   ↓
3. Store user in context/state
   ↓
4. All database queries automatically scoped to user_id (RLS)
```

**Future (post-MVP):** Add login UI, support multiple users

### Goal Progress Flow (Phase 4)

```
1. Parent creates goal in admin panel
   ↓
2. Goal stored in database with:
   - Prize image URL
   - Sessions required (e.g., 20)
   - Optional: minimum accuracy threshold
   ↓
3. As child completes sessions:
   - Database tracks completion automatically
   ↓
4. Progress dashboard queries goal progress
   ↓
5. When threshold reached:
   - Special celebration screen
   - Goal marked achieved
```

---

## Design System

### Color Palette

**Jungle Theme (from v2):**
- Primary green: `#2d5016`, `#4a7c2c`, `#356b1f`
- Accent orange: `#ff8c3c`, `#ff6b1a`
- White panels: `rgba(255, 255, 255, 0.95)`
- Black overlay: `#000000` (for grid cells)

### Typography

**Game Interface:**
- Font: Comic Sans MS (playful, child-friendly)
- Large sizes: 3-6em for problems, feedback
- Heavy use of `font-bold`

**Dashboard:**
- Font: System sans-serif (Inter or -apple-system)
- Professional, data-focused
- Smaller sizes: 1-2.5em

### Layout

**Game Panels:**
- Two-column split on desktop/tablet
- White rounded panels (`rounded-[30px]`)
- 6px orange borders (`border-[6px] border-[#ff8c3c]`)
- Generous padding (`p-10`, `p-16`)

**Responsive:**
- Desktop/tablet: Side-by-side panels
- Mobile: Stacked (stretch goal - not MVP focus)

### Components

**Shared components in `src/components/game/`:**
- `ImageReveal` - 5x5 grid reveal system
- `Timer` - Always-visible stopwatch (MM:SS format, pauses during spelling write prompt)
- `Counter` - "X out of 25" progress with optional "← Back to Home" navigation
- `LetterBoxes` - Individual letter inputs for spelling with auto-advance
- `CelebrationVideo` - Fullscreen celebration

---

## Routing

### URL Structure

```
/                        # Landing page (Math / Spelling buttons)
/math                    # Math module selection (Addition / Subtraction)
/math/addition           # Addition game
/math/subtraction        # Subtraction game
/spelling                # Spelling game
/progress                # Analytics dashboard
/admin                   # Goal management (parent only)
```

### Navigation Flow

```
Landing (with profile image, side-by-side Math/Spelling buttons)
    ↓
Math Selection OR Spelling Game
    ↓
Game (with "← Back to Home" link in header)
    ↓
Celebration Video
    ↓
Landing Page
```

**In-game navigation:**
- "← Back to Home" link visible next to score counter
- Allows returning to landing page without completing session

**Admin access:**
- Hidden from main navigation
- 3-second press on "Smarty Pants" logo
- PIN: 2018

---

## Security

### Authentication

**MVP (Phase 1):**
- Hardcoded single user created in migration
- Auto-login on app load
- JWT stored in memory (not localStorage)

**Future:**
- Email/password login UI
- Multiple user accounts
- Parent vs child accounts (different permissions)

### Row Level Security (RLS)

All tables enforce user isolation:

```sql
-- Example policy
CREATE POLICY "users_own_sessions" ON sessions
  FOR SELECT USING (auth.uid() = user_id);
```

**Critical:** Never expose user_id in client code - RLS handles it automatically

### Data Privacy

**What's stored:**
- Session metadata (times, counts, accuracy)
- Problem attempts (for analytics)
- Goals and progress

**What's NOT stored:**
- Personal information (beyond name)
- Identifiable data about child
- External sharing/social features

---

## Performance

### Asset Strategy

**Images/Videos:**
- Hosted on Supabase CDN (fast, global)
- Randomly selected per session (variety)
- Not preloaded (load on demand)

**Audio:**
- Spelling words: Load on demand (172 files, ~10KB each)
- Tiger roar: Preloaded (used frequently)
- Browser autoplay restrictions handled gracefully

### Database Queries

**Optimization:**
- Index on `user_id` + `module` (common filter)
- Index on `session_id` + `timestamp` (ordering attempts)
- RLS policies use indexes automatically

**Patterns:**
- Query only what's needed (select specific columns)
- Use database aggregations (COUNT, AVG) vs client-side
- Single query for dashboard stats (not N queries)

### Caching

**No client-side caching in MVP:**
- Database queries on each page load
- Fresh data every time
- Performance acceptable for single user

**Future optimization:**
- React Query for client-side caching
- Invalidation on mutations
- Optimistic updates

---

## Testing Strategy

See [ADR-004](../decisions/ADR-004-testing-strategy.md) for full rationale.

### What We Test

**Unit tests (100% coverage):**
- Game logic (problem generation)
- Analytics calculations
- Pure utility functions

**Component tests (80% coverage):**
- Game components (user interactions)
- Dashboard displays
- Form submissions

**Integration tests:**
- Database query patterns (against test database)

### What We Skip

**E2E tests (Playwright/Cypress):**
- High setup cost
- Maintenance burden
- Manual testing faster for family app

**Snapshot tests:**
- Brittle, don't test behavior
- Use specific assertions instead

### Testing Tools

- Vitest (test runner)
- React Testing Library (component tests)
- @testing-library/user-event (interactions)
- Test Supabase instance (separate from prod)

---

## Deployment

### Vercel (Frontend)

**Automatic deployment:**
- Push to `main` → Production deploy
- Push to feature branch → Preview URL
- Each phase gets preview URL for testing

**Configuration:**
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Build command: `npm run build`
- Output directory: `.next/`

### Supabase (Backend)

**Manual deployment:**
- Run migrations via Supabase dashboard or CLI
- Upload assets via dashboard (one-time)
- Environment separation: Production vs Staging projects

**Configuration:**
- RLS policies applied in migrations
- Storage buckets created manually (one-time)
- Auth settings configured in dashboard

---

## Migration from v2 (HTML)

See [migration/html-reference.md](../migration/html-reference.md) for complete details.

### Key Changes

| Aspect | v2 (HTML) | v3 (Next.js) |
|--------|-----------|--------------|
| **Language** | JavaScript | TypeScript |
| **Structure** | Single HTML files | Component architecture |
| **Storage** | localStorage | PostgreSQL |
| **Routing** | Multiple HTML pages | Next.js App Router |
| **State** | Global variables | React hooks |
| **Assets** | Local files | Supabase CDN |

### What We Preserved

- 5x5 grid reveal system (excellent UX)
- Jungle theme colors (green/orange)
- Audio feedback patterns (tiger roar, word pronunciation)
- 25-question session structure
- Write prompt step for spelling (handwriting practice)
- Landing page with profile image

### What We Improved

- Vertical arithmetic layout (matches homework worksheets)
- Always-visible stopwatch timer (no toggle needed)
- Timer pauses during spelling write prompt (handwriting time not counted)
- Auto-focus on answer input (no clicking required)
- In-game navigation back to home

### What We Fixed

- Timer bugs (proper React lifecycle)
- Inconsistent stats (database-backed)
- No progress tracking (complete dashboard)
- Code duplication (shared components)

---

## Future Enhancements

**Not in MVP, but architecture supports:**

- Multi-user accounts (database ready)
- Adaptive difficulty (structure in place)
- More game modules (Multiplication, Division)
- Achievements system (badges table schema TBD)
- Parent-child separate accounts (permissions model TBD)
- Real-time leaderboards (Supabase real-time)
- Offline mode (PWA + sync)

---

## Key Architectural Principles

1. **Separation of concerns:** Game logic, UI, database queries in separate layers
2. **Pure functions:** Game logic has no side effects
3. **Type safety:** TypeScript everywhere, no `any`
4. **Database as source of truth:** All persistent state in Supabase
5. **Progressive disclosure:** Load only what's needed
6. **Test coverage on logic:** 100% on pure functions
7. **Explicit over implicit:** Named exports, clear interfaces
8. **Documentation as code:** Patterns established before building

---

## Questions & Ambiguities

**None** - all architectural decisions finalized and documented in ADRs.

**If you encounter ambiguities during building:**
1. Check build spec for your phase
2. Reference this doc and ADRs
3. If still unclear, flag in completion report (don't guess)

---

## Related Documentation

- Complete database schema: [api/database-schema.md](../api/database-schema.md)
- Component patterns: [quick-reference/component-patterns.md](../quick-reference/component-patterns.md)
- All ADRs: [decisions/](../decisions/)
- Build specifications: [build-specs/](../build-specs/)
