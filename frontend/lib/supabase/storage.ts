import { getAdminClient } from './admin-client';

const BUCKETS = {
  SITE_ASSETS: 'site-assets',
  HERO_IMAGES: 'hero-images',
  PRODUCT_IMAGES: 'product-images',
} as const;

export { BUCKETS };

export async function uploadFile(
  bucket: string,
  path: string,
  file: File | Blob,
  upsert = false
): Promise<string> {
  const supabase = getAdminClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert, cacheControl: '31536000' });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function deleteFile(bucket: string, path: string): Promise<void> {
  const supabase = getAdminClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}

export async function listFiles(bucket: string, prefix?: string) {
  const supabase = getAdminClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(prefix || '', { limit: 100, offset: 0 });

  if (error) throw new Error(`List failed: ${error.message}`);
  return data;
}

export function getPublicUrl(bucket: string, path: string) {
  const supabase = getAdminClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
