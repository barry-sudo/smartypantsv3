# Build Spec: Phase 1 - Foundation

**Phase:** 1  
**Feature:** Next.js scaffolding + Database + Authentication  
**Complexity:** Medium  
**Estimated Time:** ~4 hours  
**Status:** ⏳ Not Started

---

## Objective

Create Next.js 14 application with TypeScript, connect to Supabase, implement database schema with migrations, set up authentication, and create asset manifest for CDN resources.

---

## Prerequisites

**Must be complete before starting:**
- [x] Phase 0: Supabase project created
- [x] Phase 0: All assets uploaded to storage
- [x] `.env.local` file with Supabase credentials
- [x] `ASSET-URLS.md` with asset paths

---

## What to Build

### Files to Create

**Next.js scaffolding:**
1. Initialize Next.js project via `create-next-app`
2. Configure TypeScript, Tailwind, ESLint
3. Set up project structure

**Supabase integration:**
1. `src/lib/supabase/client.ts` - Supabase client configuration
2. `src/lib/supabase/queries/users.ts` - User queries
3. `src/lib/supabase/queries/sessions.ts` - Session queries stub (for Phase 2)

**Database migrations:**
1. `supabase/migrations/20250106000001_initial_schema.sql` - Complete schema

**Asset manifest:**
1. `src/lib/assets.ts` - All CDN URLs centralized

**Type definitions:**
1. `src/types/index.ts` - Core TypeScript interfaces
2. `src/types/database.ts` - Database types (generated from schema)

**Authentication:**
1. `src/lib/auth/index.ts` - Auth utilities
2. `src/hooks/useAuth.ts` - Auth hook

**Basic pages:**
1. `src/app/page.tsx` - Landing page (placeholder)
2. `src/app/layout.tsx` - Root layout

**Configuration:**
1. `next.config.js` - Next.js configuration
2. `tailwind.config.ts` - Tailwind with theme colors
3. `.eslintrc.json` - ESLint rules
4. `tsconfig.json` - TypeScript configuration
5. `vitest.config.ts` - Test configuration

---

## Component/Module Specifications

### 1. Next.js Project Initialization

**Command:**
```bash
npx create-next-app@latest smarty-pants-v3 \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --no-import-alias
```

**Configuration choices:**
- TypeScript: Yes
- ESLint: Yes  
- Tailwind CSS: Yes
- `src/` directory: Yes
- App Router: Yes
- Customize import alias: No (use default @/)

**Additional packages to install:**
```bash
npm install @supabase/supabase-js
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitejs/plugin-react
```

---

### 2. Supabase Client

**Location:** `src/lib/supabase/client.ts`

**Purpose:** Centralized Supabase client singleton

```typescript
import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
```

**Testing:** Verify client connects by querying `users` table (should be empty initially)

---

### 3. Database Migration

**Location:** `supabase/migrations/20250106000001_initial_schema.sql`

**Content:** Complete schema from `docs/architecture/overview.md`

```sql
-- Copy complete schema from architecture/overview.md
-- Including:
-- - users table
-- - sessions table
-- - problem_attempts table
-- - goals table
-- - goal_progress view
-- - All indexes
-- - All RLS policies
```

**Run migration:**
```bash
# Option 1: Via Supabase dashboard (SQL Editor → paste → run)
# Option 2: Via CLI (if installed)
supabase db push
```

**Seed data (for testing):**
```sql
-- Create default test user
INSERT INTO users (id, name, photo_url)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Test Child',
  'https://[project].supabase.co/storage/v1/object/public/prizes/current-goal.jpg'
) ON CONFLICT DO NOTHING;
```

---

### 4. Asset Manifest

**Location:** `src/lib/assets.ts`

**Purpose:** Centralize all CDN URLs for images, videos, audio

```typescript
const BASE_URL = 'https://[your-project-id].supabase.co/storage/v1/object/public';

export const ASSETS = {
  images: [
    `${BASE_URL}/images/image1.jpg`,
    `${BASE_URL}/images/image2.jpg`,
    `${BASE_URL}/images/image3.jpg`,
    `${BASE_URL}/images/image4.jpg`,
    `${BASE_URL}/images/image5.jpg`,
  ],
  
  videos: [
    `${BASE_URL}/videos/video1.mp4`,
    `${BASE_URL}/videos/video2.mp4`,
    `${BASE_URL}/videos/video3.mp4`,
  ],
  
  tigerRoar: `${BASE_URL}/audio/tigerroar.mp3`,
  
  // Helper function to get spelling audio URL
  getSpellingAudio: (word: string): string => {
    return `${BASE_URL}/audio/spelling/${word.toLowerCase()}.m4a`;
  },
  
  currentPrize: `${BASE_URL}/prizes/current-goal.jpg`,
} as const;

// For TypeScript: images array is readonly
export type ImageAsset = typeof ASSETS.images[number];
export type VideoAsset = typeof ASSETS.videos[number];
```

