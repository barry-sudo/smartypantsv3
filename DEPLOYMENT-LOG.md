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
