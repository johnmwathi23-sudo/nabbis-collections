import { supabase } from './supabase';
import { Product, Category, Vendor, Order, User } from './types';

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
}
