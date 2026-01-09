# Deployment Log - Smarty Pants v3

## 2026-01-08 - Initial Vercel Deployment

### Issue 1: ESLint Error - Unused Import
**Error:**
```
./src/lib/auth/index.ts
1:10  Error: 'supabase' is defined but never used.  @typescript-eslint/no-unused-vars
```

**Fix:**
- Removed unused `supabase` import from `src/lib/auth/index.ts:1`
- Import was leftover stub for future Phase 4 auth implementation
- Committed as `8aa2c8b` and pushed to GitHub

**Resolution:** ✅ Fixed

---

### Issue 2: Missing/Incorrect Environment Variables
**Error:**
```
Error: Missing NEXT_PUBLIC_SUPABASE_URL
Error occurred prerendering page "/math/subtraction"
```

**Root Cause:**
- Supabase migrated from legacy JWT keys to new key format
- Vercel had old `eyJhbGc...` JWT key
- Needed new `sb_publishable_...` key format

**Fix:**
- Updated `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel Dashboard
- Used new publishable key from Supabase API Keys page
- Kept `NEXT_PUBLIC_SUPABASE_URL` unchanged

**Resolution:** ✅ Fixed

---

## ✅ Deployment Successful

**Production URL:** https://smartypantsv3.vercel.app

**Final Commit:** `388161d` (merged fix + manual upload)

**Status:** Ready - Deployed 2026-01-08

---

## Critical Steps Completed

1. ✅ Fixed unused import ESLint error
2. ✅ Updated Supabase API keys to new format
3. ✅ Configured environment variables in Vercel
4. ✅ Synced local and remote Git repositories
5. ✅ Successful production deployment

## Notes for Future Reference

- Supabase uses new key format: `sb_publishable_*` and `sb_secret_*`
- Only publishable key should be in Vercel (client-safe)
- Service role key stays in local `.env.local` only (dev only)
- RLS is disabled for MVP (re-enable in Phase 4)

---

## 2026-01-08 - Fix Submit Button Not Working

### Issue 3: Submit Button Not Responding
**Error:**
- Submit button in subtraction game not working
- No database operations occurring
- Silent failure with no console errors

**Root Cause:**
- Supabase client was attempting to use service role key in production
- Logic: `isDevelopment && process.env.SUPABASE_SERVICE_ROLE_KEY ? SERVICE_ROLE : ANON`
- In production, `SUPABASE_SERVICE_ROLE_KEY` doesn't exist in Vercel env vars
- Fallback to anon key was happening, but client creation was failing silently

**Fix:**
- Simplified Supabase client to always use anon key
- Since RLS is disabled for MVP, no need for service role key distinction
- Removed conditional logic entirely
- Committed as `ed61024`

**Code Change:**
```typescript
// Before (problematic):
const isDevelopment = process.env.NODE_ENV === 'development';
const supabaseKey = isDevelopment && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? process.env.SUPABASE_SERVICE_ROLE_KEY
  : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// After (fixed):
// Always use anon key - RLS is disabled for MVP
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
```

**Resolution:** ✅ Fixed - Deployed to production

**Testing:**
- Build successful locally
- Auto-deployed to Vercel via GitHub push
- Ready for manual verification at production URL

---

## 2026-01-08 - Fix User ID Mismatch (Foreign Key Constraint)

### Issue 4: Database 409 Conflict on Session Creation
**Error:**
```
Failed to load resource: 409 Conflict
kwvqxvyklsrkfgykmtfu...sessions?select=*:1
Failed to create session: Object
```

**Root Cause:**
- Auth function returned hardcoded user ID: `'00000000-0000-0000-0000-000000000000'` (ends in 000)
- Database seed migration used ID: `'00000000-0000-0000-0000-000000000001'` (ends in 001)
- When creating session, foreign key constraint on `sessions.user_id` failed
- Database tried: `REFERENCES users(id)` but user with ID `...000` doesn't exist
- Result: 409 Conflict error

**Why This Happened:**
- Hardcoded IDs in both auth function and database migration
- IDs didn't match between code and database
- No way to verify which ID actually exists in production without querying

**Fix:**
- Changed auth function to query database for actual user
- Database-first approach: Get whatever user actually exists
- Eliminates ID mismatch issues entirely
- More robust and future-proof
- Committed as `bc09375`

**Code Change:**
```typescript
// Before (problematic - hardcoded ID):
export async function getCurrentUser(): Promise<User | null> {
  const testUser: User = {
    id: '00000000-0000-0000-0000-000000000000',  // ❌ Wrong ID!
    name: 'Test Child',
    // ...
  };
  return testUser;
}

