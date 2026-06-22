-- ============================================================
-- Viswarkarma uPVC & Aluminium — Reset Business Settings
-- Run this in your Supabase Dashboard > SQL Editor
-- This drops the incorrect website_settings table and seeds the correct
-- Viswarkarma uPVC & Aluminium settings.
-- ============================================================

-- 1. Drop the incorrect website_settings table (created by mistake for the other project)
DROP TABLE IF EXISTS public.website_settings CASCADE;

-- 2. Ensure the correct business_settings table exists and is populated for Viswarkarma uPVC & Aluminium
CREATE TABLE IF NOT EXISTS public.business_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  tagline TEXT,
  phone_primary TEXT,
  phone_secondary TEXT,
  whatsapp_number TEXT,
  email TEXT,
  office_address TEXT,
  service_area_summary TEXT,
  working_hours TEXT,
  googleMapUrl TEXT,
  experience_years INT DEFAULT 25,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Upsert the correct Viswarkarma business settings
INSERT INTO public.business_settings (
  id, 
  business_name, 
  tagline, 
  phone_primary, 
  phone_secondary, 
  whatsapp_number, 
  email, 
  office_address, 
  service_area_summary, 
  working_hours, 
  experience_years
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Viswarkarma uPVC & Aluminium',
  '25+ Years of Custom Fabrication & Precision Installation',
  '+91 95056 83584',
  '+91 95056 83584',
  '+919505683584',
  'contact@viswarkarmaupvc.com',
  'Rajahmundry Head Office & Fabrication Workshop, Rajahmundry, Andhra Pradesh, India',
  'Rajahmundry, Vijayawada, Visakhapatnam, Kakinada, Hyderabad, and major cities pan-India',
  'Monday - Saturday: 9:30 AM - 7:00 PM',
  25
)
ON CONFLICT (id) DO UPDATE SET 
  business_name = EXCLUDED.business_name,
  tagline = EXCLUDED.tagline,
  phone_primary = EXCLUDED.phone_primary,
  phone_secondary = EXCLUDED.phone_secondary,
  whatsapp_number = EXCLUDED.whatsapp_number,
  email = EXCLUDED.email,
  office_address = EXCLUDED.office_address,
  service_area_summary = EXCLUDED.service_area_summary,
  working_hours = EXCLUDED.working_hours,
  experience_years = EXCLUDED.experience_years,
  updated_at = NOW();
