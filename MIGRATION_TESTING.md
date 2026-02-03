# Database Migration - Testing Checklist

## ✅ Migration Applied Successfully!

Migration `008_user_settings.sql` has been applied to Supabase database.

---

## Testing Steps

### 1. Visual Testing (In Browser)

1. **Open the application**
   - URL: http://localhost:5173 (or your dev server port)
   
2. **Login to your account**
   - Use your test credentials
   
3. **Check Homepage/Dashboard**
   - [ ] Stats cards display correctly
   - [ ] Streak number shows
   - [ ] Level shows (should be 'B1' by default)
   - [ ] Accuracy percentage displays
   - [ ] XP/Score displays
   
4. **Open Browser Console (F12)**
   - [ ] No errors related to `user_settings`
   - [ ] No 400/404 errors from Supabase
   - [ ] Check Network tab for successful API calls

---

### 2. Database Verification (Supabase Dashboard)

1. **Go to Supabase Dashboard**
   - https://app.supabase.com
   
2. **Table Editor**
   - [ ] `user_settings` table exists
   - [ ] Columns are correct:
     - id (uuid)
     - user_id (uuid)
     - current_level (varchar)
     - target_level (varchar)
     - daily_goal_minutes (integer)
     - preferred_language (varchar)
     - notification_enabled (boolean)
     - created_at (timestamptz)
     - updated_at (timestamptz)
   
3. **Check Data**
   - [ ] Auto-created row for your user (if you logged in after migration)
   - [ ] Default values are correct (B1, C1, 30, en, true)

4. **Check Policies (RLS)**
   - Go to `Authentication` > `Policies`
   - [ ] "Users can view own settings" exists
   - [ ] "Users can insert own settings" exists
   - [ ] "Users can update own settings" exists

---

### 3. API Testing (SQL Editor)

Run these queries in Supabase SQL Editor:

#### Check Table Structure
```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'user_settings'
ORDER BY ordinal_position;
```

#### Check Trigger
```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created_settings';
```

#### Check Your Settings (replace with your user_id)
```sql
SELECT * FROM user_settings
WHERE user_id = auth.uid();
```

#### Test Insert (if no data exists)
```sql
INSERT INTO user_settings (user_id, current_level)
VALUES (auth.uid(), 'B1')
ON CONFLICT (user_id) DO NOTHING;
```

---

### 4. Hook Testing (Code)

Check if hooks are working:

#### useHomeStats
```typescript
// In HomePage.tsx, check console.log
const { streak, level, accuracy, xp, loading } = useHomeStats(userId);
console.log('Home Stats:', { streak, level, accuracy, xp, loading });
```

Expected output:
```
Home Stats: {
  streak: 0-999,
  level: "B1" (or other level),
  accuracy: 0-100,
  xp: 0-999999,
  loading: false
}
```

---

## Common Issues & Solutions

### Issue 1: Level not showing
**Symptom**: Level shows as empty or undefined

**Solution**:
1. Check if user_settings row exists for your user
2. Run this SQL to create it:
```sql
INSERT INTO user_settings (user_id, current_level)
VALUES (auth.uid(), 'B1')
ON CONFLICT (user_id) DO NOTHING;
```

### Issue 2: Stats not loading
**Symptom**: Loading spinner forever

**Solution**:
1. Check browser console for errors
2. Verify RLS policies are enabled
3. Make sure you're logged in
4. Check network tab for failed requests

### Issue 3: Permission denied
**Symptom**: Error: "new row violates row-level security policy"

**Solution**:
1. Verify RLS policies exist
2. Check if auth.uid() matches user_id
3. Re-apply migration if needed

---

## Success Indicators

✅ **All Green Checks Mean Success!**

- [x] Migration executed without errors
- [ ] Table `user_settings` exists in Supabase
- [ ] Trigger created successfully
- [ ] RLS policies active
- [ ] App displays stats correctly
- [ ] No console errors
- [ ] User settings auto-created on login

---

## Next Steps After Successful Testing

1. **Update other components** to use user_settings:
   - Settings page
   - Profile page
   - Preferences

2. **Add features**:
   - Change level functionality
   - Update daily goals
   - Language switcher

3. **Monitor**:
   - Check Supabase logs for errors
   - Monitor API usage
   - Track user engagement

---

## Rollback (If Needed)

If something goes wrong, you can rollback:

```sql
-- Drop trigger
DROP TRIGGER IF EXISTS on_auth_user_created_settings ON auth.users;

-- Drop function
DROP FUNCTION IF EXISTS create_user_settings();

-- Drop policies
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;

-- Drop table
DROP TABLE IF EXISTS user_settings;
```

---

*Last Updated: January 20, 2026*
*Migration: 008_user_settings.sql*
