-- ============================================================
-- Migration 004: Add series_choice and hardware_choice columns to estimator_drafts
-- Run this in your Supabase Dashboard > SQL Editor
-- ============================================================

ALTER TABLE public.estimator_drafts ADD COLUMN IF NOT EXISTS series_choice TEXT DEFAULT '';
ALTER TABLE public.estimator_drafts ADD COLUMN IF NOT EXISTS hardware_choice TEXT DEFAULT 'standard';
