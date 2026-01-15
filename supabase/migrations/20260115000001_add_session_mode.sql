-- =====================================================
-- Migration: Add mode column to sessions table
-- =====================================================
-- Created: 2026-01-15
-- Description: Distinguishes study (25-question game) from
--              test (16-question homework-like) modes
-- =====================================================

-- Add mode column with default 'study' for backward compatibility
ALTER TABLE sessions
ADD COLUMN mode TEXT NOT NULL DEFAULT 'study'
CHECK (mode IN ('study', 'test'));

-- Create index for efficient mode-based queries
CREATE INDEX idx_sessions_mode ON sessions(mode);

-- Add comment for documentation
COMMENT ON COLUMN sessions.mode IS 'Game mode: study (25 questions with gamification) or test (16 questions, homework-like)';

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Existing sessions default to 'study' mode
-- New sessions can specify 'study' or 'test'
-- =====================================================