**Replace `[your-project-id]` with actual Supabase project ID**

---

### 5. Type Definitions

**Location:** `src/types/index.ts`

```typescript
export type GameModule = 'addition' | 'subtraction' | 'spelling';

export interface User {
  id: string;
  name: string;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

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
  created_at: string;
}

export interface ProblemAttempt {
  id: string;
  session_id: string;
  problem: string;
  expected_answer: string;
  user_answer: string;
  correct: boolean;
  attempt_number: number;
  timestamp: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  prize_image_path: string;
  sessions_required: number;
  min_accuracy: number | null;
  module_filter: GameModule | null;
  active: boolean;
  created_at: string;
  achieved_at: string | null;
}

export interface GoalProgress {
  goal_id: string;
  user_id: string;
  title: string;
  sessions_required: number;
  sessions_completed: number;
  avg_accuracy: number;
  goal_achieved: boolean;
}

export interface Problem {
  num1: number;
  num2: number;
  answer: number;
  operation: 'addition' | 'subtraction';
}
```

---

### 6. Authentication Setup

**Location:** `src/lib/auth/index.ts`

```typescript
import { supabase } from '../supabase/client';
import type { User } from '@/types';

/**
 * Get current authenticated user
 * For MVP: Returns hardcoded test user
 * Future: Implement real auth flow
 */
export async function getCurrentUser(): Promise<User | null> {
  // For MVP: Auto-authenticate as test user
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', '00000000-0000-0000-0000-000000000001')
    .single();
  
  if (error) {
    console.error('Failed to get user:', error);
    return null;
  }
  
  return data;
}

/**
 * Sign in (MVP: no-op, always returns test user)
 * Future: Implement with supabase.auth.signInWithPassword()
 */
export async function signIn(): Promise<User | null> {
  return getCurrentUser();
}

/**
 * Sign out (MVP: no-op)
 * Future: Implement with supabase.auth.signOut()
 */
export async function signOut(): Promise<void> {
  // No-op for MVP
  console.log('Sign out called (no-op in MVP)');
}
```

**Location:** `src/hooks/useAuth.ts`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/auth';
import type { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
```

---

### 7. Tailwind Configuration

**Location:** `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        jungle: {
          dark: '#2d5016',
          DEFAULT: '#4a7c2c',
          light: '#356b1f',
        },
        orange: {
          DEFAULT: '#ff8c3c',
          dark: '#ff6b1a',
        },
      },
      fontFamily: {
        comic: ['"Comic Sans MS"', '"Chalkboard SE"', 'cursive'],
      },
    },
  },
  plugins: [],
};

export default config;
```

**Usage:**
- `bg-jungle-dark` → `#2d5016`
- `text-orange` → `#ff8c3c`
- `font-comic` → Comic Sans MS

---

### 8. Basic Pages

**Location:** `src/app/layout.tsx`

```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Smarty Pants v3',
  description: '2nd grade learning games',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-comic">{children}</body>
    </html>
  );
}
```

**Location:** `src/app/page.tsx`

```typescript
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-jungle-dark via-jungle to-jungle-light flex items-center justify-center">
      <div className="bg-white/95 rounded-[30px] p-16 border-[6px] border-orange text-center">
        <h1 className="text-6xl font-bold text-orange mb-4">
          Smarty Pants
        </h1>
        <p className="text-2xl text-jungle font-bold mb-8">
          2nd Grade Edition
        </p>
        <p className="text-lg text-jungle/70">
          Foundation complete! Ready for game modules.
        </p>
      </div>
    </main>
  );
}
```

---

## Success Criteria

### Project Setup
- [ ] Next.js 14 project created with TypeScript
- [ ] All dependencies installed
- [ ] Dev server starts: `npm run dev`
- [ ] No build errors: `npm run build`
- [ ] ESLint configured and no errors: `npm run lint`

### Supabase Integration
- [ ] Supabase client connects successfully
- [ ] Environment variables loaded correctly
- [ ] Can query users table (returns test user)

### Database
- [ ] Migration runs successfully
- [ ] All 4 tables created (users, sessions, problem_attempts, goals)
- [ ] Goal_progress view created
- [ ] All indexes created
- [ ] All RLS policies active
- [ ] Test user seeded

