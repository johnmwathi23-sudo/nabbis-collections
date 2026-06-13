-- Nabbis Collections - Complete Database Schema
-- E-commerce platform with M-Pesa, delivery, loyalty, referrals

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE order_status AS ENUM (
  'pending', 'processing', 'completed', 'cancelled', 'refunded'
);

CREATE TYPE payment_status AS ENUM (
  'pending', 'paid', 'failed', 'refunded'
);

CREATE TYPE stock_status AS ENUM (
  'instock', 'outofstock', 'onbackorder'
);

CREATE TYPE referral_status AS ENUM (
  'pending', 'completed'
);

CREATE TYPE loyalty_transaction_type AS ENUM (
  'earned', 'redeemed'
);

-- ============================================================
-- TABLES
-- ============================================================

-- CATEGORIES
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- PRODUCTS
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  sale_price DECIMAL(10,2) CHECK (sale_price >= 0),
  sku TEXT UNIQUE,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  stock_status stock_status NOT NULL DEFAULT 'instock',
  images JSONB DEFAULT '[]'::jsonb,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  attributes JSONB DEFAULT '{}'::jsonb,
  average_rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT valid_price CHECK (
    sale_price IS NULL OR sale_price <= price
  )
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_created ON products(created_at DESC);
CREATE INDEX idx_products_price ON products(price);

-- Computed column: on_sale
ALTER TABLE products ADD COLUMN on_sale BOOLEAN GENERATED ALWAYS AS (
  sale_price IS NOT NULL AND sale_price < price
) STORED;

-- CUSTOMER PROFILES (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  shipping_address JSONB DEFAULT '{}'::jsonb,
  billing_address JSONB DEFAULT '{}'::jsonb,
  loyalty_points INTEGER NOT NULL DEFAULT 0 CHECK (loyalty_points >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- DELIVERY ZONES
CREATE TABLE delivery_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  counties TEXT[] NOT NULL DEFAULT '{}',
  price DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  estimated_days TEXT,
  free_shipping_threshold DECIMAL(10,2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ORDERS
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  status order_status NOT NULL DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  shipping_total DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (shipping_total >= 0),
  tax_total DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (tax_total >= 0),
  discount_total DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (discount_total >= 0),
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  payment_method TEXT,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  mpesa_receipt TEXT,
  mpesa_request_id TEXT,
  shipping_address JSONB DEFAULT '{}'::jsonb,
  billing_address JSONB DEFAULT '{}'::jsonb,
  delivery_zone_id UUID REFERENCES delivery_zones(id) ON DELETE SET NULL,
  delivery_eta TEXT,
  notes TEXT,
  coupon_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_session ON orders(session_id);

-- ORDER ITEMS
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  product_sku TEXT,
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0)
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- CART ITEMS
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id TEXT,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT cart_owner CHECK (
    (customer_id IS NOT NULL AND session_id IS NULL) OR
    (customer_id IS NULL AND session_id IS NOT NULL)
  )
);

CREATE INDEX idx_cart_customer ON cart_items(customer_id);
CREATE INDEX idx_cart_session ON cart_items(session_id);

-- WISHLIST ITEMS
CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(customer_id, product_id)
);

CREATE INDEX idx_wishlist_customer ON wishlist_items(customer_id);

-- LOYALTY TRANSACTIONS
CREATE TABLE loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  points INTEGER NOT NULL CHECK (points != 0),
  type loyalty_transaction_type NOT NULL,
  reference TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_loyalty_customer ON loyalty_transactions(customer_id);

-- REFERRALS
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_email TEXT NOT NULL,
  referred_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status referral_status NOT NULL DEFAULT 'pending',
  reward_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_email ON referrals(referred_email);

-- ============================================================
-- AUTO-UPDATE TRIGGER FOR updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_delivery_zones_updated_at
  BEFORE UPDATE ON delivery_zones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_referrals_updated_at
  BEFORE UPDATE ON referrals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.raw_user_meta_data ->> 'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- M-PESA TRANSACTIONS LOG
-- ============================================================
CREATE TABLE mpesa_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  request_id TEXT,
  merchant_request_id TEXT,
  checkout_request_id TEXT,
  response_code TEXT,
  response_description TEXT,
  customer_message TEXT,
  result_code INTEGER,
  result_description TEXT,
  amount DECIMAL(10,2),
  mpesa_receipt_number TEXT,
  transaction_date TIMESTAMPTZ,
  phone_number TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  raw_request JSONB,
  raw_callback JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mpesa_order ON mpesa_transactions(order_id);
CREATE INDEX idx_mpesa_checkout_request ON mpesa_transactions(checkout_request_id);

CREATE TRIGGER trigger_mpesa_transactions_updated_at
  BEFORE UPDATE ON mpesa_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Categories: public read, admin write
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT USING (true);
CREATE POLICY "Categories are admin writable"
  ON categories FOR ALL USING (auth.role() = 'service_role');

-- Products: public read, admin write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT USING (true);
CREATE POLICY "Products are admin writable"
  ON products FOR ALL USING (auth.role() = 'service_role');

