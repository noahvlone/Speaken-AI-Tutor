-- Gamification V2 Migration
-- Adds level system, daily goals enhancements
-- COMPATIBLE with existing 008_user_settings.sql

-- Add new columns to existing user_settings table if not exists
DO $$ 
BEGIN
  -- Add current_level column for beginner/intermediate/advanced
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='user_settings' AND column_name='english_level') THEN
    ALTER TABLE user_settings ADD COLUMN english_level VARCHAR(20) DEFAULT 'intermediate';
  END IF;

  -- Add daily_xp_goal column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='user_settings' AND column_name='daily_xp_goal') THEN
    ALTER TABLE user_settings ADD COLUMN daily_xp_goal INTEGER DEFAULT 50;
  END IF;
END $$;

-- Add level column to leaderboard_entries if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='leaderboard_entries' AND column_name='level') THEN
    ALTER TABLE leaderboard_entries ADD COLUMN level INTEGER DEFAULT 1;
  END IF;
END $$;

-- Create XP logs table for tracking XP sources (if not exists)
CREATE TABLE IF NOT EXISTS xp_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for daily XP calculation
CREATE INDEX IF NOT EXISTS idx_xp_logs_user_date 
ON xp_logs(user_id, created_at DESC);

-- Enable RLS on xp_logs
ALTER TABLE xp_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view own XP logs" ON xp_logs;
DROP POLICY IF EXISTS "Users can insert own XP logs" ON xp_logs;

-- RLS Policies for xp_logs
CREATE POLICY "Users can view own XP logs"
  ON xp_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own XP logs"
  ON xp_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

COMMENT ON TABLE xp_logs IS 'Tracks XP earned by users from various sources';
