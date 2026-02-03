# Fix: History Not Updating

The issue is that the database was configured to only allow **ONE** session per day (updating the old one).
To fix this and allow multiple sessions in history, and ensure all feedback data is saved, please apply this fix.

## Steps to Fix

1. **Open Supabase Dashboard** (https://app.supabase.com)
2. Go to **SQL Editor**
3. Create **New Query**
4. Copy & Paste the code below:

```sql
-- 1. Add missing feeedback columns
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS transcript TEXT,
ADD COLUMN IF NOT EXISTS common_mistakes JSONB,
ADD COLUMN IF NOT EXISTS ai_suggestions JSONB,
ADD COLUMN IF NOT EXISTS feedback_summary TEXT;

-- 2. Allow Multiple Sessions Per Day (Remove limit)
ALTER TABLE user_progress 
DROP CONSTRAINT IF EXISTS user_progress_user_id_session_date_key;

-- 3. Add ID for unique tracking
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_progress' AND column_name = 'id'
  ) THEN
    ALTER TABLE user_progress 
    ADD COLUMN id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
  END IF;
END $$;

-- 4. Optimize Index
DROP INDEX IF EXISTS idx_user_progress_user_date;
CREATE INDEX idx_user_progress_user_date ON user_progress(user_id, session_date DESC);
```

5. Click **Run**

---

### After Fixing
1. **Reload your application**
2. Try to complete a new Roleplay session
3. It should now appear in the History page!
