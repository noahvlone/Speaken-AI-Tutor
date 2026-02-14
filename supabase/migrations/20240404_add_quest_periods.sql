-- Add period column to quests if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quests' AND column_name = 'period') THEN
        ALTER TABLE quests ADD COLUMN period TEXT DEFAULT 'daily';
        
        -- Add check constraint separately to avoid syntax issues in some postgres versions if combined
        ALTER TABLE quests ADD CONSTRAINT requests_period_check CHECK (period IN ('daily', 'weekly', 'monthly'));
    END IF;
END $$;

-- Update existing quests to be daily default (just in case)
UPDATE quests SET period = 'daily' WHERE period IS NULL;

-- Insert Weekly Quests
-- Use ON CONFLICT DO NOTHING to avoid duplicates if run multiple times
-- We assume 'title' might not be unique, but 'action_url' + 'title' roughly defines uniqueness for us here.
-- Actually, let's just insert if not exists based on title to be safe.

INSERT INTO quests (title, description, category, difficulty, xp_reward, target_count, action_url, period)
SELECT 'Weekly Grammar Master', 'Complete 5 advanced grammar challenges', 'Grammar', 'Hard', 300, 5, '/challenge/grammar?mode=weekly', 'weekly'
WHERE NOT EXISTS (SELECT 1 FROM quests WHERE title = 'Weekly Grammar Master');

INSERT INTO quests (title, description, category, difficulty, xp_reward, target_count, action_url, period)
SELECT 'Weekly Pronunciation', 'Pronounce 10 difficult words perfectly', 'Pronunciation', 'Hard', 250, 10, '/challenge/pronunciation?mode=weekly', 'weekly'
WHERE NOT EXISTS (SELECT 1 FROM quests WHERE title = 'Weekly Pronunciation');

-- Insert Monthly Quests
INSERT INTO quests (title, description, category, difficulty, xp_reward, target_count, action_url, period)
SELECT 'Monthly Fluency Master', 'Complete 20 challenges this month', 'Speaking', 'Hard', 1000, 20, '/challenge/speaking?mode=monthly', 'monthly'
WHERE NOT EXISTS (SELECT 1 FROM quests WHERE title = 'Monthly Fluency Master');

INSERT INTO quests (title, description, category, difficulty, xp_reward, target_count, action_url, period)
SELECT 'Grammar Grandmaster', 'Complete 15 complex grammar scenarios', 'Grammar', 'Hard', 800, 15, '/challenge/grammar?mode=monthly', 'monthly'
WHERE NOT EXISTS (SELECT 1 FROM quests WHERE title = 'Grammar Grandmaster');
