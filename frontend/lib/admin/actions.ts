import { getAdminClient } from '@/lib/supabase/admin-client';
import { logAudit } from './audit';

const db = () => getAdminClient() as any;

// ============================================================
// PRODUCTS
// ============================================================
export async function createProduct(data: any, adminId: string) {
  const supabase = db();
  const { data: product, error } = await supabase
    .from('products')
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);

  await logAudit({
    adminId,
    action: 'create',
    entity: 'product',
    entityId: product.id,
    changes: data,
  });

  return product;
}

export async function updateProduct(id: string, data: any, adminId: string) {
  const supabase = db();
  const { data: oldProduct, error: fetchError } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) throw new Error('Product not found');

  const { data: product, error } = await supabase
    .from('products')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  await logAudit({
    adminId,
    action: 'update',
    entity: 'product',
    entityId: id,
    changes: { before: oldProduct, after: data },
  });

  return product;
}

export async function deleteProduct(id: string, adminId: string) {
  const supabase = db();
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('name')
    .eq('id', id)
    .single();

  if (fetchError) throw new Error('Product not found');

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);

  await logAudit({
    adminId,
    action: 'delete',
    entity: 'product',
    entityId: id,
    changes: { name: product.name },
  });
}

export async function bulkDeleteProducts(ids: string[], adminId: string) {
  const supabase = db();
  const { error } = await supabase
    .from('products')
    .delete()
    .in('id', ids);

  if (error) throw new Error(error.message);

  for (const id of ids) {
    await logAudit({ adminId, action: 'delete', entity: 'product', entityId: id, changes: {} });
  }
}

export async function bulkUpdateProducts(
  ids: string[],
  updates: Record<string, any>,
  adminId: string
) {
  const supabase = db();
  const { error } = await supabase
    .from('products')
    .update(updates)
    .in('id', ids);

  if (error) throw new Error(error.message);

  for (const id of ids) {
    await logAudit({ adminId, action: 'update', entity: 'product', entityId: id, changes: updates });
  }
}

// ============================================================
// CATEGORIES
// ============================================================
export async function createCategory(data: any, adminId: string) {
  const supabase = db();
  const { data: category, error } = await supabase
    .from('categories')
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);

  await logAudit({ adminId, action: 'create', entity: 'category', entityId: category.id, changes: data });
  return category;
}

export async function updateCategory(id: string, data: any, adminId: string) {
  const supabase = db();
  const { data: category, error } = await supabase
    .from('categories')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  await logAudit({ adminId, action: 'update', entity: 'category', entityId: id, changes: data });
  return category;
}

export async function deleteCategory(id: string, adminId: string) {
  const supabase = db();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw new Error(error.message);

  await logAudit({ adminId, action: 'delete', entity: 'category', entityId: id, changes: {} });
}

export async function reorderCategories(items: { id: string; sort_order: number }[], adminId: string) {
  const supabase = db();
  for (const item of items) {
    const { error } = await supabase
      .from('categories')
      .update({ sort_order: item.sort_order })
      .eq('id', item.id);
    if (error) throw new Error(error.message);
  }

  await logAudit({ adminId, action: 'update', entity: 'category', entityId: 'bulk-reorder', changes: { items } });
}

// ============================================================
// ORDERS
// ============================================================
export async function updateOrderStatus(id: string, status: string, adminId: string) {
  const supabase = db();
  const { data: order, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  await logAudit({ adminId, action: 'update', entity: 'order', entityId: id, changes: { status } });
  return order;
}

export async function updatePaymentStatus(id: string, paymentStatus: string, mpesaReceipt?: string, adminId?: string) {
  const supabase = db();
  const update: any = { payment_status: paymentStatus };
  if (mpesaReceipt) update.mpesa_receipt = mpesaReceipt;

  const { error } = await supabase.from('orders').update(update).eq('id', id);
  if (error) throw new Error(error.message);

  if (adminId) {
    await logAudit({ adminId, action: 'update', entity: 'order', entityId: id, changes: update });
  }
}

// ============================================================
// HERO SLIDES
// ============================================================
export async function createHeroSlide(data: any, adminId: string) {
  const supabase = db();
  const { data: slide, error } = await supabase
    .from('hero_slides')
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);

  await logAudit({ adminId, action: 'create', entity: 'hero_slide', entityId: slide.id, changes: data });
  return slide;
}

export async function updateHeroSlide(id: string, data: any, adminId: string) {
  const supabase = db();
  const { data: slide, error } = await supabase
    .from('hero_slides')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  await logAudit({ adminId, action: 'update', entity: 'hero_slide', entityId: id, changes: data });
  return slide;
}

export async function deleteHeroSlide(id: string, adminId: string) {
  const supabase = db();
  const { error } = await supabase.from('hero_slides').delete().eq('id', id);
  if (error) throw new Error(error.message);

  await logAudit({ adminId, action: 'delete', entity: 'hero_slide', entityId: id, changes: {} });
}

export async function reorderHeroSlides(items: { id: string; sort_order: number }[], adminId: string) {
  const supabase = db();
  for (const item of items) {
    const { error } = await supabase
      .from('hero_slides')
      .update({ sort_order: item.sort_order })
      .eq('id', item.id);
    if (error) throw new Error(error.message);
  }

  await logAudit({ adminId, action: 'update', entity: 'hero_slide', entityId: 'bulk-reorder', changes: { items } });
}

// ============================================================
// SITE SETTINGS
// ============================================================
export async function updateSiteSetting(key: string, value: any, adminId: string) {
  const supabase = db();
  const { data, error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_by: adminId }, { onConflict: 'key' })
    .select()
    .single();

  if (error) throw new Error(error.message);

  await logAudit({ adminId, action: 'update', entity: 'site_setting', entityId: key, changes: { value } });
  return data;
}

// ============================================================
// PROFILE / USER MANAGEMENT
// ============================================================
export async function updateUserRole(userId: string, role: string, adminId: string) {
  const supabase = db();
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  await logAudit({ adminId, action: 'update', entity: 'profile', entityId: userId, changes: { role } });
  return data;
}
