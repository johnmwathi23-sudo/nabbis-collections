import { supabase } from './supabase';
import { Product, Category, Vendor, Order, User, SiteSetting, HeroSlide, AuditLog, AuditAction, AuditEntity } from './types';

export class DatabaseService {
  // Products
  static async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getProductById(id: number): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createProduct(product: Omit<Product, 'id' | 'slug' | 'vendor' | 'vendorId' | 'rating' | 'reviews'>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteProduct(id: number): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Categories
  static async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Vendors
  static async getVendors(): Promise<Vendor[]> {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getVendorById(id: number): Promise<Vendor | null> {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateVendorStatus(id: number, status: Vendor['status']): Promise<Vendor> {
    const { data, error } = await supabase
      .from('vendors')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Users
  static async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getUserById(id: number): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateUserRole(id: number, role: User['role']): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Orders
  static async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getOrderById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async createUser(user: User): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  }

  static async createVendor(vendor: Vendor): Promise<Vendor> {
    const { data, error } = await supabase
      .from('vendors')
      .insert([vendor])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Storage
  static async uploadImage(file: File, bucket: string, path?: string): Promise<{ path: string }> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = path || `${fileName}`;

    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    const { data: publicUrlData } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { path: publicUrlData.publicUrl };
  }

  static async deleteImage(bucket: string, path: string): Promise<void> {
    const { error } = await supabase
      .storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  }

  // Admin: Site Settings
  static async getSiteSettings(): Promise<SiteSetting[]> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('key', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async updateSiteSetting(key: string, value: any, updatedBy: string): Promise<SiteSetting> {
    const { data, error } = await supabase
      .from('site_settings')
      .update({ value, updated_by: updatedBy })
      .eq('key', key)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Admin: Hero Slides
  static async getHeroSlides(): Promise<HeroSlide[]> {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createHeroSlide(slide: Omit<HeroSlide, 'id' | 'created_at' | 'updated_at'>): Promise<HeroSlide> {
    const { data, error } = await supabase
      .from('hero_slides')
      .insert([slide])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateHeroSlide(id: string, updates: Partial<HeroSlide>): Promise<HeroSlide> {
    const { data, error } = await supabase
      .from('hero_slides')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteHeroSlide(id: string): Promise<void> {
    const { error } = await supabase
      .from('hero_slides')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Admin: Audit Log
  static async getAuditLogs(): Promise<AuditLog[]> {
    const { data, error } = await supabase
      .from('admin_audit_log')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createAuditLog(log: {
    admin_id: string;
    action: AuditAction;
    entity: AuditEntity;
    entity_id?: string;
    changes?: Record<string, any>;
    ip_address?: string;
    user_agent?: string;
  }): Promise<AuditLog> {
    const { data, error } = await supabase
      .from('admin_audit_log')
      .insert([log])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Admin: Site Images
  static async getSiteImages(category?: string): Promise<any[]> {
    let query = supabase.from('site_images').select('*');
    if (category) {
      query = query.eq('category', category);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  static async createSiteImage(image: {
    name: string;
    url: string;
    alt?: string;
    category?: string;
    file_size?: number;
    mime_type?: string;
    uploaded_by?: string;
  }): Promise<any> {
    const { data, error } = await supabase
      .from('site_images')
      .insert([image])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async deleteSiteImage(id: string): Promise<void> {
    const { error } = await supabase
      .from('site_images')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  // Admin: Profiles (for user management)
  static async getProfiles(): Promise<any[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async updateProfileRole(id: string, role: string): Promise<any> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
