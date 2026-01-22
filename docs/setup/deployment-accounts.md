# External Accounts & Deployment Configuration

**Purpose:** Prevent deployment failures caused by account mismatches

**Last Updated:** January 22, 2026
**Project:** Smarty Pants v3
**Production URL:** https://smartypantsv3.vercel.app

---

## Account Inventory

### Authentication & Database: Supabase

**Service Name:** Supabase
**Account Owner:** barry.gilbert.personal@gmail.com
**Project Name:** smartypantsv3
**Purpose:** PostgreSQL database, authentication, and file storage (CDN)
**Dashboard URL:** https://supabase.com/dashboard/project/[project-id]

**Required Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public, safe for client)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (public, RLS-protected)
- `SUPABASE_SERVICE_ROLE_KEY` - Admin key with RLS bypass (PRIVATE - local dev only, NOT in Vercel)

**Database Tables:**
- `users` - User accounts
- `sessions` - Game session tracking (Study/Test modes)
- `problem_attempts` - Individual answer attempts
- `goals` - Parent-created reward goals

**Storage Buckets:**
- `images/` - Tiger reveal images (5 files)
- `videos/` - Celebration videos (3 files)
- `audio/` - Tiger roar + 172 spelling word pronunciations
- `prizes/` - Current goal prize photo (`current-goal.jpg`)

**Migrations:**
Located in `/supabase/migrations/`:
- `20250106000001_initial_schema.sql` - Initial database schema
- `20250108000001_disable_rls_mvp.sql` - Disable RLS for MVP
- `20260110000001_add_multiplication_module.sql` - Add multiplication to CHECK constraint
- `20260115000001_add_session_mode.sql` - Add Study/Test mode tracking

**How to Access:**
1. Go to https://supabase.com
2. Log in with barry.gilbert.personal@gmail.com
3. Select "smartypantsv3" project
4. Navigate to desired section:
   - Database → Tables Editor (view/edit data)
   - Database → SQL Editor (run migrations)
   - Storage → Manage buckets and files
   - Settings → API (get environment variables)

**Key Update Notes:**
- Supabase migrated from legacy JWT keys to new format (Jan 2026)
- Old format: `eyJhbGc...` (JWT)
- New format: `sb_publishable_...` (publishable key)
- ALWAYS use new format keys from Supabase API Settings page

---

### Hosting & Deployment: Vercel

**Service Name:** Vercel
**Account Owner:** ⚠️ REQUIRES MANUAL VERIFICATION
**Project Name:** smartypantsv3
**Purpose:** Frontend hosting, automatic deployments from GitHub
**Dashboard URL:** https://vercel.com/dashboard

**GitHub Integration:**
- Repository: https://github.com/barry-sudo/smartypantsv3
- Repository Owner: barry-sudo
- Auto-deploy branch: `main`

**Required Environment Variables (Set in Vercel Dashboard):**
- `NEXT_PUBLIC_SUPABASE_URL` - Same as local `.env.local`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Same as local `.env.local`
- **DO NOT SET** `SUPABASE_SERVICE_ROLE_KEY` in Vercel (security risk)

