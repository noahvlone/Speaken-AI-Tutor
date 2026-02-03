/* 
  FIX HISTORY & DETAIL VIEW
  Run this script in Supabase SQL Editor to ensure the user_progress table has all required columns.
*/

-- 1. Tambahkan kolom ID jika belum ada (wajib untuk halaman detail)
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();

-- 2. Tambahkan kolom Feedback (agar tidak error saat mapping di frontend)
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS transcript TEXT;
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS common_mistakes JSONB;
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS ai_suggestions JSONB;
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS feedback_summary TEXT;

-- 3. Hapus batasan "1 sesi per hari" agar history bisa mencatat banyak sesi
ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS user_progress_user_id_session_date_key;

-- 4. Pastikan ID unik (membuat index)
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_progress_id_unique ON user_progress(id);
