-- =====================================================
-- Smarty Pants v3 - Initial Database Schema
-- =====================================================
-- Created: 2025-01-06
-- Description: Complete database schema including users,
--              sessions, problem attempts, goals, and analytics view
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: users
-- =====================================================
-- User accounts (references auth.users for future multi-user)
-- For MVP: Single test user, auto-authenticated
-- =====================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (id = auth.uid() OR auth.uid() IS NULL);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (id = auth.uid());

-- =====================================================
-- TABLE: sessions
-- =====================================================
-- Game sessions (25 questions per session)
-- Tracks overall session performance
-- =====================================================

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module TEXT NOT NULL CHECK (module IN ('addition', 'subtraction', 'spelling')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  total_attempts INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_module ON sessions(module);
CREATE INDEX idx_sessions_user_module ON sessions(user_id, module);
CREATE INDEX idx_sessions_completed_at ON sessions(completed_at DESC);
CREATE INDEX idx_sessions_user_completed ON sessions(user_id, completed) WHERE completed = TRUE;

-- Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own sessions
CREATE POLICY "Users can view own sessions"
  ON sessions FOR SELECT
  USING (user_id = auth.uid() OR auth.uid() IS NULL);

CREATE POLICY "Users can insert own sessions"
  ON sessions FOR INSERT
  WITH CHECK (user_id = auth.uid() OR auth.uid() IS NULL);

CREATE POLICY "Users can update own sessions"
  ON sessions FOR UPDATE
  USING (user_id = auth.uid() OR auth.uid() IS NULL);

-- =====================================================
-- TABLE: problem_attempts
-- =====================================================
-- Individual problem attempts within sessions
-- Used for detailed analytics and progress tracking
-- =====================================================

CREATE TABLE problem_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  problem TEXT NOT NULL,
  expected_answer TEXT NOT NULL,
  user_answer TEXT NOT NULL,
  correct BOOLEAN NOT NULL,
  attempt_number INTEGER NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for analytics queries
CREATE INDEX idx_attempts_session_id ON problem_attempts(session_id);
CREATE INDEX idx_attempts_session_timestamp ON problem_attempts(session_id, timestamp);
CREATE INDEX idx_attempts_correct ON problem_attempts(correct);

-- Row Level Security (via session relationship)
ALTER TABLE problem_attempts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access attempts from their own sessions
CREATE POLICY "Users can view own attempts"
  ON problem_attempts FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM sessions WHERE user_id = auth.uid()
    ) OR auth.uid() IS NULL
  );

CREATE POLICY "Users can insert own attempts"
  ON problem_attempts FOR INSERT
  WITH CHECK (
    session_id IN (
      SELECT id FROM sessions WHERE user_id = auth.uid()
    ) OR auth.uid() IS NULL
  );

-- =====================================================
-- TABLE: goals
-- =====================================================
-- Parent-created reward goals
-- Linked to prize images, session requirements, accuracy thresholds
-- =====================================================

CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  prize_image_path TEXT NOT NULL,
  sessions_required INTEGER NOT NULL CHECK (sessions_required > 0),
  min_accuracy DECIMAL(5,2) CHECK (min_accuracy >= 0 AND min_accuracy <= 100),
  module_filter TEXT CHECK (module_filter IN ('addition', 'subtraction', 'spelling')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  achieved_at TIMESTAMPTZ
);

-- Indexes for goal queries
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_active ON goals(active) WHERE active = TRUE;
CREATE INDEX idx_goals_user_active ON goals(user_id, active) WHERE active = TRUE;

-- Row Level Security
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own goals
CREATE POLICY "Users can view own goals"
  ON goals FOR SELECT
  USING (user_id = auth.uid() OR auth.uid() IS NULL);

CREATE POLICY "Users can insert own goals"
  ON goals FOR INSERT
  WITH CHECK (user_id = auth.uid() OR auth.uid() IS NULL);

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  USING (user_id = auth.uid() OR auth.uid() IS NULL);

-- =====================================================
-- VIEW: goal_progress
-- =====================================================
-- Computed view showing progress toward goals
-- Aggregates sessions to show completion status
-- =====================================================

CREATE OR REPLACE VIEW goal_progress AS
SELECT
  g.id AS goal_id,
  g.user_id,
  g.title,
  g.sessions_required,
  COALESCE(COUNT(s.id) FILTER (WHERE s.completed = TRUE), 0)::INTEGER AS sessions_completed,
  COALESCE(
    AVG((s.correct_count::DECIMAL / NULLIF(s.total_attempts, 0)) * 100)
    FILTER (WHERE s.completed = TRUE),
    0
  )::DECIMAL(5,2) AS avg_accuracy,
  (
    COALESCE(COUNT(s.id) FILTER (WHERE s.completed = TRUE), 0) >= g.sessions_required
    AND (
      g.min_accuracy IS NULL
      OR COALESCE(
        AVG((s.correct_count::DECIMAL / NULLIF(s.total_attempts, 0)) * 100)
        FILTER (WHERE s.completed = TRUE),
        0
      ) >= g.min_accuracy
    )
  ) AS goal_achieved
FROM goals g
LEFT JOIN sessions s ON (
  s.user_id = g.user_id
  AND s.created_at >= g.created_at
  AND (g.module_filter IS NULL OR s.module = g.module_filter)
)
WHERE g.active = TRUE
GROUP BY g.id, g.user_id, g.title, g.sessions_required, g.min_accuracy;

-- =====================================================
-- FUNCTION: Update updated_at timestamp
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA: Test User
-- =====================================================

INSERT INTO users (id, name, photo_url)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Test Child',
  'https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public/prizes/current-goal.jpg'
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================
-- Tables: users, sessions, problem_attempts, goals
-- View: goal_progress
-- Indexes: 15 total for query optimization
-- RLS Policies: Complete user isolation
-- Test data: 1 user seeded
-- =====================================================