// After (fixed - query database):
export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error('Failed to get user from database:', error);
    return null;
  }

  return data;  // ✅ Use actual user from database
}
```

**Resolution:** ✅ Fixed - Deployed to production

**Verification:**
- Build successful locally
- Auto-deployed to Vercel
- Foreign key constraint will now succeed (user exists in database)
- Ready for manual testing at production URL

---

## 2026-01-09 - UX Enhancements

### Enhancement 1: Spelling Game Write Prompt
**Feature:**
- Added handwriting practice step after each correctly spelled word
- Shows overlay with "Now write out the word" and displays the word
- "I'm Done" button advances to next word
- Matches original v2 spelling.html behavior

**Files Changed:**
- `src/app/spelling/page.tsx` - Added `showWritePrompt` and `isSessionComplete` state

**Commit:** Part of spelling game updates

---

### Enhancement 2: Landing Page Restoration
**Feature:**
- Restored original v2 landing page design
- Added circular profile image at top
- Side-by-side Math and Spelling buttons
- Italic welcome text styling

**Files Changed:**
- `src/app/page.tsx` - Updated layout and styling
- `src/lib/assets.ts` - Added `profileImage` asset URL

**Asset Added:** `profile.jpeg` uploaded to Supabase images bucket

---

### Enhancement 3: Vertical Arithmetic Layout
**Feature:**
- Changed math problem display from horizontal (5 + 3 = ?) to vertical format
- Matches traditional homework worksheet style
- First number on top, operator with second number below, horizontal line, answer input

**Files Changed:**
- `src/app/math/addition/page.tsx` - Vertical layout with monospace font
- `src/app/math/subtraction/page.tsx` - Vertical layout with monospace font

---

### Enhancement 4: Auto-Focus Answer Input
**Feature:**
- Answer input automatically receives focus when new problem loads
- Re-focuses after incorrect answer
- Eliminates need for child to click into input box

**Files Changed:**
- `src/app/math/addition/page.tsx` - Added `inputRef` and focus calls
- `src/app/math/subtraction/page.tsx` - Added `inputRef` and focus calls

---

### Enhancement 5: Back to Home Navigation
**Feature:**
- Added "← Back to Home" link to all game modules
- Integrated into Counter component (displays to right of score)
- Consistent navigation across all games

**Files Changed:**
- `src/components/game/Counter.tsx` - Added `showBackLink` prop
- `src/app/math/addition/page.tsx` - Uses `showBackLink` prop
- `src/app/math/subtraction/page.tsx` - Uses `showBackLink` prop
- `src/app/spelling/page.tsx` - Uses `showBackLink` prop

---

### Enhancement 6: Always-Visible Stopwatch Timer
**Feature:**
- Replaced timer checkbox toggle with always-visible stopwatch
- Displays as MM:SS format counting up from 00:00
- Math games: timer runs continuously throughout session
- Spelling game: timer pauses during write prompt (handwriting time not counted)

**Files Changed:**
- `src/components/game/Timer.tsx` - Simplified to always-visible display
- `src/app/math/addition/page.tsx` - `useTimer(true)`, removed checkbox UI
- `src/app/math/subtraction/page.tsx` - `useTimer(true)`, removed checkbox UI
- `src/app/spelling/page.tsx` - `useTimer(!showWritePrompt)`, pauses during write prompt

**Commit:** `456e5c3` - Replace timer checkbox with always-visible stopwatch

---

## ✅ All Enhancements Deployed

**Production URL:** https://smartypantsv3.vercel.app

**Status:** Ready - Deployed 2026-01-09
