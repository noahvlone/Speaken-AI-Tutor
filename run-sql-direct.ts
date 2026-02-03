import { supabase } from './migrationClient';

const sql = `
-- Quests System Migration
CREATE TABLE IF NOT EXISTS quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  xp_reward INTEGER NOT NULL,
  target_count INTEGER DEFAULT 1,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_quest_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, quest_id)
);

ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quest_progress ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Quests are viewable by everyone' AND tablename = 'quests') THEN
        CREATE POLICY "Quests are viewable by everyone" ON quests FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own quest progress' AND tablename = 'user_quest_progress') THEN
        CREATE POLICY "Users can view own quest progress" ON user_quest_progress FOR SELECT USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own quest progress' AND tablename = 'user_quest_progress') THEN
        CREATE POLICY "Users can update own quest progress" ON user_quest_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own quest progress update' AND tablename = 'user_quest_progress') THEN
        CREATE POLICY "Users can update own quest progress update" ON user_quest_progress FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END
$$;

INSERT INTO quests (title, description, category, difficulty, xp_reward, target_count, action_url) 
SELECT 'Morning Conversation', 'Have a 5-minute conversation about your morning routine', 'Speaking', 'Easy', 50, 1, '/chat'
WHERE NOT EXISTS (SELECT 1 FROM quests WHERE title = 'Morning Conversation');

INSERT INTO quests (title, description, category, difficulty, xp_reward, target_count, action_url) 
SELECT 'Pronunciation Master', 'Practice 20 difficult words with 90% accuracy', 'Pronunciation', 'Medium', 75, 20, '/pronunciation/practice'
WHERE NOT EXISTS (SELECT 1 FROM quests WHERE title = 'Pronunciation Master');

INSERT INTO quests (title, description, category, difficulty, xp_reward, target_count, action_url) 
SELECT 'Grammar Ninja', 'Write 10 sentences without any grammar mistakes', 'Grammar', 'Hard', 100, 10, '/grammar/practice'
WHERE NOT EXISTS (SELECT 1 FROM quests WHERE title = 'Grammar Ninja');
`;

async function run() {
    console.log("Running SQL...");
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
    if (error) {
        console.error('Error executing SQL:', error);
        // Fallback: try creating via direct calls if rpc fails (restricted)
        // But usually rpc is the way if enabled.
    } else {
        console.log('Success!');
    }

    // Check if table exists
    const { data, error: checkError } = await supabase.from('quests').select('*').limit(1);
    console.log('Quests table check:', checkError ? checkError.message : 'OK', data);
}

run();
