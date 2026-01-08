# RLS Disabled for MVP Development

**Status:** RLS temporarily disabled on sessions and problem_attempts tables
**Reason:** Allows MVP development without authentication
**Re-enable:** Phase 4 (when implementing real auth)
**Security:** Low risk for single-user family app

---

## What Was Disabled

### Tables with RLS Disabled
1. **sessions** - Game session tracking
2. **problem_attempts** - Individual answer logging

### Why These Tables
These are the tables that receive INSERT operations during gameplay:
- Creating a new session when game starts
- Logging each answer attempt

Without authentication, `auth.uid()` returns NULL, and even with `OR auth.uid() IS NULL` in policies, Supabase RLS still blocks INSERTs in some cases.

### Tables with RLS Still Enabled
- **users** - Not directly queried by app (uses hardcoded user)
- **goals** - Not used until Phase 4 (parent features)

---

## SQL Commands to Disable RLS

Run these commands in **Supabase Dashboard → SQL Editor**:

```sql
-- Disable RLS for MVP development
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE problem_attempts DISABLE ROW LEVEL SECURITY;
```

### Verification
After running, verify in Supabase Dashboard:
1. Go to **Database** → **Tables**
2. Click on `sessions` table
3. Check that "Row Level Security" shows as **Disabled**
4. Repeat for `problem_attempts` table

---

## Why This Is Safe for MVP

### Single User
- Only one child using the app
- No multi-user concerns
- Family-only environment
- Trusted users

### No Public Access
- App runs locally or on private domain
- Supabase anon key only known to family
- No external users
- No API exposure

### Data is Low-Risk
- Educational game data
- No personal information
- No financial data
- No sensitive content
- Can be deleted/reset anytime

### Temporary
- Only for development/MVP phase
- Will re-enable in Phase 4
- Proper auth will be implemented
- RLS policies already written (just disabled)

---

## Impact of Disabling RLS

### What Still Works
✅ All game functionality
✅ Session creation
✅ Attempt logging
✅ Database queries
✅ Progress tracking
✅ Stats calculations

### What's No Longer Protected
❌ User data isolation (but only 1 user)
❌ Unauthorized inserts (but no external users)
❌ Cross-user data access (but no other users)

### What Happens Without RLS
- Any client with the anon key can read/write these tables
- In practice: Only your family knows the anon key
- Low risk: Educational game data, not sensitive

---

## Re-enabling RLS (Phase 4)

When implementing real authentication:

### Step 1: Create Real Auth User
```sql
-- In Supabase Dashboard → Authentication
-- OR via SQL:
-- Create auth user and link to users table
```

### Step 2: Re-enable RLS
```sql
-- Re-enable RLS on both tables
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_attempts ENABLE ROW LEVEL SECURITY;
```

### Step 3: Update Policies
```sql
-- Remove "OR auth.uid() IS NULL" from policies
CREATE POLICY "Users can insert own sessions"
  ON sessions FOR INSERT
  WITH CHECK (user_id = auth.uid());  -- No NULL fallback

CREATE POLICY "Users can insert own attempts"
  ON problem_attempts FOR INSERT
  WITH CHECK (
    session_id IN (
      SELECT id FROM sessions WHERE user_id = auth.uid()
    )
  );  -- No NULL fallback
```

### Step 4: Test with Real Auth
- Sign in as real user
- Verify sessions create with correct user_id
- Verify RLS blocks other users' data
- Verify all operations work with auth

### Step 5: Remove Test User
```sql
-- Clean up hardcoded test user
-- Update getCurrentUser() to use real auth
-- Remove hardcoded user object
```

---

## Current Auth Flow (MVP)

### Without Authentication
1. App loads → Returns hardcoded test user
2. User available immediately
3. Game creates session → RLS disabled → Success
4. Logs attempts → RLS disabled → Success

### Data Written
- user_id: `00000000-0000-0000-0000-000000000000`
- All sessions tagged with this ID
- All attempts linked to these sessions

### Querying Data
```sql
-- All data uses the hardcoded user ID
SELECT * FROM sessions
WHERE user_id = '00000000-0000-0000-0000-000000000000';

SELECT * FROM problem_attempts
WHERE session_id IN (
  SELECT id FROM sessions
  WHERE user_id = '00000000-0000-0000-0000-000000000000'
);
```

---

## Migration Path

### Phase 1-3 (Current - MVP)
```
No auth → Hardcoded user → RLS disabled → Works perfectly
```

### Phase 4 (Real Auth)
```
Real auth → Auth session → RLS enabled → Production-ready
```

### Phase 5 (Multi-user)
```
Multiple auth users → Each isolated by RLS → Secure
```

