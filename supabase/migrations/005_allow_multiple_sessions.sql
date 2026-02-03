-- ============================================
-- MIGRATION: Allow Multiple Sessions Per Day
-- Drop the unique constraint on user_id + session_date
-- to allow users to save multiple roleplay sessions per day
-- ============================================

-- Drop the unique constraint that prevents multiple sessions per day
ALTER TABLE user_progress 
DROP CONSTRAINT IF EXISTS user_progress_user_id_session_date_key;

-- Add an id column if it doesn't exist (for unique primary key)
-- This ensures each session has its own unique identifier
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_progress' AND column_name = 'id'
  ) THEN
    ALTER TABLE user_progress 
    ADD COLUMN id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
  END IF;
END $$;

-- Recreate index without unique constraint for better query performance
DROP INDEX IF EXISTS idx_user_progress_user_date;
CREATE INDEX idx_user_progress_user_date ON user_progress(user_id, session_date DESC);

-- ============================================
-- Migration Complete!
-- Now users can save multiple sessions per day
-- ============================================
