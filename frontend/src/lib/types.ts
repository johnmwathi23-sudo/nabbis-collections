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
  avatar?: string;
  role: 'customer' | 'vendor' | 'admin';
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
