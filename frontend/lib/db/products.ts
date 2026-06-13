import { createServerClient } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import { cache } from 'react';

export const getProducts = cache(async (params?: {
  page?: number;
  per_page?: number;
  category?: string;
  category_slug?: string;
  search?: string;
  orderby?: string;
  order?: string;
  on_sale?: boolean;
  featured?: boolean;
}): Promise<{ products: Product[]; total: number }> => {
  try {
    const supabase = createServerClient();
    const page = params?.page || 1;
    const perPage = Math.min(params?.per_page || 24, 100);
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('is_active', true);

    if (params?.category) {
      query = query.eq('category_id', params.category);
    }
    if (params?.category_slug) {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', params.category_slug)
        .single();
      if (cat) query = query.eq('category_id', cat.id);
    }
    if (params?.search) {
      query = query.ilike('name', `%${params.search}%`);
    }
    if (params?.on_sale) {
      query = query.eq('on_sale', true);
    }
    if (params?.featured) {
      query = query.eq('featured', true);
    }

    const orderBy = params?.orderby || 'created_at';
    const order = (params?.order || 'desc') as 'asc' | 'desc';
    query = query.order(orderBy, { ascending: order === 'asc' });

    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) return { products: [], total: 0 };

    return { products: (data as Product[]) || [], total: count || 0 };
  } catch {
    return { products: [], total: 0 };
  }
});

export const getProduct = cache(async (slug: string): Promise<Product | null> => {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) return null;
    return data as Product;
  } catch {
    return null;
  }
});

export const getProductById = cache(async (id: string): Promise<Product | null> => {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) return null;
    return data as Product;
  } catch {
    return null;
  }
});

export const getFeaturedProducts = cache(async (limit = 8): Promise<Product[]> => {
  const { products } = await getProducts({ featured: true, per_page: limit, orderby: 'created_at', order: 'desc' });
  return products;
});

export const getNewArrivals = cache(async (limit = 8): Promise<Product[]> => {
  const { products } = await getProducts({ per_page: limit, orderby: 'created_at', order: 'desc' });
  return products;
});

export const getOnSaleProducts = cache(async (limit = 8): Promise<Product[]> => {
  const { products } = await getProducts({ on_sale: true, per_page: limit, orderby: 'created_at', order: 'desc' });
  return products;
});

export const getRelatedProducts = cache(async (productId: string, limit = 4): Promise<Product[]> => {
  try {
    const supabase = createServerClient();
    const product = await getProductById(productId);
    if (!product?.category_id) return [];

    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', product.category_id)
      .eq('is_active', true)
      .neq('id', productId)
      .order('created_at', { ascending: false })
      .limit(limit);

    return (data as Product[]) || [];
  } catch {
    return [];
  }
});
