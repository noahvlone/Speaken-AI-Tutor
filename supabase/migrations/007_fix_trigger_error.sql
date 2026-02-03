-- Fix for database trigger error
-- The trigger was trying to update a non-existent 'updated_at' field

-- Option 1: Drop the problematic trigger (Quick fix)
DROP TRIGGER IF EXISTS update_chat_messages_timestamp ON chat_messages;
DROP FUNCTION IF EXISTS update_chat_messages_timestamp();

-- Option 2: Add the missing field and keep the trigger (Better for future)
-- Uncomment below if you want to keep the trigger functionality:
-- ALTER TABLE chat_messages 
-- ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
