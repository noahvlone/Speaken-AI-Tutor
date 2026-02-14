
-- Daily Challenges
INSERT INTO quests (title, description, category, difficulty, xp_reward, target_count, action_url, period)
VALUES
('Grammar Guru', 'Complete 10 grammar challenges', 'Grammar', 'Medium', 100, 10, '/challenge/grammar', 'daily'),
('Pronunciation Pro', 'Practice 10 words perfectly', 'Pronunciation', 'Easy', 100, 10, '/challenge/pronunciation', 'daily'),
('Voice Master', 'Practice speaking in roleplay', 'Speaking', 'Hard', 150, 1, '/chat/roleplay', 'daily');

-- Weekly Challenges
INSERT INTO quests (title, description, category, difficulty, xp_reward, target_count, action_url, period)
VALUES
('Weekly Grammar Marathon', 'Complete 15 complex grammar challenges', 'Grammar', 'Hard', 500, 15, '/challenge/grammar', 'weekly'),
('Weekly Speaker', 'Master 15 difficult words', 'Pronunciation', 'Hard', 400, 15, '/challenge/pronunciation', 'weekly');

-- Monthly Challenges
INSERT INTO quests (title, description, category, difficulty, xp_reward, target_count, action_url, period)
VALUES
('Monthly Grammar Master', 'Complete 25 advanced grammar challenges', 'Grammar', 'Hard', 1500, 25, '/challenge/grammar', 'monthly'),
('Monthly Speaking Legend', 'Master 25 difficult words & phrases', 'Pronunciation', 'Hard', 1500, 25, '/challenge/pronunciation', 'monthly');
