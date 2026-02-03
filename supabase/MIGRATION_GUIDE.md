# Database Migration Guide - ADJUSTED

## ✅ Existing Table Found

Tabel `user_progress` sudah ada dengan struktur yang hampir sesuai!

**Yang sudah ada:**
- ✅ id, user_id, session_date
- ✅ pronunciation_score, fluency_score, accuracy_score
- ✅ common_errors (JSONB) - bonus!
- ✅ created_at

**Yang akan ditambahkan:**
- ➕ prosody_score
- ➕ session_duration_minutes
- ➕ Foreign key constraint ke auth.users
- ➕ Unique constraint (user_id, session_date)

---

## 🚀 Migration Steps

### Step 1: Run Adjusted Migration

**File**: `supabase/migrations/002_adjusted_migration.sql`

1. Buka Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy seluruh isi file `002_adjusted_migration.sql`
4. Paste dan click **"Run"**

Script ini akan:
- ✅ Tambah kolom `prosody_score` dan `session_duration_minutes` ke `user_progress`
- ✅ Buat 5 tabel baru (pronunciation_errors, leaderboard_entries, daily_challenges, user_challenge_attempts, user_achievements)
- ✅ Setup indexes untuk performance
- ✅ Enable Row Level Security
- ✅ Create RLS policies

### Step 2: Seed Challenge Data

**File**: `supabase/seed/challenges_seed.sql`

1. SQL Editor → "New Query"
2. Copy isi file `challenges_seed.sql`
3. Paste dan click **"Run"**

Ini akan menambahkan 45 soal challenge.

### Step 3: Verify

```sql
-- Check new columns added
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'user_progress'
ORDER BY ordinal_position;

-- Check new tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'pronunciation_errors',
  'leaderboard_entries',
  'daily_challenges',
  'user_challenge_attempts',
  'user_achievements'
);

-- Check challenges seeded
SELECT category, COUNT(*) as count
FROM daily_challenges
WHERE is_active = true
GROUP BY category;
```

---

## 📊 What Changed

### Modified Table
**user_progress** (existing table - columns added)
- ➕ `prosody_score` INTEGER (0-100)
- ➕ `session_duration_minutes` INTEGER
- ➕ Foreign key to auth.users
- ➕ Unique constraint

### New Tables Created
1. **pronunciation_errors** - Detailed error tracking
2. **leaderboard_entries** - User rankings & scores
3. **daily_challenges** - Challenge questions database
4. **user_challenge_attempts** - User answers & scores
5. **user_achievements** - Badges & milestones

---

## ✅ Frontend Ready

Semua hooks dan components sudah siap:
- ✅ `useUserProgress.ts` - Compatible dengan tabel yang sudah ada
- ✅ `useLeaderboard.ts` - Siap pakai
- ✅ `useDailyChallenges.ts` - Siap pakai
- ✅ Components updated (ProgressPage, Leaderboard, DailyChallengePage)

---

## 🔍 Notes

**common_errors JSONB field:**
Tabel `user_progress` punya field `common_errors` (JSONB) yang bisa digunakan untuk track pronunciation errors dalam satu session. Ini lebih efisien daripada tabel `pronunciation_errors` terpisah untuk beberapa use case.

**Recommendation:**
- Gunakan `common_errors` untuk session-specific errors
- Gunakan tabel `pronunciation_errors` untuk aggregate/historical tracking

---

## 🎯 Next Steps

1. ✅ Run migration: `002_adjusted_migration.sql`
2. ✅ Run seed: `challenges_seed.sql`
3. ✅ Restart dev server (sudah running)
4. ✅ Test aplikasi:
   - Login
   - Go to Daily Challenge → Should load 5 questions
   - Complete challenges → Check leaderboard
   - Go to Progress → Will show empty state (normal for new user)

---

## ⚠️ Troubleshooting

**Error: "column already exists"**
- Aman diabaikan, artinya kolom sudah ada

**Error: "relation already exists"**
- Aman diabaikan, artinya tabel sudah dibuat sebelumnya

**Error: "policy already exists"**
- Script sudah handle dengan DROP POLICY IF EXISTS

**No challenges showing:**
- Pastikan seed script sudah dijalankan
- Check: `SELECT COUNT(*) FROM daily_challenges;`