-- Profiles: own read/update, admin all
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Service role can manage all profiles"
  ON profiles FOR ALL USING (auth.role() = 'service_role');

-- Delivery zones: public read, admin write
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Delivery zones are publicly readable"
  ON delivery_zones FOR SELECT USING (true);
CREATE POLICY "Delivery zones are admin writable"
  ON delivery_zones FOR ALL USING (auth.role() = 'service_role');

-- Orders: own read, admin all
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Guests can read by session"
  ON orders FOR SELECT USING (auth.role() = 'anon' AND session_id IS NOT NULL);
CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT WITH CHECK (auth.uid() = customer_id OR session_id IS NOT NULL);
CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE USING (auth.uid() = customer_id);
CREATE POLICY "Service role can manage all orders"
  ON orders FOR ALL USING (auth.role() = 'service_role');

-- Order items: inherit from orders (view via order relationship)
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own order items"
  ON order_items FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (orders.customer_id = auth.uid() OR orders.session_id IS NOT NULL)
    )
  );
CREATE POLICY "Service role can manage all order items"
  ON order_items FOR ALL USING (auth.role() = 'service_role');

-- Cart items: own only
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own cart items"
  ON cart_items FOR ALL USING (
    (auth.uid() = customer_id) OR
    (auth.role() = 'anon' AND session_id IS NOT NULL)
  );
CREATE POLICY "Service role can manage all cart items"
  ON cart_items FOR ALL USING (auth.role() = 'service_role');

-- Wishlist: own only
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own wishlist"
  ON wishlist_items FOR ALL USING (auth.uid() = customer_id);
CREATE POLICY "Service role can manage all wishlist"
  ON wishlist_items FOR ALL USING (auth.role() = 'service_role');

-- Loyalty: own read, admin all
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own loyalty"
  ON loyalty_transactions FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Service role can manage all loyalty"
  ON loyalty_transactions FOR ALL USING (auth.role() = 'service_role');

-- Referrals: own read, admin all
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own referrals"
  ON referrals FOR SELECT USING (auth.uid() = referrer_id);
CREATE POLICY "Service role can manage all referrals"
  ON referrals FOR ALL USING (auth.role() = 'service_role');

-- M-Pesa transactions: admin only (sensitive)
ALTER TABLE mpesa_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages mpesa transactions"
  ON mpesa_transactions FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- SEED DATA: Delivery Zones
-- ============================================================
INSERT INTO delivery_zones (name, counties, price, estimated_days, free_shipping_threshold) VALUES
  ('Nairobi CBD', ARRAY['Nairobi'], 150.00, 'Same day', 5000.00),
  ('Nairobi Suburbs', ARRAY['Nairobi'], 250.00, '1-2 days', 5000.00),
  ('Nairobi Estate', ARRAY['Nairobi'], 350.00, '1-2 days', 5000.00),
  ('Major Cities', ARRAY['Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'], 450.00, '2-3 days', 7000.00),
  ('Regional Towns', ARRAY['Thika', 'Ruiru', 'Kiambu', 'Limuru', 'Kikuyu', 'Nyeri', 'Nanyuki', 'Embu', 'Meru', 'Machakos', 'Kitale', 'Kakamega', 'Bungoma', 'Busia', 'Siaya', 'Narok', 'Naivasha', 'Gilgil', 'Nyahururu', 'Kericho', 'Kisii', 'Migori', 'Homa Bay', 'Kilifi', 'Malindi', 'Lamu', 'Garissa', 'Isiolo', 'Marsabit', 'Lodwar'], 550.00, '3-5 days', 10000.00),
  ('Remote Areas', ARRAY['Mandera', 'Wajir', 'Tana River', 'Taita Taveta', 'Kwale', 'Samburu', 'Turkana', 'West Pokot', 'Baringo', 'Elgeyo Marakwet', 'Kitui', 'Makueni', 'Tharaka Nithi', 'Vihiga', 'Trans Nzoia', 'Uasin Gishu', 'Nandi', 'Laikipia', 'Muranga', 'Kirinyaga', 'Nyandarua', 'Lamu outside town'], 750.00, '5-7 days', 10000.00);

-- ============================================================
-- SEED DATA: Sample Categories
-- ============================================================
INSERT INTO categories (name, slug, description, image_url, sort_order) VALUES
  ('Women''s Fashion', 'womens-fashion', 'Trendy dresses, tops, skirts, and accessories for women', '/images/categories/women.jpg', 1),
  ('Men''s Fashion', 'mens-fashion', 'Stylish shirts, trousers, suits, and casual wear for men', '/images/categories/men.jpg', 2),
  ('Children', 'children', 'Fun and comfortable clothing for kids of all ages', '/images/categories/kids.jpg', 3),
  ('Home & Living', 'home-living', 'Elegant home decor, furnishings, and kitchenware', '/images/categories/home.jpg', 4),
  ('Beauty & Body', 'beauty-body', 'Skincare, haircare, and beauty essentials', '/images/categories/beauty.jpg', 5),
  ('Accessories', 'accessories', 'Bags, jewelry, watches, and finishing touches', '/images/categories/accessories.jpg', 6);