**Build Configuration:**
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next/`
- Install Command: `npm install`
- Node Version: 18.x (or latest LTS)

**How to Access:**
1. Go to https://vercel.com
2. Log in with [account that owns smartypantsv3 project]
3. Select "smartypantsv3" project
4. Navigate to desired section:
   - Deployments → View deployment history
   - Settings → Environment Variables (configure env vars)
   - Settings → Git (manage GitHub integration)
   - Settings → Domains (manage custom domains)

**Deployment Trigger:**
- Every push to `main` branch triggers automatic deployment
- Vercel clones repo, runs `npm install`, `npm run build`, then deploys
- Build typically takes 1-2 minutes

---

### Version Control: GitHub

**Service Name:** GitHub
**Account Owner:** barry-sudo
**Repository Name:** smartypantsv3
**Purpose:** Source code version control, CI/CD integration with Vercel
**Repository URL:** https://github.com/barry-sudo/smartypantsv3

**Repository Settings:**
- Visibility: Private (assumed)
- Default Branch: `main`
- Protected Branches: None detected (consider protecting `main`)

**Connected Services:**
- Vercel (auto-deploy on push)

**Collaborators:**
- ⚠️ REQUIRES MANUAL VERIFICATION

**How to Access:**
1. Go to https://github.com/barry-sudo/smartypantsv3
2. Log in with account that owns repository

---

## Critical Configuration Requirements

### Git Configuration

⚠️ **CRITICAL**: Your local Git config MUST match the GitHub repository owner account.

**Check current config:**
```bash
git config user.name
git config user.email
```

**Current values (as of Jan 22, 2026):**
- `user.name`: `bazzagilbert`
- `user.email`: `barry.gilbert.personal@gmail.com`

**Expected values:**
- `user.name`: `bazzagilbert` ✅ (matches)
- `user.email`: `barry.gilbert.personal@gmail.com` ✅ (matches GitHub account)

**Update if incorrect:**
```bash
git config user.name "bazzagilbert"
git config user.email "barry.gilbert.personal@gmail.com"
```

### Why This Matters

**Git ↔ GitHub ↔ Vercel Integration:**
1. You commit code locally with Git credentials
2. Push to GitHub repository (must have access with that email)
3. GitHub notifies Vercel of new commits
4. Vercel pulls code and deploys

**If Git email doesn't match GitHub account:**
- Commits may be attributed to wrong user
- GitHub may reject pushes (if email not verified)
- Vercel may fail to trigger deployments

**If Vercel account doesn't have access to GitHub repo:**
- Deployments will fail silently
- Must re-authorize GitHub integration in Vercel settings

---

## Verification Steps

### After Initial Setup

1. **Verify Git configuration:**
   ```bash
   git config user.name
   git config user.email
   # Should match GitHub account
   ```

2. **Test Git push:**
   ```bash
   git status
   git add .
   git commit -m "test: verify deployment"
   git push origin main
   # Should succeed without errors
   ```

3. **Check Vercel deployment:**
   - Go to Vercel dashboard
   - Navigate to smartypantsv3 project
   - Check "Deployments" tab
   - Should see new deployment in progress (within 30 seconds of push)

4. **Verify production URL:**
   - Wait for deployment to complete (1-2 minutes)
   - Visit https://smartypantsv3.vercel.app
   - Should see latest changes

5. **Test Supabase connection:**
   - Visit https://smartypantsv3.vercel.app/progress
   - Should load analytics (confirms database connection)
   - Visit https://smartypantsv3.vercel.app/admin
   - Enter PIN: 2018
   - Should see goal management (confirms auth working)

### What Success Looks Like

- ✅ Git commits show correct author email
- ✅ `git push` succeeds without authentication errors
- ✅ Vercel deployments trigger automatically within 30 seconds
- ✅ Production site shows latest code changes
- ✅ All database queries work (progress page loads)
- ✅ Admin authentication works (PIN 2018)
- ✅ No console errors related to Supabase connection

---

## Troubleshooting

### Issue 1: Vercel Deployment Fails with "Missing NEXT_PUBLIC_SUPABASE_URL"

**Symptom:** Build fails with error about missing environment variables

**Cause:** Environment variables not configured in Vercel dashboard

**Fix:**
1. Go to Vercel dashboard → smartypantsv3 project
2. Navigate to Settings → Environment Variables
3. Add the following variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = `[value from local .env.local]`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `[value from local .env.local]`
4. Ensure they're set for "Production", "Preview", and "Development" environments
5. Trigger new deployment (push to GitHub or use "Redeploy" button)

### Issue 2: Database Operations Fail with 409 Conflict

**Symptom:** Sessions don't save, console shows 409 error from Supabase

**Cause 1:** Supabase API key format outdated (old JWT vs new publishable key)

**Fix:**
1. Go to Supabase dashboard → smartypantsv3 project
2. Navigate to Settings → API
3. Copy the **Publishable** anon key (starts with `sb_publishable_...`)
4. Update `NEXT_PUBLIC_SUPABASE_ANON_KEY` in:
   - Local `.env.local` file
   - Vercel dashboard environment variables
5. Redeploy

**Cause 2:** Foreign key constraint violation (user ID mismatch)

**Fix:**
1. Check Supabase dashboard → Database → Table Editor
2. Verify user exists in `users` table
3. Code should query actual user from database, not hardcode ID
4. See `src/lib/auth/index.ts` for reference implementation

### Issue 3: Git Push Rejected

**Symptom:** `git push` fails with authentication error or permission denied

**Cause:** Git credentials don't match GitHub account with repository access

**Fix:**
1. Verify GitHub account:
   ```bash
   git config user.email
   # Should be barry.gilbert.personal@gmail.com (or account that owns repo)
   ```

2. Update if wrong:
   ```bash
   git config user.email "barry.gilbert.personal@gmail.com"
   ```

3. If still fails, check GitHub personal access token:
   - GitHub may require token instead of password
   - Generate at: Settings → Developer settings → Personal access tokens
   - Use token as password when pushing

### Issue 4: Supabase Storage Assets Not Loading

**Symptom:** Images, videos, or audio files return 404 or CORS errors

**Cause:** Storage bucket not public or incorrect file paths

**Fix:**
1. Go to Supabase dashboard → Storage
2. For each bucket (images, videos, audio, prizes):
   - Click bucket name
   - Click "Settings" (gear icon)
   - Ensure "Public bucket" is enabled
3. Verify file paths in code match actual storage structure
4. Check `src/lib/assets.ts` for correct URLs

### Issue 5: Vercel Deployment Succeeds but Site Shows Old Code

**Symptom:** Deployment completes but production site doesn't reflect changes

**Cause:** Browser cache or CDN cache not cleared

**Fix:**
1. Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache completely
3. Try incognito/private browsing window
4. Check Vercel dashboard → Deployments → Click latest deployment
5. Verify deployment URL shows new code
6. Wait 1-2 minutes for CDN propagation

---

## Environment Variables

### Required Variables by Service

**Supabase (3 variables):**
```bash
# Public - safe for client-side code
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co

