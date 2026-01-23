-- =====================================================
-- Spelling Words Table
-- =====================================================
-- Purpose: Store spelling words for practice sessions
-- Features: Audio verification, grade level tracking, soft delete
-- Created: 2026-01-23

CREATE TABLE spelling_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL UNIQUE,
  audio_path TEXT NOT NULL,  -- Supabase Storage path: audio/spelling/{word}.m4a
  audio_verified BOOLEAN DEFAULT false,
  grade_level INTEGER,  -- 1, 2, 3, etc.
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  notes TEXT,
  active BOOLEAN DEFAULT true,  -- Soft delete: set false instead of deleting
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Indexes for Performance
-- =====================================================

-- Index for active words (most common query)
CREATE INDEX idx_spelling_words_active ON spelling_words(active) WHERE active = true;

-- Index for grade level filtering
CREATE INDEX idx_spelling_words_grade ON spelling_words(grade_level) WHERE grade_level IS NOT NULL;

-- Index for word lookups (admin search)
CREATE INDEX idx_spelling_words_word ON spelling_words(word);

-- =====================================================
-- Trigger: Auto-update updated_at Timestamp
-- =====================================================

CREATE OR REPLACE FUNCTION update_spelling_words_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER spelling_words_updated_at
  BEFORE UPDATE ON spelling_words
  FOR EACH ROW
  EXECUTE FUNCTION update_spelling_words_updated_at();

-- =====================================================
-- Table Comment
-- =====================================================

COMMENT ON TABLE spelling_words IS 'Spelling words for practice sessions with audio verification';
