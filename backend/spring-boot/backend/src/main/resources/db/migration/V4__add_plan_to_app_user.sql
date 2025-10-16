-- Add 'plan' column to app_user to track free/paid users
-- Flyway migration: V2__add_plan_column_to_app_user.sql

ALTER TABLE app_user
    ADD COLUMN IF NOT EXISTS plan VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'paid'));

-- Optional: backfill existing rows explicitly, just to be consistent
UPDATE app_user
SET plan = 'free'
WHERE plan IS NULL;
