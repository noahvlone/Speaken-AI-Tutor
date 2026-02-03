-- ============================================
-- QUERY: Check user_progress Table Structure
-- ============================================
-- Run this in Supabase SQL Editor to check if the existing table matches our needs

-- 1. Check column structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'user_progress'
ORDER BY ordinal_position;

-- 2. Check sample data (if any)
SELECT * FROM user_progress LIMIT 5;

-- 3. Check constraints
SELECT
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'user_progress';

-- ============================================
-- Expected Columns (for comparison):
-- ============================================
-- id (uuid, NOT NULL, DEFAULT gen_random_uuid())
-- user_id (uuid, NOT NULL, FK to auth.users)
-- session_date (date, NOT NULL, DEFAULT CURRENT_DATE)
-- pronunciation_score (integer, 0-100)
-- fluency_score (integer, 0-100)
-- accuracy_score (integer, 0-100)
-- prosody_score (integer, 0-100)
-- session_duration_minutes (integer)
-- created_at (timestamptz, DEFAULT NOW())
--
-- UNIQUE constraint on (user_id, session_date)
-- ============================================
