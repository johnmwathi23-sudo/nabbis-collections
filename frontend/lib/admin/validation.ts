export interface ProductFormData {
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  sale_price?: number | null;
  sku?: string;
  stock_quantity: number;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  images: { url: string; alt: string }[];
  category_id?: string | null;
  featured: boolean;
  is_active: boolean;
  attributes: Record<string, string[]>;
}

export interface HeroSlideFormData {
  title: string;
  subtitle?: string;
  cta_text?: string;
  cta_link?: string;
  desktop_image_url?: string;
  mobile_image_url?: string;
  overlay_opacity: number;
  text_color: string;
  bg_color: string;
  sort_order: number;
  is_active: boolean;
  scheduled_from?: string | null;
  scheduled_to?: string | null;
}

export interface SiteSettingFormData {
  key: string;
  value: any;
  description?: string;
}

export function validateProduct(data: Partial<ProductFormData>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.name?.trim()) errors.name = 'Name is required';
  if (!data.slug?.trim()) errors.slug = 'Slug is required';
  if (data.price === undefined || data.price < 0) errors.price = 'Valid price is required';
  if (data.stock_quantity === undefined || data.stock_quantity < 0) {
    errors.stock_quantity = 'Stock quantity must be 0 or more';
  }
  if (data.sale_price !== undefined && data.sale_price !== null && data.sale_price >= 0) {
    if (data.price !== undefined && data.sale_price > data.price) {
      errors.sale_price = 'Sale price cannot exceed regular price';
    }
  }
  return errors;
}

export function validateHeroSlide(data: Partial<HeroSlideFormData>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.title?.trim()) errors.title = 'Title is required';
  if (data.overlay_opacity !== undefined && (data.overlay_opacity < 0 || data.overlay_opacity > 1)) {
    errors.overlay_opacity = 'Overlay must be between 0 and 1';
  }
  return errors;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
