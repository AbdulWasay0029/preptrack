-- Migration to support Google OAuth
-- Add email and google_id columns, and make telegram_id nullable

-- 1. Add email column
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;

-- 2. Add google_id column
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;

-- 3. Make telegram_id nullable
ALTER TABLE users ALTER COLUMN telegram_id DROP NOT NULL;
