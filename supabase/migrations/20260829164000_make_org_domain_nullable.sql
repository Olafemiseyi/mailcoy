-- Migration: Make organizations.domain nullable
ALTER TABLE organizations ALTER COLUMN domain DROP NOT NULL;
ALTER TABLE organizations ALTER COLUMN domain SET DEFAULT '';
