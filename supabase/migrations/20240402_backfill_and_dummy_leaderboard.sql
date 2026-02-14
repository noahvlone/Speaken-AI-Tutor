-- 1. Backfill public_profiles for existing users who don't have one
insert into public_profiles (id, username, full_name, avatar_url)
select 
  id, 
  split_part(email, '@', 1), 
  split_part(email, '@', 1), 
  raw_user_meta_data->>'avatar_url'
from auth.users
where id not in (select id from public_profiles);

-- 2. Insert Dummy Users (Bots) into auth.users is not possible safely, 
-- sc we will insert them directly into public_profiles and leaderboard_entries with fake IDs.
-- Note: These won't have login capability, just for display.

DO $$
DECLARE
  bot_id_1 uuid := gen_random_uuid();
  bot_id_2 uuid := gen_random_uuid();
  bot_id_3 uuid := gen_random_uuid();
  bot_id_4 uuid := gen_random_uuid();
  bot_id_5 uuid := gen_random_uuid();
BEGIN
  -- Insert Bots into public_profiles
  insert into public_profiles (id, username, full_name, avatar_url) values
  (bot_id_1, 'alex_pro', 'Alex Pro', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'),
  (bot_id_2, 'sarah_learns', 'Sarah Learns', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'),
  (bot_id_3, 'mike_english', 'Mike English', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike'),
  (bot_id_4, 'emily_speaks', 'Emily Speaks', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'),
  (bot_id_5, 'david_poly', 'David Poly', 'https://api.dicebear.com/7.x/avataaars/svg?seed=David');

  -- Insert Bots into leaderboard_entries with random scores
  insert into leaderboard_entries (user_id, total_score, current_streak, longest_streak, last_activity_date) values
  (bot_id_1, 1250, 5, 10, now()),
  (bot_id_2, 980, 3, 5, now()),
  (bot_id_3, 850, 2, 4, now()),
  (bot_id_4, 720, 1, 3, now()),
  (bot_id_5, 600, 0, 2, now());
END $$;
