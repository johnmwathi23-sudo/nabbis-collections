import { createServerClient, createAnonClient } from '@/lib/supabase';

export async function getWishlist(customerId: string): Promise<string[]> {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from('wishlist_items')
    .select('product_id')
    .eq('customer_id', customerId);

  if (error) throw new Error(`Failed to fetch wishlist: ${error.message}`);
  return (data || []).map((d) => d.product_id);
}

export async function addToWishlist(customerId: string, productId: string): Promise<void> {
  const supabase = createAnonClient();
  const { error } = await supabase
    .from('wishlist_items')
    .insert({ customer_id: customerId, product_id: productId });

  if (error && error.code !== '23505') {
    throw new Error(`Failed to add to wishlist: ${error.message}`);
  }
}

export async function removeFromWishlist(customerId: string, productId: string): Promise<void> {
  const supabase = createAnonClient();
  const { error } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('customer_id', customerId)
    .eq('product_id', productId);

  if (error) throw new Error(`Failed to remove from wishlist: ${error.message}`);
}

export async function isInWishlist(customerId: string, productId: string): Promise<boolean> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from('wishlist_items')
    .select('id')
    .eq('customer_id', customerId)
    .eq('product_id', productId)
    .maybeSingle();

  return !!data;
}
