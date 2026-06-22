-- ============================================================
-- Viswarkarma uPVC & Aluminium — Correct Product Type Images
-- Run this in your Supabase Dashboard > SQL Editor
-- This ensures all product images match the correct home page images
-- and are fully editable/customizable by the admin.
-- ============================================================

-- 0. Ensure the image_url column exists on product_types
ALTER TABLE public.product_types ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 1. Update uPVC product type default images to match the correct home page IndiaMart images
UPDATE public.product_types 
SET image_url = 'https://5.imimg.com/data5/SX/YV/YG/SELLER-64612523/upvc-sliding-window-500x500.jpg'
WHERE id = 'sliding_window';

UPDATE public.product_types 
SET image_url = 'https://5.imimg.com/data5/QR/VY/TK/SELLER-64612523/casement-window-500x500.jpeg'
WHERE id = 'casement_window';

UPDATE public.product_types 
SET image_url = 'https://5.imimg.com/data5/LQ/MY/FJ/SELLER-64612523/upvc-sliding-profile-125x125.jpeg'
WHERE id = 'fixed_window';

UPDATE public.product_types 
SET image_url = 'https://5.imimg.com/data5/RU/YJ/HX/SELLER-64612523/upvc-french-door-500x500.jpg'
WHERE id = 'sliding_door';

-- Ensure openable_door exists and has correct image
INSERT INTO public.product_types (id, family_id, name, description, base_price_per_sqft, supported_series, status, sort_order, image_url)
VALUES ('openable_door', 'upvc', 'uPVC Casement Double Door', 'Heavy-duty sash swing double door with multi-point lock cylinders.', 800, ARRAY['80mm_series', '88mm_series'], 'active', 4, 'https://5.imimg.com/data5/AL/LI/CS/SELLER-64612523/upvc-glass-double-door-500x500.jpg')
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url;

-- 2. Update Aluminium product type default images
UPDATE public.product_types 
SET image_url = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
WHERE id = 'alu_sliding_window';

UPDATE public.product_types 
SET image_url = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
WHERE id = 'alu_casement_window';

UPDATE public.product_types 
SET image_url = 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80'
WHERE id = 'alu_fixed_window';

UPDATE public.product_types 
SET image_url = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'
WHERE id = 'alu_sliding_door';

-- Ensure alu_openable_door exists and has correct image
INSERT INTO public.product_types (id, family_id, name, description, base_price_per_sqft, supported_series, status, sort_order, image_url)
VALUES ('alu_openable_door', 'aluminium', 'Aluminium Casement Door', 'Modern architectural doors with high-security locks.', 850, ARRAY['alu_50mm_series', 'alu_90mm_series'], 'active', 9, 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url;
