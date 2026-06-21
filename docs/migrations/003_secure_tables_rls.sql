-- ============================================================
-- Viswarkarma uPVC & Aluminium — Row Level Security (RLS) Policies
-- Run this in your Supabase Dashboard > SQL Editor
-- This protects all dynamic CMS and configurator tables from unauthorized edits.
-- ============================================================

-- 1. Helper function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- 2. Business Settings
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read business_settings" ON public.business_settings;
CREATE POLICY "Public read business_settings" 
  ON public.business_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write business_settings" ON public.business_settings;
CREATE POLICY "Admin write business_settings" 
  ON public.business_settings FOR ALL 
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());

-- 3. Services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read services" ON public.services;
CREATE POLICY "Public read services" 
  ON public.services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write services" ON public.services;
CREATE POLICY "Admin write services" 
  ON public.services FOR ALL 
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());

-- 4. Projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read projects" ON public.projects;
CREATE POLICY "Public read projects" 
  ON public.projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write projects" ON public.projects;
CREATE POLICY "Admin write projects" 
  ON public.projects FOR ALL 
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());

-- 5. Testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read testimonials" ON public.testimonials;
CREATE POLICY "Public read testimonials" 
  ON public.testimonials FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write testimonials" ON public.testimonials;
CREATE POLICY "Admin write testimonials" 
  ON public.testimonials FOR ALL 
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());

-- 6. FAQs
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read faqs" ON public.faqs;
CREATE POLICY "Public read faqs" 
  ON public.faqs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write faqs" ON public.faqs;
CREATE POLICY "Admin write faqs" 
  ON public.faqs FOR ALL 
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());

-- 7. Configurator Tables: Product Types
ALTER TABLE public.product_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read product_types" ON public.product_types;
CREATE POLICY "Public read product_types" 
  ON public.product_types FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write product_types" ON public.product_types;
CREATE POLICY "Admin write product_types" 
  ON public.product_types FOR ALL 
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());

-- 8. Frame Colour Options
ALTER TABLE public.colour_options ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read colour_options" ON public.colour_options;
CREATE POLICY "Public read colour_options" 
  ON public.colour_options FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write colour_options" ON public.colour_options;
CREATE POLICY "Admin write colour_options" 
  ON public.colour_options FOR ALL 
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());

-- 9. Glass Options
ALTER TABLE public.glass_options ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read glass_options" ON public.glass_options;
CREATE POLICY "Public read glass_options" 
  ON public.glass_options FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write glass_options" ON public.glass_options;
CREATE POLICY "Admin write glass_options" 
  ON public.glass_options FOR ALL 
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());

-- 10. Mesh Options
ALTER TABLE public.mesh_options ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read mesh_options" ON public.mesh_options;
CREATE POLICY "Public read mesh_options" 
  ON public.mesh_options FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write mesh_options" ON public.mesh_options;
CREATE POLICY "Admin write mesh_options" 
  ON public.mesh_options FOR ALL 
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());

-- 11. Hardware Options
ALTER TABLE public.hardware_options ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read hardware_options" ON public.hardware_options;
CREATE POLICY "Public read hardware_options" 
  ON public.hardware_options FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write hardware_options" ON public.hardware_options;
CREATE POLICY "Admin write hardware_options" 
  ON public.hardware_options FOR ALL 
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());

-- 12. Lead/Quote Requests
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin read/write quote_requests" ON public.quote_requests;
CREATE POLICY "Admin read/write quote_requests" 
  ON public.quote_requests FOR ALL 
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Anonymous insert quote_requests" ON public.quote_requests;
CREATE POLICY "Anonymous insert quote_requests" 
  ON public.quote_requests FOR INSERT WITH CHECK (true);
