-- Chat System Enhancements
-- Adds metadata support, favorites, and search capabilities

-- Add metadata field to chat_messages for extensibility
ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Add favorites flag to chat_sessions
ALTER TABLE chat_sessions 
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false;

-- Add tags support to chat_sessions
ALTER TABLE chat_sessions 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_metadata 
ON chat_messages USING gin(metadata);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_favorite 
ON chat_sessions(user_id, is_favorite) 
WHERE is_favorite = true;

-- Full-text search index for message content
CREATE INDEX IF NOT EXISTS idx_chat_messages_content_search 
ON chat_messages USING gin(to_tsvector('english', content));

-- Add comment for documentation
COMMENT ON COLUMN chat_messages.metadata IS 'Stores additional message data like grammar_score, corrections, sentiment, etc.';
COMMENT ON COLUMN chat_sessions.is_favorite IS 'Flag to mark important/favorite chat sessions';
COMMENT ON COLUMN chat_sessions.tags IS 'Array of tags for categorizing chat sessions';
