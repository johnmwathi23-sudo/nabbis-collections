export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  sale_price: number | null;
  on_sale: boolean;
  sku: string | null;
  stock_quantity: number;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  images: { url: string; alt: string }[];
  category_id: string | null;
  featured: boolean;
  attributes: Record<string, string[]>;
  average_rating: number;
  review_count: number;
  is_active: boolean;
  created_at: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  counties: string[];
  price: number;
  estimated_days: string | null;
  free_shipping_threshold: number | null;
  is_active: boolean;
}

export interface Profile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: 'customer' | 'admin' | 'super_admin';
  shipping_address: Address;
  billing_address: Address;
  loyalty_points: number;
  created_at: string;
}

export interface Address {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  county?: string;
  postal_code?: string;
  country?: string;
}

export interface CartItem {
  id: string;
  customer_id: string | null;
  session_id: string | null;
  product_id: string;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: string;
  customer_id: string | null;
  session_id: string | null;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  subtotal: number;
  shipping_total: number;
  tax_total: number;
  discount_total: number;
  total: number;
  payment_method: string | null;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  mpesa_receipt: string | null;
  shipping_address: Address;
  billing_address: Address;
  delivery_zone_id: string | null;
  delivery_eta: string | null;
  notes: string | null;
  coupon_code: string | null;
  items?: OrderItem[];
  created_at: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  cta_text: string | null;
  cta_link: string | null;
  desktop_image_url: string | null;
  mobile_image_url: string | null;
  overlay_opacity: number;
  text_color: string;
  bg_color: string;
  sort_order: number;
  is_active: boolean;
  scheduled_from: string | null;
  scheduled_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: any;
  description: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  action: 'create' | 'update' | 'delete';
  entity: 'product' | 'category' | 'order' | 'profile' | 'site_setting' | 'hero_slide' | 'delivery_zone' | 'user_role';
  entity_id: string | null;
  changes: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  recentRevenue: number;
  totalProducts: number;
  activeProducts: number;
  totalCustomers: number;
  recentOrders: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  product_sku: string | null;
  unit_price: number;
  quantity: number;
  subtotal: number;
}
