-- ============================================
-- CHALLENGE IMPROVEMENTS & INTEGRATIONS
-- ============================================

-- 1. Create daily_challenge_progress table for tracking
CREATE TABLE IF NOT EXISTS daily_challenge_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_questions INTEGER DEFAULT 5,
  correct_answers INTEGER DEFAULT 0,
  accuracy_percentage INTEGER CHECK (accuracy_percentage >= 0 AND accuracy_percentage <= 100),
  points_earned INTEGER DEFAULT 0,
  time_spent_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, challenge_date)
);

-- 2. Create achievement_definitions table
CREATE TABLE IF NOT EXISTS achievement_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  achievement_key VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(50),
  category VARCHAR(50),
  requirement_type VARCHAR(50),
  requirement_value INTEGER,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Add indexes
CREATE INDEX IF NOT EXISTS idx_daily_challenge_progress_user_date ON daily_challenge_progress(user_id, challenge_date DESC);
CREATE INDEX IF NOT EXISTS idx_achievement_definitions_key ON achievement_definitions(achievement_key);

-- 4. Enable RLS
ALTER TABLE daily_challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_definitions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DROP POLICY IF EXISTS "Users can view own challenge progress" ON daily_challenge_progress;
DROP POLICY IF EXISTS "Users can insert own challenge progress" ON daily_challenge_progress;
DROP POLICY IF EXISTS "Users can update own challenge progress" ON daily_challenge_progress;
DROP POLICY IF EXISTS "Anyone can view achievement definitions" ON achievement_definitions;

CREATE POLICY "Users can view own challenge progress" ON daily_challenge_progress 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenge progress" ON daily_challenge_progress 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenge progress" ON daily_challenge_progress 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view achievement definitions" ON achievement_definitions 
  FOR SELECT TO authenticated USING (true);

-- 6. Seed achievement definitions
INSERT INTO achievement_definitions (achievement_key, name, description, icon, category, requirement_type, requirement_value, points) VALUES
('first_challenge', 'First Steps', 'Complete your first daily challenge', '🎯', 'challenges', 'count', 1, 10),
('challenge_streak_3', '3-Day Streak', 'Complete challenges for 3 days in a row', '🔥', 'streaks', 'streak', 3, 25),
('challenge_streak_7', 'Week Warrior', 'Complete challenges for 7 days in a row', '🔥', 'streaks', 'streak', 7, 50),
('challenge_streak_30', 'Monthly Master', 'Complete challenges for 30 days in a row', '🔥', 'streaks', 'streak', 30, 200),
('perfect_score', 'Perfect!', 'Get 100% on a daily challenge', '💯', 'challenges', 'score', 100, 25),
('challenge_10', 'Getting Started', 'Complete 10 challenges', '💪', 'challenges', 'count', 10, 50),
('challenge_50', 'Half Century', 'Complete 50 challenges', '💪', 'challenges', 'count', 50, 150),
('challenge_100', 'Century', 'Complete 100 challenges', '💪', 'challenges', 'count', 100, 300),
('grammar_master', 'Grammar Guru', 'Get 10 grammar questions correct in a row', '📚', 'categories', 'streak', 10, 75),
('vocab_master', 'Word Wizard', 'Get 10 vocabulary questions correct in a row', '📖', 'categories', 'streak', 10, 75)
ON CONFLICT (achievement_key) DO NOTHING;

-- ============================================
-- Migration Complete!
-- ============================================
