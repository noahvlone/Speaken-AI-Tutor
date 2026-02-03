# How to Apply Migration: user_settings Table

## Method 1: Supabase Dashboard (RECOMMENDED) ⭐

### Steps:
1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Login to your account
   - Select your project: `Speaken-AI-Tutor`

2. **Navigate to SQL Editor**
   - Click on `SQL Editor` in the left sidebar
   - Click `New Query`

3. **Copy Migration SQL**
   - Open file: `supabase/migrations/008_user_settings.sql`
   - Copy ALL the content (Ctrl+A, Ctrl+C)

4. **Execute Migration**
   - Paste the SQL into the query editor
   - Click `Run` button (or press Ctrl+Enter)
   - Wait for success message

5. **Verify Table Creation**
   - Go to `Table Editor` in left sidebar
   - Look for `user_settings` table
   - Should see columns: id, user_id, current_level, target_level, etc.

---

## Method 2: Using psql (If you have PostgreSQL client)

```bash
# Get your database connection string from Supabase Dashboard
# Settings > Database > Connection string

psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres" \
  -f supabase/migrations/008_user_settings.sql
```

---

## Method 3: Manual SQL Execution

If you prefer to run SQL manually, here's the complete SQL:

```sql
-- User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_level VARCHAR(10) DEFAULT 'B1',
  target_level VARCHAR(10) DEFAULT 'C1',
  daily_goal_minutes INTEGER DEFAULT 30,
  preferred_language VARCHAR(10) DEFAULT 'en',
  notification_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_settings_user ON user_settings(user_id);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;

CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_settings ON auth.users;
CREATE TRIGGER on_auth_user_created_settings
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_settings();
```

---

## Verification Steps

After applying migration, verify it worked:

### 1. Check Table Exists
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'user_settings';
```

### 2. Check Table Structure
```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'user_settings';
```

### 3. Test Insert (Optional)
```sql
-- This should auto-create when you login
-- But you can test manually:
INSERT INTO user_settings (user_id, current_level)
VALUES (auth.uid(), 'B1');
```

---

## Troubleshooting

### Error: "relation auth.users does not exist"
- Make sure you're running this on Supabase database
- Not on a local PostgreSQL instance

### Error: "permission denied"
- Make sure you're logged in as database owner
- Use Supabase Dashboard SQL Editor (has proper permissions)

### Error: "trigger already exists"
- The migration handles this with `DROP TRIGGER IF EXISTS`
- Safe to re-run the migration

---

## After Migration

1. **Restart your app** (if running):
   ```bash
   # Stop npm run dev (Ctrl+C)
   # Start again
   npm run dev
   ```

2. **Test the app**:
   - Login to the application
   - Go to homepage
   - Check if stats display correctly
   - Verify level shows (should be 'B1' by default)

3. **Check browser console**:
   - Open DevTools (F12)
   - Look for any errors related to user_settings

---

## Success Indicators

✅ Table `user_settings` appears in Supabase Dashboard
✅ No errors in SQL execution
✅ Trigger created successfully
✅ RLS policies active
✅ App displays user level correctly
✅ No console errors

---

*Created: January 20, 2026*