# Public - RLS-protected anon key (NEW FORMAT)
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_[long-key-here]

# Private - ONLY use locally, NEVER in Vercel
SUPABASE_SERVICE_ROLE_KEY=sb_secret_[long-key-here]
```

**How to obtain from Supabase:**
1. Go to https://supabase.com/dashboard/project/[project-id]
2. Navigate to Settings → API
3. Find "Project URL" → Copy to `NEXT_PUBLIC_SUPABASE_URL`
4. Find "Project API keys" → Copy "anon" "public" key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Find "service_role" "secret" key → `SUPABASE_SERVICE_ROLE_KEY` (local only)

**How to set in Vercel:**
1. Go to Vercel dashboard → smartypantsv3 project
2. Navigate to Settings → Environment Variables
3. Click "Add New" for each variable:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: [paste from Supabase]
   - Environments: Check all (Production, Preview, Development)
   - Click "Save"
4. Repeat for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. **DO NOT** add `SUPABASE_SERVICE_ROLE_KEY` to Vercel (security risk)
6. Trigger new deployment after adding variables

**How to set locally:**
1. Create `.env.local` file in project root (if doesn't exist)
2. Add all 3 variables:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_[key]
   SUPABASE_SERVICE_ROLE_KEY=sb_secret_[key]
   ```
3. **NEVER commit `.env.local` to Git** (already in `.gitignore`)
4. Restart dev server: `npm run dev`

---

## New Developer Setup Checklist

### Prerequisites
- [ ] Git installed
- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] Access to GitHub repository (barry-sudo/smartypantsv3)
- [ ] Access to Supabase project (barry.gilbert.personal@gmail.com account)
- [ ] Access to Vercel project (account with smartypantsv3 access)

### Initial Setup
- [ ] Clone repository:
  ```bash
  git clone https://github.com/barry-sudo/smartypantsv3.git
  cd smartypantsv3
  ```

- [ ] Configure Git with correct credentials:
  ```bash
  git config user.name "bazzagilbert"
  git config user.email "barry.gilbert.personal@gmail.com"
  ```

- [ ] Verify Git config:
  ```bash
  git config user.name   # Should show: bazzagilbert
  git config user.email  # Should show: barry.gilbert.personal@gmail.com
  ```

- [ ] Install dependencies:
  ```bash
  npm install
  ```

- [ ] Create `.env.local` file with Supabase credentials:
  ```bash
  # Get values from: https://supabase.com/dashboard/project/[id]/settings/api
  touch .env.local
  # Then add the 3 environment variables (see "Environment Variables" section above)
  ```

