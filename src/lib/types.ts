// ============================================================
//  Nabbis Collections — Shared TypeScript Types
// ============================================================

export type ProductBadge = 'Best Seller' | 'New' | 'Sale' | 'Flash' | null;

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number | null;
  image: string;
  images?: string[];
  category: string;
  badge?: ProductBadge;
  vendor: string;
  vendorId: number;
  rating: number;
  reviews: number;
  stock: number;
  description: string;
  tags?: string[];
  featured?: boolean;
  isFlash?: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface Vendor {
  id: number;
  name: string;
  logo: string;
  description: string;
  rating: number;
  totalProducts: number;
  totalSales: number;
  status: 'active' | 'pending' | 'suspended';
  joinedDate: string;
  location: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  deliveryType: 'nairobi' | 'parcel' | 'pickup';
  paymentMethod: 'mpesa' | 'airtel' | 'card';
  paymentStatus: 'pending' | 'paid' | 'failed';
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  avatar?: string;
  role: 'customer' | 'vendor' | 'admin' | 'super_admin';
  orders?: Order[];
  joinedDate: string;
}

export type DeliveryType = 'nairobi' | 'parcel' | 'pickup';
export type PaymentMethod = 'mpesa' | 'airtel' | 'card';

export const DELIVERY_FEES: Record<DeliveryType, number> = {
  nairobi: 250,
  parcel: 400,
  pickup: 0,
};

export const FREE_DELIVERY_THRESHOLD = 5000;

// Admin types
export type UserRole = 'customer' | 'admin' | 'super_admin';

export interface SiteSetting {
  id: string;
  key: string;
  value: any;
  description: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
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
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type AuditAction = 'create' | 'update' | 'delete' | 'login' | 'logout' | 'export' | 'impersonate';
export type AuditEntity = 'product' | 'category' | 'order' | 'profile' | 'site_setting' | 'hero_slide' | 'delivery_zone' | 'coupon' | 'user_role';

export interface AuditLog {
  id: string;
  admin_id: string;
  action: AuditAction;
  entity: AuditEntity;
  entity_id: string | null;
  changes: Record<string, any>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface Permission {
  id: string;
  user_id: string;
  resource: string;
  actions: string[];
  created_at: string;
  updated_at: string;
}

export interface SiteContact {
  id: string;
  label: string;
  type: 'phone' | 'email' | 'address' | 'social' | 'hours';
  value: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
