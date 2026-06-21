-- ============================================================
-- Viswarkarma uPVC — Estimator Draft & User Profile Tables
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  email       TEXT,
  phone       TEXT,
  role        TEXT NOT NULL DEFAULT 'user',  -- 'user' | 'admin'
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read/write own profile"
  ON public.user_profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. Estimator drafts (one per user, latest wins; multiple allowed)
CREATE TABLE IF NOT EXISTS public.estimator_drafts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status           TEXT NOT NULL DEFAULT 'in_progress',  -- 'in_progress' | 'submitted'
  current_step     INT  NOT NULL DEFAULT 1,

  -- Configurator state (JSON blob — easy to extend)
  family           TEXT NOT NULL DEFAULT 'upvc',         -- 'upvc' | 'aluminium'
  selected_types   TEXT[] DEFAULT '{}',
  window_count     INT  DEFAULT 10,
  home_sq_ft       INT  DEFAULT 1200,
  installation     BOOLEAN DEFAULT TRUE,
  color_choice     TEXT DEFAULT 'white',
  glass_choice     TEXT DEFAULT 'clear',
  mesh_choice      TEXT DEFAULT 'none',

  -- Contact info saved in estimator flow
  customer_name    TEXT DEFAULT '',
  customer_phone   TEXT DEFAULT '',
  customer_city    TEXT DEFAULT '',
  callback_time    TEXT DEFAULT 'morning',

  -- Computed estimate snapshot
  estimate_low     INT  DEFAULT 0,
  estimate_high    INT  DEFAULT 0,

  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.estimator_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own drafts"
  ON public.estimator_drafts FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Keep updated_at fresh
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS touch_estimator_drafts ON public.estimator_drafts;
CREATE TRIGGER touch_estimator_drafts
  BEFORE UPDATE ON public.estimator_drafts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS touch_user_profiles ON public.user_profiles;
CREATE TRIGGER touch_user_profiles
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


-- 3. Index for fast user draft lookup
CREATE INDEX IF NOT EXISTS idx_drafts_user_updated
  ON public.estimator_drafts (user_id, updated_at DESC);