---

## Alternative Solutions (Why Not Used)

### Option A: Service Role Key
```typescript
// Use service_role key to bypass RLS
const supabase = createClient(url, serviceRoleKey);
```
**Why not:** Exposes service role key to client (dangerous), harder to upgrade later

### Option B: Fix RLS Policies
```sql
-- Make policies more permissive
WITH CHECK (user_id IS NOT NULL OR auth.uid() IS NULL);
```
**Why not:** Complex policy logic, hard to reason about, still had issues with INSERTs

### Option C: Anonymous Auth
```typescript
// Use Supabase anonymous auth
await supabase.auth.signInAnonymously();
```
**Why not:** Requires auth setup, anonymous sessions expire, unnecessary complexity

### Option D: Disable RLS (✅ Chosen)
```sql
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;
```
**Why yes:**
- Simple and clear
- Works immediately
- Easy to re-enable later
- Low risk for single-user MVP
- Straightforward upgrade path

---

## Checklist

### Before Disabling RLS
- [x] Understand security implications
- [x] Confirm single-user MVP only
- [x] Document in RLS-DISABLED-MVP.md
- [x] Plan re-enable strategy for Phase 4

### After Disabling RLS
- [ ] Run SQL commands in Supabase Dashboard
- [ ] Verify tables show RLS as disabled
- [ ] Test game - sessions should create
- [ ] Test game - attempts should log
- [ ] Verify no 401 errors in console
- [ ] Confirm data appears in database

### Before Production
- [ ] Implement real authentication
- [ ] Re-enable RLS on both tables
- [ ] Update policies (remove NULL checks)
- [ ] Test with authenticated users
- [ ] Verify data isolation works
- [ ] Remove hardcoded test user

---

## SQL Script (Copy/Paste Ready)

```sql
-- =====================================================
-- Smarty Pants v3 - Disable RLS for MVP
-- =====================================================
-- Run this in Supabase Dashboard → SQL Editor
-- Allows unauthenticated database operations for MVP
-- IMPORTANT: Re-enable in Phase 4 when adding real auth
-- =====================================================

-- Disable RLS on sessions table
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;

-- Disable RLS on problem_attempts table
ALTER TABLE problem_attempts DISABLE ROW LEVEL SECURITY;

-- Verify (should return 'false' for both)
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('sessions', 'problem_attempts');

-- =====================================================
-- Expected output:
--    tablename        | rowsecurity
-- --------------------+-------------
--  sessions           | f
--  problem_attempts   | f
-- =====================================================
```

### How to Run
1. Open Supabase Dashboard: https://supabase.com/dashboard/project/kwvqxvyklsrkfgykmtfu
2. Navigate to **SQL Editor** in left sidebar
3. Click **+ New Query**
4. Copy the entire SQL block above
5. Paste into editor
6. Click **Run** or press Cmd/Ctrl + Enter
7. Verify output shows both tables with `rowsecurity = f` (false)

---

## Testing After Disabling

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Play the Game
- Go to http://localhost:3001
- Click "Math Games" → "Subtraction"
- Answer a few problems
- Submit answers

### 3. Verify Success
**In Browser Console:**
- ✅ No "Failed to create session" errors
- ✅ No 401 errors
- ✅ Session ID logged
- ✅ Attempts logged

**In Supabase Dashboard:**
- Go to **Database** → **Table Editor** → `sessions`
- Should see new session rows with user_id = `00000...000`
- Go to `problem_attempts` table
- Should see attempt rows linked to session_id

---

## Timeline

| Phase | Auth Status | RLS Status | Use Case |
|-------|-------------|------------|----------|
| **0-3** | None (hardcoded) | Disabled | MVP development |
| **4** | Real auth | Enabled | Production prep |
| **5** | Multi-user auth | Enabled | Multi-user ready |

---

## Documentation References

- Original RLS policies: `supabase/migrations/20250106000001_initial_schema.sql`
- Auth implementation: `src/lib/auth/index.ts`
- Auth flow doc: `AUTH-FIX-FINAL.md`
- This document: `RLS-DISABLED-MVP.md`

---

## Summary

**RLS disabled for MVP = pragmatic choice for single-user development**

- ✅ Works immediately
- ✅ No auth complexity
- ✅ Low security risk (single user, family app)
- ✅ Easy to re-enable with real auth
- ✅ Clear upgrade path documented

**Remember:** This is temporary. Re-enable RLS in Phase 4 when implementing real authentication.

---

**Status:** Documentation complete
**Action Required:** Run SQL commands in Supabase Dashboard
**Next:** Test game to verify sessions create successfully

Copy the SQL script above and run it in your Supabase Dashboard!
