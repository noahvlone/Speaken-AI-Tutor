# Database Setup Instructions

## Prerequisites
- Supabase account
- Supabase project created
- Supabase CLI installed (optional, for local development)

## Setup Steps

### 1. Run Database Migration

Open your Supabase Dashboard and navigate to the SQL Editor:

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy the contents of `supabase/migrations/001_progress_leaderboard_challenges.sql`
6. Paste into the SQL Editor
7. Click "Run" to execute the migration

This will create the following tables:
- `user_progress` - Tracks pronunciation, fluency, accuracy, and prosody scores
- `pronunciation_errors` - Tracks common pronunciation mistakes
- `leaderboard_entries` - User rankings and streaks
- `daily_challenges` - Challenge questions database
- `user_challenge_attempts` - User answers and scores
- `user_achievements` - Badges and milestones

### 2. Seed Challenge Data

After running the migration, seed the challenges:

1. In SQL Editor, click "New Query"
2. Copy the contents of `supabase/seed/challenges_seed.sql`
3. Paste into the SQL Editor
4. Click "Run" to insert challenge data

This will add 45 challenges across different categories:
- Grammar (10 challenges)
- Vocabulary (10 challenges)
- Idioms (10 challenges)
- Pronunciation (5 challenges)

### 3. Verify Tables

Run this query to verify all tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'user_progress',
  'pronunciation_errors',
  'leaderboard_entries',
  'daily_challenges',
  'user_challenge_attempts',
  'user_achievements'
);
```

You should see all 6 tables listed.

### 4. Check Row Level Security (RLS)

Verify RLS is enabled:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'user_progress',
  'pronunciation_errors',
  'leaderboard_entries',
  'daily_challenges',
  'user_challenge_attempts',
  'user_achievements'
);
```

All tables should have `rowsecurity = true`.

### 5. Test Challenge Data

Verify challenges were seeded:

```sql
SELECT category, COUNT(*) as count
FROM daily_challenges
WHERE is_active = true
GROUP BY category
ORDER BY category;
```

You should see:
- Grammar: 10
- Idioms: 10
- Pronunciation: 5
- Vocabulary: 10

## Troubleshooting

### Error: "relation already exists"
If you see this error, the tables already exist. You can either:
1. Drop the existing tables first (⚠️ this will delete all data)
2. Skip the migration if tables are already set up correctly

### Error: "permission denied"
Make sure you're logged in as the project owner or have sufficient permissions.

### No challenges showing in app
1. Check if challenges were seeded: `SELECT COUNT(*) FROM daily_challenges;`
2. Verify RLS policies allow reading: Check the policies in Supabase Dashboard > Authentication > Policies

## Optional: Local Development with Supabase CLI

If you're using Supabase CLI for local development:

```bash
# Start local Supabase
supabase start

# Run migration
supabase db reset

# The migration and seed files will be automatically applied
```

## Next Steps

After completing the database setup:
1. Restart your development server: `pnpm dev`
2. Log in to the application
3. Navigate to Progress, Leaderboard, or Daily Challenge pages
4. Data should now be loaded from the database instead of dummy data

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Check Supabase logs in the Dashboard
3. Verify your `.env` file has the correct Supabase credentials
