-- Fixed: Insert bots into auth.users first to satisfy FK constraints
-- Using fixed UUIDs for bots to ensure idempotency

DO $$
DECLARE
  -- Fixed IDs for bots
  bot1_id uuid := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  bot2_id uuid := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12';
  bot3_id uuid := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13';
  bot4_id uuid := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14';
  bot5_id uuid := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15';
BEGIN

  -- 1. Insert into auth.users
  -- NOTE: We use raw insert to bypass Supabase Auth API restrictions which aren't present in SQL Editor
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
  VALUES 
  (bot1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'alex_bot@example.com', 'placeholder_hash', now(), '{"full_name": "Alex Pro", "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"}', now(), now()),
  (bot2_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sarah_bot@example.com', 'placeholder_hash', now(), '{"full_name": "Sarah Learns", "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"}', now(), now()),
  (bot3_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'mike_bot@example.com', 'placeholder_hash', now(), '{"full_name": "Mike English", "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"}', now(), now()),
  (bot4_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'emily_bot@example.com', 'placeholder_hash', now(), '{"full_name": "Emily Speaks", "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"}', now(), now()),
  (bot5_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'david_bot@example.com', 'placeholder_hash', now(), '{"full_name": "David Poly", "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=David"}', now(), now())
  ON CONFLICT (id) DO NOTHING;

  -- 2. Trigger should have created public_profiles. 
  -- But just in case it didn't (if trigger wasn't active), upsert them.
  INSERT INTO public_profiles (id, username, full_name, avatar_url)
  VALUES
  (bot1_id, 'alex_pro', 'Alex Pro', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'),
  (bot2_id, 'sarah_learns', 'Sarah Learns', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'),
  (bot3_id, 'mike_english', 'Mike English', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike'),
  (bot4_id, 'emily_speaks', 'Emily Speaks', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'),
  (bot5_id, 'david_poly', 'David Poly', 'https://api.dicebear.com/7.x/avataaars/svg?seed=David')
  ON CONFLICT (id) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url;

  -- 3. Insert into leaderboard_entries
  -- Assuming leaderboard_entries table exists (it should from Phase 1)
  -- If not, create it first (failsafe)
  CREATE TABLE IF NOT EXISTS leaderboard_entries (
    user_id uuid references auth.users(id) primary key,
    total_score integer default 0,
    current_streak integer default 0,
    longest_streak integer default 0,
    last_activity_date date,
    updated_at timestamp with time zone default now()
  );

  INSERT INTO leaderboard_entries (user_id, total_score, current_streak, longest_streak, last_activity_date)
  VALUES
  (bot1_id, 1250, 5, 10, now()),
  (bot2_id, 980, 3, 5, now()),
  (bot3_id, 850, 2, 4, now()),
  (bot4_id, 720, 1, 3, now()),
  (bot5_id, 600, 0, 2, now())
  ON CONFLICT (user_id) DO UPDATE SET
    total_score = EXCLUDED.total_score;

END $$;
