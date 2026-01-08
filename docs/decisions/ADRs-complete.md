# ADR-001: Technology Stack Selection

**Date:** 2025-01-06  
**Status:** Accepted

---

## Context

Smarty Pants v2 (HTML/localStorage) needs production architecture with database, authentication, file storage, and zero DevOps.

## Decision

- **Frontend:** Next.js 14 + React + TypeScript + Tailwind
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Deployment:** Vercel

## Rationale

**Next.js:**
- Server components for performance
- TypeScript built-in
- Vercel zero-config deployment

**Supabase:**
- All-in-one (database, auth, storage, real-time)
- PostgreSQL (relational data model fits sessions/attempts)
- Free tier sufficient
- Row Level Security for multi-user

**Vercel:**
- Next.js optimized
- Automatic git deployments
- Preview URLs per branch

## Consequences

**Positive:**
- Zero DevOps overhead
- Type-safe end-to-end
- Fast development velocity
- Free tier covers needs
- Scales when needed

**Negative:**
- Vendor lock-in (mitigated: both have export options)
- Learning curve for App Router and Supabase RLS

---

# ADR-002: Implement User Accounts from Day 1

**Date:** 2025-01-06  
**Status:** Accepted

## Context

MVP is single-user (family app for one child). Question: Hardcode user ID everywhere, or implement proper user accounts now?

## Decision

Implement user accounts from Phase 1, but with simplified authentication for MVP (hardcoded test user, auto-login).

## Rationale

**Why implement now:**
- Database schema requires `user_id` foreign keys
- Supabase RLS policies enforce user isolation (best practice)
- Future multi-user support requires minimal changes
- Cost is low: ~1 hour of work in Phase 1

**Why not defer:**
- Refactoring entire codebase later is expensive
- Database schema changes are risky after data exists
- RLS policies are harder to add retroactively

**Implementation approach:**
- Create `users` table referencing `auth.users`
- Seed test user in migration
- Auto-authenticate as test user on load (no login UI)
- All queries scoped by `user_id` (RLS enforces automatically)

## Consequences

**Positive:**
- Future-proof architecture
- Proper data isolation from day 1
- Can add siblings' accounts easily later
- Follows Supabase best practices

**Negative:**
- Slight complexity overhead in MVP (auth hooks, user context)
- Unnecessary for single-user use case initially

**Mitigation:**
- Hide authentication complexity behind `useAuth` hook
- Simple auto-login (no forms, no passwords in MVP)
- Document "how to add real login" for future

## Related

- Phase 1 implements user table and auth utilities
- Phase 4 (admin) uses same user context
- Future: Add login UI when needed

---

# ADR-003: Upload Assets to Supabase Storage Immediately

**Date:** 2025-01-06  
**Status:** Accepted

## Context

App requires 180+ media assets (5 images, 3 videos, 172 audio files, 1 prize photo). Options:
1. Keep local during development, migrate to CDN later
2. Upload to Supabase Storage immediately (Phase 0)

## Decision

Upload all assets to Supabase Storage in Phase 0, before any code is written.

## Rationale

**Why upload immediately:**
- **One-time cost:** Bulk upload takes ~45 minutes once
- **No migration phase:** Eliminates entire "move assets to cloud" task later
- **Consistent URLs:** Dev and prod use same Supabase CDN paths
- **Performance testing:** Test real CDN load times from day 1
- **No dual maintenance:** Don't manage both local and remote assets

**Why not defer:**
- Faster initial setup (keep files local)
- Easier to iterate on assets

**Counter-arguments:**
- Setup time saved is minimal (~30 min) vs migration cost later (2-3 hours)
- Iterating on assets is rare after initial upload
- Can always replace files in Supabase (same filename, just re-upload)

## Consequences

**Positive:**
- No asset migration phase needed
- Production-ready from first page render
- Real CDN performance testing
- Simpler architecture (no local fallbacks)

**Negative:**
- Requires Supabase setup before coding starts (acceptable - Phase 0 is infrastructure)
- Re-uploading assets if changes needed (rare, and simple via dashboard)

**Implementation:**
- Phase 0: Create storage buckets, upload all assets
- Phase 1: Create `src/lib/assets.ts` with CDN URLs
- All components reference ASSETS constant

## Related

- ADR-001: Stack selection (Supabase for storage)
- Phase 0 build spec defines upload process

---

# ADR-004: Testing Strategy - Unit + Component Only

**Date:** 2025-01-06  
**Status:** Accepted

## Context

Testing strategy options:
1. Unit only (fast, limited coverage)
2. Unit + Component (good balance)
3. Unit + Component + Integration (comprehensive but slow)
4. Unit + Component + E2E (full coverage, high maintenance)

## Decision

**Test:**
- Unit tests for pure functions (game logic, analytics) → 100% coverage target
- Component tests for React components → 80% coverage target

**Skip:**
- End-to-end tests (Playwright/Cypress)
- Integration tests beyond basic database query validation

## Rationale

**Why unit + component:**
- **High ROI:** Catches most bugs, fast to write and run
- **Game logic is pure functions:** Easy to test, deterministic
- **React Testing Library:** Good component test patterns
- **Fast feedback:** Tests run in < 5 seconds

**Why skip E2E:**
- **High setup cost:** Playwright/Cypress configuration complex
- **High maintenance:** Tests break on UI changes
- **Slow:** E2E tests take minutes to run
- **Low ROI for family app:** Manual testing is faster at this scale
- **Single user:** Less risk of integration issues

**Coverage targets:**
- Game logic: 100% (pure functions, critical)
- Components: 80% (focus on user interactions, skip implementation details)
- Overall: 80% minimum

**Testing tools:**
- Vitest (Jest-compatible, faster)
- React Testing Library (component tests)
- @testing-library/user-event (interaction simulation)

## Consequences

**Positive:**
- Fast test suite (run on every commit)
- Low maintenance burden
- Good coverage of critical paths
- Developer-friendly (easy to write tests)

**Negative:**
- No full-system integration testing
- Edge cases in user flows may slip through
- No visual regression testing

**Mitigation:**
- Comprehensive manual testing in Phase 5
- Real user testing (daughter using app)
- Monitor production errors closely first week

**When to add E2E:**
- Multi-user features (need isolation testing)
- Payment processing (critical flow)
- Complex multi-step workflows

## Related

- Phase 1: Set up Vitest and testing infrastructure
- Every build spec includes testing requirements
- `.claude/rules/testing.md` documents patterns

## Validation

**Success criteria:**
- Tests run in < 10 seconds
- Catch bugs before manual testing
- Don't slow down development
- Pass consistently (not flaky)

After launch, if issues arise that tests missed, reconsider E2E.
