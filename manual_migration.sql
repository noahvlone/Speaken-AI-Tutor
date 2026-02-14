-- Create quests table
CREATE TABLE IF NOT EXISTS quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'Speaking', 'Pronunciation', 'Grammar', etc.
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  xp_reward INTEGER NOT NULL,
  target_count INTEGER DEFAULT 1,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_quest_progress table
CREATE TABLE IF NOT EXISTS user_quest_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, quest_id)
);

-- Enable RLS
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quest_progress ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Quests are viewable by everyone" ON quests FOR SELECT USING (true);

CREATE POLICY "Users can view own quest progress" ON user_quest_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own quest progress" ON user_quest_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quest progress update" ON user_quest_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Seed initial quests
INSERT INTO quests (title, description, category, difficulty, xp_reward, target_count, action_url) VALUES
('Morning Conversation', 'Have a 5-minute conversation about your morning routine', 'Speaking', 'Easy', 50, 1, '/chat'),
('Pronunciation Master', 'Practice 20 difficult words with 90% accuracy', 'Pronunciation', 'Medium', 75, 20, '/pronunciation/practice'),
('Grammar Ninja', 'Write 10 sentences without any grammar mistakes', 'Grammar', 'Hard', 100, 10, '/grammar/practice');
