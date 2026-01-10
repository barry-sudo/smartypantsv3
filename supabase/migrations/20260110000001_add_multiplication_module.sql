-- =====================================================
-- Migration: Add multiplication module support
-- =====================================================
-- Created: 2026-01-10
-- Description: Updates sessions table CHECK constraint to allow
--              'multiplication' as a valid module type
-- =====================================================

-- Drop the existing constraint
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_module_check;

-- Add updated constraint with multiplication included
ALTER TABLE sessions ADD CONSTRAINT sessions_module_check
  CHECK (module IN ('addition', 'subtraction', 'multiplication', 'spelling'));

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
