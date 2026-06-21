-- ============================================================
-- Viswarkarma uPVC & Aluminium — Database Schema Alterations & Defaults
-- Run this in your Supabase Dashboard > SQL Editor
-- This ensures all dynamic fields and default config data are ready.
-- ============================================================

-- 1. Alter configurator tables to support system-specific branching & images
ALTER TABLE public.product_types ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.colour_options ADD COLUMN IF NOT EXISTS family_id TEXT;
ALTER TABLE public.glass_options ADD COLUMN IF NOT EXISTS family_id TEXT;
ALTER TABLE public.mesh_options ADD COLUMN IF NOT EXISTS family_id TEXT;

-- 2. Populate product families
INSERT INTO public.product_families (id, name, description, status) VALUES
('upvc', 'uPVC Systems', 'Excellent thermal, sound & weather insulation. Most popular for residential homes.', 'active'),
('aluminium', 'Aluminium Systems', 'Sleek slimline architectural frames. Ideal for large glass views & commercial projects.', 'active')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 3. Populate product types (styles) with image URLs
INSERT INTO public.product_types (id, family_id, name, description, base_price_per_sqft, supported_series, status, sort_order, image_url) VALUES
('sliding_window', 'upvc', 'uPVC Sliding Window', 'Smooth, space-saving horizontal sliding panels with interlocking brush seals.', 500, ARRAY['60mm_series', '80mm_series', '88mm_series'], 'active', 1, 'https://5.imimg.com/data5/SX/YV/YG/SELLER-64612523/upvc-sliding-window-500x500.jpg'),
('casement_window', 'upvc', 'uPVC Casement Window', 'Classic side-hung openable window swinging outward for 100% ventilation.', 500, ARRAY['60mm_series', '80mm_series', '88mm_series'], 'active', 2, 'https://5.imimg.com/data5/QR/VY/TK/SELLER-64612523/casement-window-500x500.jpeg'),
('sliding_door', 'upvc', 'uPVC French Door / Slider', 'Wide doors sliding on heavy-duty tracks, perfect for balconies and sit-outs.', 500, ARRAY['80mm_series', '88mm_series', '112mm_series'], 'active', 3, 'https://5.imimg.com/data5/RU/YJ/HX/SELLER-64612523/upvc-french-door-500x500.jpg'),
('fixed_window', 'upvc', 'uPVC Fixed Window', 'Non-operational picture window or office partition designed for maximum light.', 300, ARRAY['60mm_series', '80mm_series'], 'active', 4, 'https://5.imimg.com/data5/LQ/MY/FJ/SELLER-64612523/upvc-sliding-profile-125x125.jpeg'),
('top_hung', 'upvc', 'uPVC Top-Hung Window', 'Top-hinged ventilation window, ideal for bathrooms and toilets.', 500, ARRAY['60mm_series', '80mm_series'], 'active', 5, 'https://5.imimg.com/data5/PK/AF/KY/SELLER-64612523/upvc-top-hung-window-500x500.jpg'),

