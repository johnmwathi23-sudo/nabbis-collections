-- Nabbis Collections - Admin Dashboard Features
-- Adds role management, site settings, hero slides, audit logging

-- ============================================================
-- 1. ADD ROLE COLUMN TO PROFILES
-- ============================================================
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'super_admin');

ALTER TABLE profiles
ADD COLUMN role user_role NOT NULL DEFAULT 'customer';

-- Set existing admin users (first user created is super_admin by default)
-- Admin must be assigned manually or via SQL:
-- UPDATE profiles SET role = 'super_admin' WHERE email = 'admin@example.com';

CREATE INDEX idx_profiles_role ON profiles(role);

-- ============================================================
-- 2. SITE SETTINGS (key-value configuration)
-- ============================================================
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_site_settings_key ON site_settings(key);

-- Seed default settings
INSERT INTO site_settings (key, value, description) VALUES
  ('site_name', '"Nabbis Collections"', 'Site brand name'),
  ('site_tagline', '"Premium Fashion & Lifestyle"', 'Site tagline'),
  ('site_description', '"Premium fashion, bags, and household accessories delivered across Kenya."', 'Meta description'),
  ('site_logo', '{}', 'Logo image data (url, alt, variants)'),
  ('site_favicon', '{}', 'Favicon image data'),
  ('announcement_bar', '{"enabled": false, "text": "", "bg_color": "#3B0764", "text_color": "#FFFFFF"}', 'Top announcement bar'),
  ('footer_text', '"© 2026 Nabbis Collections. All rights reserved."', 'Footer copyright text'),
  ('social_links', '{"whatsapp": "", "instagram": "", "facebook": "", "tiktok": ""}', 'Social media links'),
  ('trust_badges', '[{"icon": "truck", "title": "Free Delivery", "desc": "Orders above KES 5,000"}, {"icon": "shield", "title": "Secure Payment", "desc": "M-Pesa & Card payments"}, {"icon": "rotate-ccw", "title": "Easy Returns", "desc": "7-day return policy"}, {"icon": "star", "title": "Premium Quality", "desc": "Curated collections"}]', 'Trust badge items displayed on homepage'),
  ('seo_defaults', '{"og_image": "", "og_title": "", "og_description": "", "twitter_handle": ""}', 'Default SEO metadata'),
  ('contact_info', '{"email": "", "phone_primary": "+254 758 516135", "phone_secondary": "+254 720 144325", "address": ""}', 'Contact information');

CREATE TRIGGER trigger_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 3. HERO SLIDES (homepage carousel management)
-- ============================================================
CREATE TABLE hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  cta_text TEXT,
  cta_link TEXT,
  desktop_image_url TEXT,
  mobile_image_url TEXT,
  overlay_opacity DECIMAL(3,2) NOT NULL DEFAULT 0.4,
  text_color TEXT NOT NULL DEFAULT '#FFFFFF',
  bg_color TEXT NOT NULL DEFAULT '#3B0764',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  scheduled_from TIMESTAMPTZ,
  scheduled_to TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_hero_slides_active ON hero_slides(is_active, sort_order);
CREATE INDEX idx_hero_slides_scheduled ON hero_slides(scheduled_from, scheduled_to);

CREATE TRIGGER trigger_hero_slides_updated_at
  BEFORE UPDATE ON hero_slides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 4. ADMIN AUDIT LOG
-- ============================================================
CREATE TYPE audit_action AS ENUM (
  'create', 'update', 'delete', 'login', 'logout', 'export', 'impersonate'
);

CREATE TYPE audit_entity AS ENUM (
  'product', 'category', 'order', 'profile', 'site_setting', 'hero_slide',
  'delivery_zone', 'coupon', 'user_role'
);

CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action audit_action NOT NULL,
  entity audit_entity NOT NULL,
  entity_id TEXT,
  changes JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_admin ON admin_audit_log(admin_id);
CREATE INDEX idx_audit_entity ON admin_audit_log(entity, entity_id);
CREATE INDEX idx_audit_created ON admin_audit_log(created_at DESC);

-- ============================================================
-- 5. RLS POLICIES FOR NEW TABLES
-- ============================================================

-- Site settings: publicly readable for active settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site settings are publicly readable"
  ON site_settings FOR SELECT USING (true);

CREATE POLICY "Site settings are admin writable"
  ON site_settings FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Service role can manage all site settings"
  ON site_settings FOR ALL USING (auth.role() = 'service_role');

-- Hero slides: publicly readable (active & scheduled)
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hero slides are publicly readable"
  ON hero_slides FOR SELECT USING (true);

CREATE POLICY "Hero slides are admin writable"
  ON hero_slides FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Service role can manage all hero slides"
  ON hero_slides FOR ALL USING (auth.role() = 'service_role');

-- Admin audit log: admin read only
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit log"
  ON admin_audit_log FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Service role can manage audit log"
  ON admin_audit_log FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- 6. UPDATE EXISTING PROFILE POLICIES FOR ROLE-BASED ACCESS
-- ============================================================

-- Drop and recreate profiles RLS to add admin read access to all profiles
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON profiles;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = 'customer');

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Service role can manage all profiles"
  ON profiles FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- 7. STORAGE BUCKETS (created via Supabase dashboard or API)
-- ============================================================
-- Buckets needed (created via Supabase dashboard or migrations):
-- - site-assets: public, for logos, favicons, global images
-- - hero-images: public, for hero slide desktop/mobile images
-- - product-images: public, for product gallery images
--
-- Run in Supabase SQL editor or via API:
-- INSERT INTO storage.buckets (id, name, public) VALUES
--   ('site-assets', 'site-assets', true),
--   ('hero-images', 'hero-images', true),
--   ('product-images', 'product-images', true);
--
-- Storage policies:
-- CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id IN ('site-assets', 'hero-images', 'product-images'));
-- CREATE POLICY "Admin upload access" ON storage.objects FOR INSERT WITH CHECK (
--   bucket_id IN ('site-assets', 'hero-images', 'product-images')
--   AND EXISTS (
--     SELECT 1 FROM profiles
--     WHERE profiles.id = auth.uid()
--     AND profiles.role IN ('admin', 'super_admin')
--   )
-- );
-- CREATE POLICY "Admin update access" ON storage.objects FOR UPDATE USING (
--   bucket_id IN ('site-assets', 'hero-images', 'product-images')
--   AND EXISTS (
--     SELECT 1 FROM profiles
--     WHERE profiles.id = auth.uid()
--     AND profiles.role IN ('admin', 'super_admin')
--   )
-- );
-- CREATE POLICY "Admin delete access" ON storage.objects FOR DELETE USING (
--   bucket_id IN ('site-assets', 'hero-images', 'product-images')
--   AND EXISTS (
--     SELECT 1 FROM profiles
--     WHERE profiles.id = auth.uid()
--     AND profiles.role IN ('admin', 'super_admin')
--   )
-- );
