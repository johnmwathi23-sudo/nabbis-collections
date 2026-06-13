import { createServerClient } from '@/lib/supabase';
import type { Category } from '@/lib/types';
import { cache } from 'react';

export const getCategories = cache(async (): Promise<Category[]> => {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) return [];
    return (data as Category[]) || [];
  } catch {
    return [];
  }
});

export const getCategory = cache(async (slug: string): Promise<Category | null> => {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) return null;
    return data as Category;
  } catch {
    return null;
  }
});

export const getCategoryById = cache(async (id: string): Promise<Category | null> => {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) return null;
    return data as Category;
  } catch {
    return null;
  }
});