### Assets
- [ ] `assets.ts` created with all URLs
- [ ] Can import and use: `import { ASSETS } from '@/lib/assets'`
- [ ] URLs point to correct Supabase storage paths

### Authentication
- [ ] `useAuth` hook returns test user
- [ ] `getCurrentUser()` works
- [ ] Auth functions handle errors gracefully

### Types
- [ ] All TypeScript types defined
- [ ] No `any` types used
- [ ] Strict mode enabled

### Pages
- [ ] Landing page renders
- [ ] Tailwind styles work
- [ ] Custom colors available (`bg-jungle`, `text-orange`)
- [ ] Font loads correctly

---

## Testing Requirements

### Manual Tests

**1. Dev server:**
```bash
npm run dev
# Visit http://localhost:3000
# Verify landing page displays with jungle theme
```

**2. Supabase connection:**
```bash
# Add test file: src/test-supabase.ts
import { supabase } from './lib/supabase/client';

async function test() {
  const { data, error } = await supabase.from('users').select('*');
  console.log({ data, error });
}

test();

# Run: npx tsx src/test-supabase.ts
# Should return test user without errors
```

**3. Asset URLs:**
```bash
# Open browser console on landing page
import { ASSETS } from '@/lib/assets';
console.log(ASSETS.images[0]);
# Copy URL, paste in new tab, verify image loads
```

### Unit Tests

Create initial test to verify setup:

**Location:** `src/lib/assets.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { ASSETS } from './assets';

describe('ASSETS', () => {
  it('has 5 images', () => {
    expect(ASSETS.images).toHaveLength(5);
  });
  
  it('has 3 videos', () => {
    expect(ASSETS.videos).toHaveLength(3);
  });
  
  it('generates spelling audio URL', () => {
    const url = ASSETS.getSpellingAudio('and');
    expect(url).toContain('audio/spelling/and.m4a');
  });
});
```

**Run:** `npm test`

---

## Estimated Complexity

**Medium** - ~4 hours

**Breakdown:**
- Next.js setup: 30 minutes
- Supabase integration: 30 minutes
- Database migration: 1 hour
- Asset manifest: 30 minutes
- Auth setup: 45 minutes
- Types: 30 minutes
- Testing: 45 minutes

---

## Dependencies

**External:**
- Supabase project (from Phase 0)
- Assets uploaded (from Phase 0)

**Packages:**
- `@supabase/supabase-js`
- `vitest`, `@testing-library/react`, etc.

---

## Known Issues / Challenges

**Environment variables:**
- Must restart dev server after changing `.env.local`
- Ensure `NEXT_PUBLIC_` prefix on client-side vars

**Database migration:**
- First migration may show warnings (normal)
- Verify in Supabase dashboard: Database → Tables

**Asset URLs:**
- Ensure project ID is correct in `assets.ts`
- Test one URL in browser before proceeding

---

## Reference Materials

**Documentation:**
- Architecture: `docs/architecture/overview.md`
- Database schema: `docs/architecture/overview.md` (Database Design section)
- Rules: `.claude/rules/nextjs-routes.md`, `.claude/rules/supabase-queries.md`

**External:**
- Next.js docs: https://nextjs.org/docs
- Supabase docs: https://supabase.com/docs
- Tailwind docs: https://tailwindcss.com/docs

---

## Completion Checklist

- [ ] Next.js dev server running
- [ ] Landing page displays correctly
- [ ] Supabase connection verified
- [ ] Database schema deployed
- [ ] Test user exists in database
- [ ] Asset manifest created
- [ ] Auth hook works
- [ ] All tests passing
- [ ] No ESLint errors
- [ ] No TypeScript errors
- [ ] Deployed to Vercel preview URL

---

## Completion Report Format

**Status:** ✅ Complete

**Evidence:**
- [ ] Screenshot of landing page
- [ ] Screenshot of Supabase tables (users, sessions, etc.)
- [ ] Test output showing passing tests
- [ ] Preview URL: https://smarty-pants-v3-[branch].vercel.app

**Configuration:**
- Node version: [version]
- Next.js version: 14.x
- Supabase project: [project-id]

**Next steps:**
- Ready for Phase 2A: Subtraction game module
- Foundation solid, patterns established

---

## Notes

**This phase establishes:**
- Project structure (all future code follows this pattern)
- Database connectivity (all modules use this)
- Asset management (all games reference ASSETS)
- Type safety (all code uses these types)
- Auth pattern (extensible to real auth later)

**Critical for all future phases:**
- Don't skip testing the Supabase connection
- Verify asset URLs work before Phase 2
- Ensure test user exists in database
