# Database Migration Deployment Instructions

## Method 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://supabase.com/dashboard/project/kwvqxvyklsrkfgykmtfu
2. Navigate to **SQL Editor** in the left sidebar
3. Click **+ New Query**
4. Copy the entire contents of `supabase/migrations/20250106000001_initial_schema.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Verify success: You should see "Success. No rows returned"

## Method 2: Via Supabase CLI (If Installed)

```bash
# If you have Supabase CLI installed
supabase db push
```

## Verification Steps

After running the migration, verify the tables were created:

1. In Supabase Dashboard, go to **Database** → **Tables**
2. You should see 4 tables:
   - `users` (with 1 test user)
   - `sessions`
   - `problem_attempts`
   - `goals`

3. Go to **Database** → **Schema Visualizer** to see the relationships

4. Verify the test user exists:
   - Go to **Table Editor** → `users` table
   - You should see one row with:
     - id: `00000000-0000-0000-0000-000000000001`
     - name: `Test Child`

## Next Steps

After successful migration deployment:
1. Run `npm run dev` to start the development server
2. Visit http://localhost:3000
3. You should see the landing page with "Foundation complete!" message
