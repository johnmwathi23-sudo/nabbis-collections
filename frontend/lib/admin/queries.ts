import { getAdminClient } from '@/lib/supabase/admin-client';
import type { Product, Category, Order, Profile, DeliveryZone, HeroSlide, SiteSetting } from '@/lib/types';

const db = () => getAdminClient() as any;

// ============================================================
// DASHBOARD STATS
// ============================================================
export async function getDashboardStats() {
  const supabase = db();

  const [ordersResult, productsResult, customersResult, revenueResult] = await Promise.all([
    supabase.from('orders').select('id, status, total, created_at'),
    supabase.from('products').select('id, is_active', { count: 'exact' }),
    supabase.from('profiles').select('id, role', { count: 'exact' }),
    supabase.from('orders').select('total').eq('payment_status', 'paid'),
  ]);

  const orders = (ordersResult.data || []) as any[];
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
  const processingOrders = orders.filter((o: any) => o.status === 'processing').length;
  const completedOrders = orders.filter((o: any) => o.status === 'completed').length;
  const cancelledOrders = orders.filter((o: any) => o.status === 'cancelled').length;

  const totalRevenue = (revenueResult.data || []).reduce((sum: number, o: any) => sum + Number(o.total), 0);
  const totalProducts = productsResult.count || 0;
  const activeProducts = (productsResult.data || []).filter((p: any) => p.is_active).length;
  const totalCustomers = customersResult.count || 0;

  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  const recentOrders = orders.filter((o: any) => new Date(o.created_at) >= last7Days);
  const recentRevenue = recentOrders
    .filter((o: any) => o.status !== 'cancelled')
    .reduce((sum: number, o: any) => sum + Number(o.total), 0);

  return {
    totalOrders,
    pendingOrders,
    processingOrders,
    completedOrders,
    cancelledOrders,
    totalRevenue,
    recentRevenue,
    totalProducts,
    activeProducts,
    totalCustomers,
    recentOrders: recentOrders.length,
  };
}

export async function getRecentOrders(limit = 10) {
  const supabase = db();
  const { data, error } = await supabase
    .from('orders')
    .select('*, profiles:customer_id(email, first_name, last_name)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data || [];
}

export async function getRevenueChartData(days = 30) {
  const supabase = db();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data } = await supabase
    .from('orders')
    .select('total, created_at, status')
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: true });

  if (!data) return [];

  const dailyMap = new Map<string, number>();
  data.forEach((o: any) => {
    if (o.status === 'cancelled') return;
    const day = new Date(o.created_at).toISOString().slice(0, 10);
    dailyMap.set(day, (dailyMap.get(day) || 0) + Number(o.total));
  });

  return Array.from(dailyMap.entries()).map(([date, revenue]: [string, number]) => ({
    date,
    revenue,
  }));
}

// ============================================================
// PRODUCTS
// ============================================================
export async function getAdminProducts(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: string;
  is_active?: boolean;
  on_sale?: boolean;
}) {
  const supabase = db();
  const page = params?.page || 1;
  const perPage = Math.min(params?.per_page || 25, 100);
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from('products')
    .select('*, categories(name, slug)', { count: 'exact' });

  if (params?.search) {
    query = query.or(`name.ilike.%${params.search}%,sku.ilike.%${params.search}%`);
  }
  if (params?.category_id) {
    query = query.eq('category_id', params.category_id);
  }
  if (params?.is_active !== undefined) {
    query = query.eq('is_active', params.is_active);
  }
  if (params?.on_sale !== undefined) {
    query = query.eq('on_sale', params.on_sale);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) return { products: [], total: 0 };
  return { products: (data as any[]) || [], total: count || 0 };
}

export async function getAdminProduct(id: string) {
  const supabase = db();
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as any;
}

// ============================================================
// CATEGORIES
// ============================================================
export async function getAdminCategories() {
  const supabase = db();
  const { data, error } = await supabase
    .from('categories')
    .select('*, products:products(count)')
    .order('sort_order', { ascending: true });

  if (error) return [];
  return (data as any[]) || [];
}

// ============================================================
// ORDERS
// ============================================================
export async function getAdminOrders(params?: {
  page?: number;
  per_page?: number;
  status?: string;
  payment_status?: string;
  search?: string;
}) {
  const supabase = db();
  const page = params?.page || 1;
  const perPage = Math.min(params?.per_page || 25, 100);
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from('orders')
    .select('*, profiles:customer_id(email, first_name, last_name)', { count: 'exact' });

  if (params?.status) query = query.eq('status', params.status);
  if (params?.payment_status) query = query.eq('payment_status', params.payment_status);
  if (params?.search) {
    query = query.or(
      `mpesa_receipt.ilike.%${params.search}%,profiles.email.ilike.%${params.search}%`
    );
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) return { orders: [], total: 0 };
  return { orders: (data as any[]) || [], total: count || 0 };
}

export async function getAdminOrder(id: string) {
  const supabase = db();
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*), profiles:customer_id(*)')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as any;
}

// ============================================================
// CUSTOMERS
// ============================================================
export async function getAdminCustomers(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  role?: string;
}) {
  const supabase = db();
  const page = params?.page || 1;
  const perPage = Math.min(params?.per_page || 25, 100);
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from('profiles')
    .select('*, orders:orders(count)', { count: 'exact' });

  if (params?.search) {
    query = query.or(
      `email.ilike.%${params.search}%,first_name.ilike.%${params.search}%,last_name.ilike.%${params.search}%`
    );
  }
  if (params?.role) query = query.eq('role', params.role);

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) return { customers: [], total: 0 };
  return { customers: (data as any[]) || [], total: count || 0 };
}

// ============================================================
// HERO SLIDES
// ============================================================
export async function getHeroSlides() {
  const supabase = db();
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) return [];
  return (data as any[]) || [];
}

export async function getActiveHeroSlides() {
  const supabase = db();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('is_active', true)
    .or(`scheduled_from.is.null,scheduled_from.lte.${now}`)
    .or(`scheduled_to.is.null,scheduled_to.gte.${now}`)
    .order('sort_order', { ascending: true });

  if (error) return [];
  return (data as any[]) || [];
}

// ============================================================
// SITE SETTINGS
// ============================================================
export async function getSiteSettings() {
  const supabase = db();
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .order('key', { ascending: true });

  if (error) return [];
  return (data as SiteSetting[]) || [];
}

export async function getSiteSetting(key: string) {
  const supabase = db();
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', key)
    .single();

  if (error) return null;
  return data as SiteSetting;
}
