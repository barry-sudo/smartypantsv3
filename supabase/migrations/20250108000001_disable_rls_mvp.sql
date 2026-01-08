-- =====================================================
-- Smarty Pants v3 - Disable RLS for MVP Development
-- =====================================================
-- Date: 2026-01-08
-- Purpose: Allow unauthenticated database operations for MVP
-- IMPORTANT: Re-enable in Phase 4 when adding real auth
-- =====================================================

-- Disable RLS on sessions table
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;

-- Disable RLS on problem_attempts table
ALTER TABLE problem_attempts DISABLE ROW LEVEL SECURITY;

-- Verify RLS status (should return 'false' for both)
SELECT
  tablename,
  rowsecurity,
  CASE
    WHEN rowsecurity THEN '❌ RLS Enabled'
    ELSE '✅ RLS Disabled (MVP)'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('sessions', 'problem_attempts')
ORDER BY tablename;

-- =====================================================
-- Expected output:
--    tablename        | rowsecurity |      status
-- --------------------+-------------+------------------
--  problem_attempts   | f           | ✅ RLS Disabled (MVP)
--  sessions           | f           | ✅ RLS Disabled (MVP)
-- =====================================================

-- Note: To re-enable RLS in Phase 4, run:
-- ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE problem_attempts ENABLE ROW LEVEL SECURITY;
