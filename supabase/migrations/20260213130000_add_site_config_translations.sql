-- Migration: Add translations column to site_config

ALTER TABLE site_config ADD COLUMN translations JSONB DEFAULT '{}'::jsonb;