- [ ] Test local build:
  ```bash
  npm run build
  # Should complete without errors
  ```

- [ ] Start dev server:
  ```bash
  npm run dev
  # Visit http://localhost:3000
  ```

### Verify Local Setup
- [ ] Home page loads at http://localhost:3000
- [ ] Math games work (addition, subtraction, multiplication)
- [ ] Spelling game works
- [ ] Progress dashboard shows data
- [ ] Admin panel accessible (3-second press on logo, PIN: 2018)
- [ ] No console errors related to Supabase

### Test Deployment Flow
- [ ] Create test branch:
  ```bash
  git checkout -b test-deployment
  ```

- [ ] Make small change (e.g., update README)

- [ ] Commit and push:
  ```bash
  git add .
  git commit -m "test: verify deployment setup"
  git push origin test-deployment
  ```

- [ ] Check Vercel dashboard for preview deployment

- [ ] Verify preview URL works

- [ ] Merge to main (if testing main branch deployment):
  ```bash
  git checkout main
  git merge test-deployment
  git push origin main
  ```

- [ ] Verify production deployment triggered

- [ ] Check https://smartypantsv3.vercel.app for changes

---

## Related Documentation

- [Architecture Overview](../architecture/overview.md)
- [Database Schema](../api/database-schema.md)
- [Deployment Log](../../DEPLOYMENT-LOG.md)
- [Main Documentation](../../.claude/CLAUDE.md)

---

## ⚠️ REQUIRES MANUAL COMPLETION

The following information could not be automatically determined and must be added by the repository owner:

### 1. Vercel Account Owner
- **Current value:** UNKNOWN
- **Action required:** Add the email address of the Vercel account that owns the smartypantsv3 project
- **How to find:**
  1. Log into Vercel
  2. Go to Account Settings
  3. Check email address
- **Update this section with:** `Account Owner: [email]`

### 2. GitHub Repository Collaborators
- **Current value:** UNKNOWN
- **Action required:** List all GitHub users with access to barry-sudo/smartypantsv3 repository
- **How to find:**
  1. Go to https://github.com/barry-sudo/smartypantsv3
  2. Navigate to Settings → Collaborators
  3. List all users
- **Update "GitHub" section with collaborator list**

### 3. Supabase Project Collaborators
- **Current value:** UNKNOWN (only owner known: barry.gilbert.personal@gmail.com)
- **Action required:** List all users with access to Supabase project
- **How to find:**
  1. Go to Supabase dashboard
  2. Navigate to Settings → Team
  3. List all members
- **Update "Supabase" section with collaborator list**

### 4. Emergency Contacts
- **Action required:** Add emergency contact information for account recovery
- **Recommended information:**
  - Primary contact: [name, email, phone]
  - Secondary contact: [name, email, phone]
  - Password manager location (if applicable)
  - Account recovery procedures

---

## Change History

| Date | Change | Reason |
|------|--------|--------|
| 2026-01-22 | Initial creation | Document external accounts after comprehensive investigation |

---

## Account Matching Verification

**Last Verified:** 2026-01-22

### Git ↔ GitHub
- ✅ Git email (barry.gilbert.personal@gmail.com) matches GitHub repository owner account
- ✅ Commits attributed to correct user
- ✅ Push access confirmed

### GitHub ↔ Vercel
- ⚠️ **NEEDS MANUAL VERIFICATION**
- **To verify:**
  1. Log into Vercel
  2. Check account email matches GitHub account with repository access
  3. Verify GitHub integration is authorized
  4. Confirm smartypantsv3 repository is connected

### Vercel ↔ Supabase
- ✅ Environment variables configured correctly
- ✅ Supabase URL and keys present in Vercel dashboard
- ✅ Production deployments connect to Supabase successfully
- ✅ No 401/403 authentication errors in production logs

### Critical: All Accounts Use Same Email?
- GitHub repository owner: barry-sudo (likely uses barry.gilbert.personal@gmail.com)
- Supabase project owner: barry.gilbert.personal@gmail.com ✅
- Vercel project owner: ⚠️ UNKNOWN - **verify same email**
- Git local config: barry.gilbert.personal@gmail.com ✅

**Recommendation:** Ensure all services use the same email (barry.gilbert.personal@gmail.com) to prevent account mismatch issues.