('alu_sliding_window', 'aluminium', 'Aluminium Sliding Window', 'Slimline architectural aluminium sliding profiles with integrated track systems.', 550, ARRAY['alu_50mm_series', 'alu_90mm_series'], 'active', 6, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'),
('alu_casement_window', 'aluminium', 'Aluminium Casement Window', 'Flush architectural casement window with friction hinges.', 600, ARRAY['alu_50mm_series', 'alu_90mm_series'], 'active', 7, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'),
('alu_sliding_door', 'aluminium', 'Aluminium Balcony Slider', 'Premium large-pane sliding patio doors with low thresholds and structural reinforcements.', 650, ARRAY['alu_90mm_series', 'alu_120mm_series'], 'active', 8, 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'),
('alu_fixed_window', 'aluminium', 'Aluminium Fixed Window', 'Slim frame fixed picture window designed for modern panoramic views.', 350, ARRAY['alu_50mm_series', 'alu_90mm_series'], 'active', 9, 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80'),
('alu_top_hung', 'aluminium', 'Aluminium Vent Window', 'Modern architectural toilet/ventilator windows with hidden mechanical friction stays.', 600, ARRAY['alu_50mm_series', 'alu_90mm_series'], 'active', 10, 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  description = EXCLUDED.description, 
  base_price_per_sqft = EXCLUDED.base_price_per_sqft, 
  image_url = EXCLUDED.image_url,
  family_id = EXCLUDED.family_id;

-- 4. Populate product series options
INSERT INTO public.product_series (id, family_id, name, description, thickness, price_modifier_per_sqft, status, sort_order) VALUES
('60mm_series', 'upvc', '60mm Series', 'Standard multi-chamber profile system.', '60mm', 0, 'active', 1),
('80mm_series', 'upvc', '80mm Series', 'Medium width profile for enhanced structural stability.', '80mm', 60, 'active', 2),
('88mm_series', 'upvc', '88mm Series', 'Heavy-duty architectural profile width.', '88mm', 120, 'active', 3),
('112mm_series', 'upvc', '112mm Series', 'Multi-track sliding profile configuration.', '112mm', 200, 'active', 4),

('alu_50mm_series', 'aluminium', '50mm Series', 'Standard slimline profile system.', '50mm', 0, 'active', 5),
('alu_90mm_series', 'aluminium', '90mm Series', 'Thermally-broken profile system.', '90mm', 140, 'active', 6),
('alu_120mm_series', 'aluminium', '120mm Series', 'Heavy-duty lift-and-slide profile configuration.', '120mm', 280, 'active', 7)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  description = EXCLUDED.description, 
  price_modifier_per_sqft = EXCLUDED.price_modifier_per_sqft;

-- 5. Populate frame colour finishes
INSERT INTO public.colour_options (id, family_id, name, hex, price_multiplier, description, is_wood_grain, status, sort_order) VALUES
('white', 'upvc', 'Classic White', '#ffffff', 1.0, 'Standard clean, high-gloss UV-stabilized white. Low maintenance.', FALSE, 'active', 1),
('anthracite', 'upvc', 'Anthracite Grey', '#374151', 1.20, 'Premium matte charcoal finish. Fits modern industrial styles.', FALSE, 'active', 2),
('golden_oak', 'upvc', 'Golden Oak', '#854d0e', 1.25, 'Textured realistic golden wood grain finish.', TRUE, 'active', 3),
('walnut', 'upvc', 'Walnut Wood', '#451a03', 1.28, 'Dark, premium textured walnut wood grain.', TRUE, 'active', 4),

('anodized_silver', 'aluminium', 'Natural Anodized Silver', '#C0C0C0', 1.0, 'Clean metallic silver finish. Standard protection.', FALSE, 'active', 5),
('charcoal_grey', 'aluminium', 'Charcoal Grey', '#374151', 1.15, 'Industrial matte dark grey powder coat.', FALSE, 'active', 6),
('matte_black', 'aluminium', 'Matte Jet Black', '#1A1A1A', 1.18, 'Luxury matte black powder-coated frame. Elegant.', FALSE, 'active', 7),
('champagne_gold', 'aluminium', 'Champagne Gold', '#D4AF37', 1.25, 'Premium gold anodized finish for high-end luxury.', FALSE, 'active', 8),
('wooden_walnut', 'aluminium', 'Walnut Woodgrain', '#5C3D1E', 1.30, 'Sublimated timber grain finish. High durability.', TRUE, 'active', 9)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  hex = EXCLUDED.hex,
  price_multiplier = EXCLUDED.price_multiplier,
  description = EXCLUDED.description,
  family_id = EXCLUDED.family_id;

-- 6. Populate glass options
INSERT INTO public.glass_options (id, family_id, name, description, price_modifier_per_sqft, status, sort_order) VALUES
('clear', 'upvc', '5mm Clear Glass', 'Standard clear glass suitable for budget windows.', 0, 'active', 1),
('toughened', 'upvc', '6mm Toughened Safety Glass', 'Tempered safety glass. Combined with sliding doors.', 100, 'active', 2),
('double_glazed', 'upvc', '20mm DGU Double Glazing (6+8Ar+6)', 'Double glazed unit with argon gas infill. Drastically reduces heat gain.', 150, 'active', 3),
('frosted', 'upvc', '6mm Frosted Privacy Glass', 'Acid-etched obscure safety glass, ideal for bathrooms.', 90, 'active', 4),

('clear_alu', 'aluminium', '5mm Clear Glass', 'Standard architectural clear glass pane.', 0, 'active', 5),
('toughened_alu', 'aluminium', '6mm Toughened Safety Glass', 'High impact resistance safety glass.', 100, 'active', 6),
('dgu_alu', 'aluminium', '24mm Double Glazing (6+12Ar+6)', 'Excellent thermal & acoustic insulation with Argon gap.', 180, 'active', 7),
('laminated_alu', 'aluminium', '12mm Toughened Laminated', 'High-security safety glass designed for structural strength.', 280, 'active', 8),
('frosted_alu', 'aluminium', '6mm Frosted Privacy Glass', 'Acid-etched frosted glass for bathrooms and partitions.', 90, 'active', 9)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  description = EXCLUDED.description, 
  price_modifier_per_sqft = EXCLUDED.price_modifier_per_sqft,
  family_id = EXCLUDED.family_id;

-- 7. Populate mesh options
INSERT INTO public.mesh_options (id, family_id, name, description, price_modifier_per_sqft, status, sort_order) VALUES
('none', 'upvc', 'No Mosquito Mesh', 'Standard glass frame without integrated flyscreens.', 0, 'active', 1),
('fiberglass', 'upvc', 'Fiberglass Invisible Mesh', 'Flexible, high-visibility dark grey mesh. Blends in.', 40, 'active', 2),
('ss304', 'upvc', 'SS304 Stainless Steel Shield', 'High-tensile, heavy-duty stainless steel wire mesh.', 120, 'active', 3),

('none_alu', 'aluminium', 'No Mosquito Mesh', 'Standard frame without mosquito screens.', 0, 'active', 4),
('fiberglass_alu', 'aluminium', 'Fiberglass Mesh', 'Standard flexible insect screen mesh.', 50, 'active', 5),
('ss304_alu', 'aluminium', 'SS304 Security Mesh', 'Heavy duty stainless steel wire mesh.', 150, 'active', 6),
('pleated_alu', 'aluminium', 'Premium Pleated Mesh', 'Collapsible pleated zigzag mesh sliding horizontally.', 220, 'active', 7)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  description = EXCLUDED.description, 
  price_modifier_per_sqft = EXCLUDED.price_modifier_per_sqft,
  family_id = EXCLUDED.family_id;

-- 8. Populate hardware options
INSERT INTO public.hardware_options (id, name, description, price_modifier_per_unit, status, sort_order) VALUES
('standard', 'Standard Lock & Handles', 'High-quality single-point locks with heavy-duty handles.', 0, 'active', 1),
('premium', 'Premium Multi-Point Security', 'Espagnolette multi-point locks that latch at 3 positions.', 1200, 'active', 2),
('luxury_key', 'Luxury Key-Locking Architectural', 'Key-locking handles with internal friction stays.', 2600, 'active', 3)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  description = EXCLUDED.description, 
  price_modifier_per_unit = EXCLUDED.price_modifier_per_unit;

-- 9. Populate business settings default row
INSERT INTO public.business_settings (id, business_name, tagline, phone_primary, phone_secondary, whatsapp_number, email, office_address, service_area_summary, working_hours)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Viswarkarma uPVC & Aluminium',
  '25+ Years of Custom Fabrication & Precision Installation',
  '+91 98860 12345',
  '+91 98860 54321',
  '+919886012345',
  'contact@viswarkarmaupvc.com',
  'Rajahmundry Head Office & Fabrication Workshop, Rajahmundry, Andhra Pradesh, India',
  'Rajahmundry, Vijayawada, Visakhapatnam, Kakinada, Hyderabad, and major cities pan-India',
  'Monday - Saturday: 9:30 AM - 7:00 PM'
) ON CONFLICT (id) DO UPDATE SET 
  business_name = EXCLUDED.business_name,
  tagline = EXCLUDED.tagline,
  office_address = EXCLUDED.office_address,
  service_area_summary = EXCLUDED.service_area_summary;
