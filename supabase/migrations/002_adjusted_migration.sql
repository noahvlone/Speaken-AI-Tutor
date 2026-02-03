-- ============================================
-- ADJUSTED MIGRATION SCRIPT
-- Works with existing user_progress table
-- ============================================

-- Step 1: Add missing columns to existing user_progress table
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS prosody_score INTEGER CHECK (prosody_score >= 0 AND prosody_score <= 100);

ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS session_duration_minutes INTEGER;

-- Add constraint if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_progress_user_id_session_date_key'
  ) THEN
    ALTER TABLE user_progress 
    ADD CONSTRAINT user_progress_user_id_session_date_key UNIQUE (user_id, session_date);
  END IF;
END $$;

-- Add foreign key if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_progress_user_id_fkey'
  ) THEN
    ALTER TABLE user_progress 
    ADD CONSTRAINT user_progress_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================
-- Step 2: Create NEW tables
-- ============================================

-- Pronunciation Errors (we'll use user_progress.common_errors JSONB instead)
-- But create this table for detailed tracking if needed
CREATE TABLE IF NOT EXISTS pronunciation_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phoneme VARCHAR(10) NOT NULL,
  error_count INTEGER DEFAULT 1,
  last_occurred_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, phoneme)
);

-- Leaderboard Entries
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_score INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  rank INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Daily Challenges
CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) DEFAULT 'medium',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Challenge Attempts
CREATE TABLE IF NOT EXISTS user_challenge_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES daily_challenges(id) ON DELETE CASCADE,
  selected_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  points_earned INTEGER DEFAULT 0,
  attempt_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, challenge_id, attempt_date)
);

-- User Achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type VARCHAR(50) NOT NULL,
  achievement_name VARCHAR(100) NOT NULL,
  achievement_description TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_type, achievement_name)
);

-- ============================================
-- Step 3: Create Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_progress_user_date ON user_progress(user_id, session_date DESC);
CREATE INDEX IF NOT EXISTS idx_pronunciation_errors_user ON pronunciation_errors(user_id, error_count DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON leaderboard_entries(rank ASC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard_entries(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_challenges_active ON daily_challenges(is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_attempts_date ON user_challenge_attempts(user_id, attempt_date DESC);

-- ============================================
-- Step 4: Enable Row Level Security
-- ============================================

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE pronunciation_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Step 5: Create RLS Policies
-- ============================================

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can view own errors" ON pronunciation_errors;
DROP POLICY IF EXISTS "Users can insert own errors" ON pronunciation_errors;
DROP POLICY IF EXISTS "Users can update own errors" ON pronunciation_errors;
DROP POLICY IF EXISTS "Anyone can view leaderboard" ON leaderboard_entries;
DROP POLICY IF EXISTS "Users can update own leaderboard" ON leaderboard_entries;
DROP POLICY IF EXISTS "Anyone can view active challenges" ON daily_challenges;
DROP POLICY IF EXISTS "Users can view own attempts" ON user_challenge_attempts;
DROP POLICY IF EXISTS "Users can insert own attempts" ON user_challenge_attempts;
DROP POLICY IF EXISTS "Users can view own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can insert own achievements" ON user_achievements;

-- user_progress policies
CREATE POLICY "Users can view own progress" ON user_progress 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress 
  FOR UPDATE USING (auth.uid() = user_id);

-- pronunciation_errors policies
CREATE POLICY "Users can view own errors" ON pronunciation_errors 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own errors" ON pronunciation_errors 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own errors" ON pronunciation_errors 
  FOR UPDATE USING (auth.uid() = user_id);

-- leaderboard_entries policies
CREATE POLICY "Anyone can view leaderboard" ON leaderboard_entries 
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own leaderboard" ON leaderboard_entries 
  FOR ALL USING (auth.uid() = user_id);

-- daily_challenges policies
CREATE POLICY "Anyone can view active challenges" ON daily_challenges 
  FOR SELECT TO authenticated USING (is_active = true);

-- user_challenge_attempts policies
CREATE POLICY "Users can view own attempts" ON user_challenge_attempts 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts" ON user_challenge_attempts 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- user_achievements policies
CREATE POLICY "Users can view own achievements" ON user_achievements 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON user_achievements 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Migration Complete!
-- ============================================
-- Next step: Run the seed file to add challenge data
