-- Add detailed feedback columns to user_progress
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS transcript TEXT,
ADD COLUMN IF NOT EXISTS common_mistakes JSONB,
ADD COLUMN IF NOT EXISTS ai_suggestions JSONB,
ADD COLUMN IF NOT EXISTS feedback_summary TEXT;
