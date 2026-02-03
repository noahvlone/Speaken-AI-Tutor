-- ============================================
-- FIX: History Tracking & Multiple Sessions
-- Combined migration to ensure history works correctly
-- ============================================

-- 1. Ensure detailed feedback columns exist
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS transcript TEXT,
ADD COLUMN IF NOT EXISTS common_mistakes JSONB,
ADD COLUMN IF NOT EXISTS ai_suggestions JSONB,
ADD COLUMN IF NOT EXISTS feedback_summary TEXT;

-- 2. Allow Multiple Sessions Per Day
-- Drop the unique constraint on user_id + session_date
ALTER TABLE user_progress 
DROP CONSTRAINT IF EXISTS user_progress_user_id_session_date_key;

-- 3. Add ID column if missing (needed for unique row identification)
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

-- 4. Recreate index for better performance
DROP INDEX IF EXISTS idx_user_progress_user_date;
CREATE INDEX idx_user_progress_user_date ON user_progress(user_id, session_date DESC);
