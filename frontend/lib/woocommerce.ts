// Backward compatibility re-exports
// All functions now use Supabase instead of WooCommerce
export type { Product, Category } from './types';
export {
  getProducts,
  getProduct,
  getProductById,
  getFeaturedProducts,
  getNewArrivals,
  getOnSaleProducts,
  getRelatedProducts,
} from './db/products';

export {
  getCategories,
  getCategory,
} from './db/categories';
