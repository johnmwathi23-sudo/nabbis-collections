-- Migration: Add missing tables for admin functionality
-- This adds tables that the frontend expects but don't exist yet
-- Does NOT modify existing tables (products, users, orders, etc.)

-- ============================================================
-- 1. VENDORS TABLE (completely missing)
-- ============================================================
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo TEXT,
  description TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  total_products INTEGER DEFAULT 0,
  total_sales DECIMAL(12,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('active','pending','suspended')),
  business_name TEXT,
  business_registration TEXT,
  location TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_vendors_user_id ON vendors(user_id);
CREATE INDEX idx_vendors_status ON vendors(status);

-- ============================================================
-- 2. SITE_SETTINGS TABLE
-- ============================================================
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed essential site settings
INSERT INTO site_settings (key, value, description) VALUES
('site_name', '"Nabbis Collections"', 'Site name displayed in header and meta tags'),
('site_tagline', '"Curated African Fashion & Lifestyle"', 'Tagline shown in hero and meta description'),
('site_description', '"Discover authentic African fashion, accessories, and home decor from local artisans."', 'SEO meta description'),
('site_logo', '{"url": "/logo.png", "alt": "Nabbis Collections Logo"}', 'Site logo - stores URL and alt text'),
('site_favicon', '{"url": "/favicon.ico"}', 'Site favicon'),
('announcement_bar', '{"text": "Free delivery on orders over KES 5,000!", "enabled": true, "background": "#3B0764", "textColor": "#FFFFFF"}', 'Top announcement bar configuration'),
('footer_text', '"© 2024 Nabbis Collections. All rights reserved."', 'Footer copyright text'),
('social_links', '{"instagram": "https://instagram.com/nabbiscollections", "facebook": "https://facebook.com/nabbiscollections", "twitter": "https://twitter.com/nabbiscollections", "tiktok": "https://tiktok.com/@nabbiscollections"}', 'Social media links'),
('contact_info', '{"phone": "+254 700 000 000", "email": "info@nabbiscollections.com", "address": "Nairobi, Kenya"}', 'Contact information'),
('seo_defaults', '{"defaultTitle": "Nabbis Collections - African Fashion & Lifestyle", "defaultDescription": "Discover authentic African fashion, accessories, and home decor.", "ogImage": "/og-image.jpg"}', 'Default SEO meta tags'),
('trust_badges', '[{"icon": "shield", "text": "Secure Payment"}, {"icon": "truck", "text": "Free Delivery over KES 5,000"}, {"icon": "rotate", "text": "Easy Returns"}, {"icon": "support", "text": "24/7 Support"}]', 'Trust badges for footer/checkout');

-- ============================================================
-- 3. HERO_SLIDES TABLE
-- ============================================================
CREATE TABLE hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  cta_text TEXT,
  cta_link TEXT,
  desktop_image_url TEXT,
  mobile_image_url TEXT,
  overlay_opacity DECIMAL(3,2) DEFAULT 0.4,
  text_color TEXT DEFAULT '#FFFFFF',
  bg_color TEXT DEFAULT '#3B0764',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  scheduled_from TIMESTAMPTZ,
  scheduled_to TIMESTAMPTZ,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_hero_slides_active_order ON hero_slides(is_active, sort_order);
CREATE INDEX idx_hero_slides_scheduled ON hero_slides(scheduled_from, scheduled_to);

-- ============================================================
-- 4. ADMIN_AUDIT_LOG TABLE
-- ============================================================
CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_audit_log_admin ON admin_audit_log(admin_id);
CREATE INDEX idx_audit_log_entity ON admin_audit_log(entity, entity_id);
CREATE INDEX idx_audit_log_created ON admin_audit_log(created_at DESC);

-- ============================================================
-- 5. ADD MISSING COLUMNS TO PRODUCTS
-- ============================================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS badge TEXT DEFAULT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_flash BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- ============================================================
-- 6. ADD MISSING COLUMNS TO USERS
-- ============================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS joined_date TIMESTAMPTZ DEFAULT now();

-- ============================================================
-- 7. SEED SUPER ADMIN USER
-- ============================================================
INSERT INTO users (name, email, password, role)
VALUES ('Super Admin', 'tessndunge@gmail.com', '+254758516135', 'super_admin')
ON CONFLICT (email) DO UPDATE SET 
  role = 'super_admin', 
  password = '+254758516135',
  updated_at = now();

-- ============================================================
-- 8. CREATE PROFILES TABLE (for admin users page fallback)
--    Since we use custom auth (users table), profiles will mirror users
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'super_admin', 'vendor')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Seed profiles from existing users
INSERT INTO profiles (user_id, email, first_name, last_name, role)
SELECT 
  id,
  email,
  COALESCE(NULLIF(split_part(name, ' ', 1), ''), 'User'),
  COALESCE(NULLIF(split_part(name, ' ', 2), ''), ''),
  role
FROM users
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.user_id = users.id
);

-- ============================================================
-- 9. ADD SITE_IMAGES TABLE FOR UPLOAD TRACKING
-- ============================================================
CREATE TABLE site_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  alt TEXT,
  category TEXT DEFAULT 'other' CHECK (category IN ('hero', 'banner', 'promo', 'testimonial', 'logo', 'other')),
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_site_images_category ON site_images(category);
CREATE INDEX idx_site_images_uploaded_by ON site_images(uploaded_by);

-- ============================================================
-- 10. RLS POLICIES
-- ============================================================

-- Vendors: public can read active vendors, admins can manage all
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active vendors" ON vendors
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage all vendors" ON vendors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid()::uuid AND u.role IN ('admin', 'super_admin')
    )
  );

-- Site settings: public read, admins write
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view site settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings" ON site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid()::uuid AND u.role IN ('admin', 'super_admin')
    )
  );

-- Hero slides: public read active, admins manage all
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active hero slides" ON hero_slides
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage hero slides" ON hero_slides
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid()::uuid AND u.role IN ('admin', 'super_admin')
    )
  );

-- Admin audit log: admins only
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit log" ON admin_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid()::uuid AND u.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can insert audit log" ON admin_audit_log
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid()::uuid AND u.role IN ('admin', 'super_admin')
    )
  );

-- Profiles: public can view, users can update own, admins manage all
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (user_id = auth.uid()::uuid);

CREATE POLICY "Admins can manage all profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid()::uuid AND u.role IN ('admin', 'super_admin')
    )
  );

-- Site images: public can view, admins manage
ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view site images" ON site_images
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage site images" ON site_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid()::uuid AND u.role IN ('admin', 'super_admin')
    )
  );

-- Products: add policy for admin management (existing products table)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid()::uuid AND u.role IN ('admin', 'super_admin')
    )
  );

-- Users table: users can view own, admins manage all
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (id = auth.uid()::uuid);

CREATE POLICY "Admins can manage all users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid()::uuid AND u.role IN ('admin', 'super_admin')
    )
  );