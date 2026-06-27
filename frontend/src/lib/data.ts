import { Product, Category, Vendor } from './types';

export const CATEGORIES: Category[] = [
  { id: 1, name: 'Fashion & Clothing', slug: 'fashion-clothing', description: 'Trendy outfits, traditional wear, and everyday fashion for men and women.', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600', productCount: 234 },
  { id: 2, name: 'Footwear', slug: 'footwear', description: 'Shoes, sneakers, sandals, boots and more for every occasion.', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600', productCount: 187 },
  { id: 3, name: 'Home & Household Accessories', slug: 'home-accessories', description: 'Furniture, decor, and essentials to make your house a home.', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600', productCount: 312 },
  { id: 4, name: 'Beddings & Decor', slug: 'beddings-decor', description: 'Premium bedsheets, pillows, duvets, and home decoration items.', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=600', productCount: 145 },
  { id: 5, name: 'Kitchen Essentials', slug: 'kitchen-essentials', description: 'Cookware, utensils, appliances and all things kitchen.', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=600', productCount: 198 },
  { id: 6, name: 'Baby Products', slug: 'baby-products', description: 'Safe and quality products for newborns, toddlers and young children.', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=600', productCount: 93 },
  { id: 7, name: 'Beauty & Personal Care', slug: 'beauty-care', description: 'Skincare, haircare, makeup, fragrances and personal grooming products.', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=600', productCount: 276 },
  { id: 8, name: 'Health & Wellness', slug: 'health-wellness', description: 'Supplements, vitamins, medical devices and wellness products.', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600', productCount: 154 },
  { id: 9, name: 'Fitness & Yoga Accessories', slug: 'fitness-yoga', description: 'Gym equipment, yoga mats, resistance bands and sports gear.', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600', productCount: 121 },
  { id: 10, name: 'Assistive Devices', slug: 'assistive-devices', description: 'Mobility aids, hearing devices and daily living assistance products.', image: 'https://images.unsplash.com/photo-1576765608866-5b51046452be?auto=format&fit=crop&q=80&w=600', productCount: 67 },
  { id: 11, name: 'Lifestyle & Gifts', slug: 'lifestyle-gifts', description: 'Unique gifts, stationery, tech accessories, and lifestyle products.', image: 'https://images.unsplash.com/photo-1513201099705-a9746072f3b8?auto=format&fit=crop&q=80&w=600', productCount: 203 },
];

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Premium Leather Chelsea Boots', slug: 'premium-leather-chelsea-boots', price: 4500, oldPrice: 5800, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=500', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=700', 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=700'], category: 'Footwear', badge: 'Best Seller', vendor: 'Nairobi Styles', vendorId: 1, rating: 4.8, reviews: 124, stock: 15, description: 'Handcrafted premium leather Chelsea boots with elastic side panels for easy wear. Perfect for both casual and semi-formal occasions.', tags: ['boots', 'leather', 'men'], featured: true },
  { id: 2, name: 'Elegant Ankara Wrap Dress', slug: 'elegant-ankara-wrap-dress', price: 2800, oldPrice: null, image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=500', images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=700'], category: 'Fashion & Clothing', badge: 'New', vendor: 'KE Fashion Hub', vendorId: 2, rating: 4.6, reviews: 89, stock: 30, description: 'Beautiful Ankara-print wrap dress, perfect for outdoor events and office wear. Available in multiple sizes.', tags: ['dress', 'ankara', 'women'], featured: true },
  { id: 3, name: 'Smart Fitness Tracker Watch', slug: 'smart-fitness-tracker-watch', price: 3200, oldPrice: 4200, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=500', images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=700'], category: 'Fitness & Yoga Accessories', badge: 'Sale', vendor: 'TechGadgets KE', vendorId: 3, rating: 4.5, reviews: 203, stock: 22, description: 'Track your fitness goals with this smart watch featuring heart rate, step count, sleep tracking, and 7-day battery life.', tags: ['watch', 'fitness', 'tech'], featured: true },
  { id: 4, name: 'Organic Glow Skincare Set', slug: 'organic-glow-skincare-set', price: 1500, oldPrice: null, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=500', images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=700'], category: 'Beauty & Personal Care', badge: null, vendor: 'Glow Beauty', vendorId: 4, rating: 4.7, reviews: 156, stock: 45, description: 'Complete 4-piece organic skincare set with cleanser, toner, serum and moisturiser. Made from natural Kenyan botanical extracts.', tags: ['skincare', 'organic', 'beauty'], featured: true },
  { id: 5, name: '6-Piece Non-Stick Kitchen Set', slug: '6-piece-non-stick-kitchen-set', price: 6500, oldPrice: 8000, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=500', category: 'Kitchen Essentials', badge: 'Sale', vendor: 'Home Essentials', vendorId: 5, rating: 4.4, reviews: 78, stock: 12, description: 'Premium non-stick cookware set including frying pan, saucepan, and casserole. Compatible with all heat sources including induction.', tags: ['cookware', 'kitchen', 'home'], featured: false },
  { id: 6, name: "Children's Comfort Sneakers", slug: 'childrens-comfort-sneakers', price: 1800, oldPrice: null, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=500', category: 'Baby Products', badge: 'New', vendor: 'Baby Steps', vendorId: 6, rating: 4.9, reviews: 43, stock: 60, description: 'Comfortable, breathable sneakers for children aged 2-10. Features cushioned insoles and easy velcro closure.', tags: ['kids', 'shoes', 'baby'] },
  { id: 7, name: 'Egyptian Cotton Bedding Set', slug: 'egyptian-cotton-bedding-set', price: 4200, oldPrice: 5500, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=500', category: 'Beddings & Decor', badge: 'Best Seller', vendor: 'Comfort Living', vendorId: 7, rating: 4.8, reviews: 187, stock: 20, description: '400-thread count Egyptian cotton bedding set including duvet cover, 2 pillow cases, and fitted sheet. Available in King and Queen sizes.', tags: ['bedding', 'cotton', 'home'], featured: true },
  { id: 8, name: 'Premium Yoga Mat with Bag', slug: 'premium-yoga-mat-with-bag', price: 2200, oldPrice: 2800, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=500', category: 'Fitness & Yoga Accessories', badge: 'Sale', vendor: 'FitKenya', vendorId: 8, rating: 4.6, reviews: 92, stock: 35, description: 'Eco-friendly anti-slip yoga mat (6mm thick) with alignment lines and a matching carrying bag. Perfect for home and studio practice.', tags: ['yoga', 'fitness', 'mat'] },
  { id: 9, name: 'Handwoven Sisal Basket Set', slug: 'handwoven-sisal-basket-set', price: 1200, oldPrice: null, image: 'https://images.unsplash.com/photo-1513201099705-a9746072f3b8?auto=format&fit=crop&q=80&w=500', category: 'Lifestyle & Gifts', badge: 'New', vendor: 'Artisan Kenya', vendorId: 9, rating: 4.9, reviews: 61, stock: 25, description: 'Set of 3 hand-woven Kenyan sisal baskets, ideal for storage or as unique decorative gifts. Each piece is unique and crafted by local artisans.', tags: ['handmade', 'sisal', 'kenya', 'gift'] },
  { id: 10, name: 'Men\'s Slim-Fit Chino Pants', slug: 'mens-slim-fit-chino-pants', price: 1900, oldPrice: 2400, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=500', category: 'Fashion & Clothing', badge: 'Sale', vendor: 'Nairobi Styles', vendorId: 1, rating: 4.3, reviews: 112, stock: 50, description: 'Slim-fit stretch chino pants, ideal for office wear and casual outings. Available in Navy, Khaki, Black and Olive.', tags: ['pants', 'men', 'fashion'] },
  { id: 11, name: 'Vitamin C Brightening Serum', slug: 'vitamin-c-brightening-serum', price: 850, oldPrice: null, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=500', category: 'Beauty & Personal Care', badge: 'Best Seller', vendor: 'Glow Beauty', vendorId: 4, rating: 4.7, reviews: 234, stock: 80, description: '20% Vitamin C serum that brightens, evens skin tone, and reduces dark spots. Suitable for all skin types.', tags: ['serum', 'skincare', 'vitamin-c'], isFlash: true },
  { id: 12, name: 'Baby Soft Cotton Romper Set', slug: 'baby-soft-cotton-romper-set', price: 650, oldPrice: null, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=500', category: 'Baby Products', badge: 'New', vendor: 'Baby Steps', vendorId: 6, rating: 4.8, reviews: 55, stock: 70, description: 'Soft 100% organic cotton romper set for babies (0-24 months). Available in 5 cute prints. Gentle on sensitive skin.', tags: ['baby', 'cotton', 'romper'], isFlash: true },
  { id: 13, name: 'Wall-Mounted Floating Shelves', slug: 'wall-mounted-floating-shelves', price: 2800, oldPrice: 3500, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=500', category: 'Home & Household Accessories', badge: 'Sale', vendor: 'Home Essentials', vendorId: 5, rating: 4.5, reviews: 88, stock: 18, description: 'Set of 3 modern floating shelves with invisible wall brackets. Easy to install and supports up to 10kg each.', tags: ['shelves', 'home', 'decor'], isFlash: true },
  { id: 14, name: 'Adjustable Resistance Band Set', slug: 'adjustable-resistance-band-set', price: 980, oldPrice: 1200, image: 'https://images.unsplash.com/photo-1519419166318-4f5978601567?auto=format&fit=crop&q=80&w=500', category: 'Fitness & Yoga Accessories', badge: 'Sale', vendor: 'FitKenya', vendorId: 8, rating: 4.4, reviews: 147, stock: 55, description: 'Set of 5 latex resistance bands with varying resistance levels (5-35kg). Includes carry bag and workout guide.', tags: ['resistance', 'fitness', 'gym'], isFlash: true },
  { id: 15, name: 'Decorative Ceramic Vase Set', slug: 'decorative-ceramic-vase-set', price: 1600, oldPrice: null, image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=500', category: 'Home & Household Accessories', badge: 'New', vendor: 'Home Essentials', vendorId: 5, rating: 4.6, reviews: 39, stock: 28, description: 'Set of 3 hand-painted ceramic vases in earthy tones, perfect for any modern or traditional Kenyan home.', tags: ['vases', 'decor', 'ceramic'] },
  { id: 16, name: 'Ladies Leather Handbag', slug: 'ladies-leather-handbag', price: 3500, oldPrice: 4200, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=500', category: 'Fashion & Clothing', badge: 'Sale', vendor: 'KE Fashion Hub', vendorId: 2, rating: 4.7, reviews: 198, stock: 22, description: 'Premium faux leather tote handbag with multiple compartments, inner pockets, and detachable strap.', tags: ['handbag', 'women', 'fashion'] },
];

export const VENDORS: Vendor[] = [
  { id: 1, name: 'Nairobi Styles', logo: 'NS', description: 'Your premier fashion destination in Nairobi.', rating: 4.7, totalProducts: 45, totalSales: 1230, status: 'active', joinedDate: '2023-01-15', location: 'Nairobi' },
  { id: 2, name: 'KE Fashion Hub', logo: 'KF', description: 'Modern African fashion for the contemporary Kenyan.', rating: 4.5, totalProducts: 38, totalSales: 876, status: 'active', joinedDate: '2023-03-22', location: 'Mombasa' },
  { id: 3, name: 'TechGadgets KE', logo: 'TG', description: 'Latest tech gadgets and electronics at affordable prices.', rating: 4.4, totalProducts: 29, totalSales: 654, status: 'active', joinedDate: '2023-06-01', location: 'Nairobi' },
  { id: 4, name: 'Glow Beauty', logo: 'GB', description: 'Premium beauty and personal care products.', rating: 4.8, totalProducts: 62, totalSales: 2100, status: 'active', joinedDate: '2022-11-10', location: 'Nairobi' },
  { id: 5, name: 'Home Essentials', logo: 'HE', description: 'Everything you need to make a house a home.', rating: 4.5, totalProducts: 87, totalSales: 1450, status: 'active', joinedDate: '2022-09-20', location: 'Kisumu' },
  { id: 6, name: 'Baby Steps', logo: 'BS', description: 'Safe, quality products for your little ones.', rating: 4.9, totalProducts: 34, totalSales: 789, status: 'active', joinedDate: '2023-02-14', location: 'Nairobi' },
  { id: 7, name: 'Comfort Living', logo: 'CL', description: 'Premium bedding and home comfort products.', rating: 4.7, totalProducts: 23, totalSales: 567, status: 'active', joinedDate: '2023-04-05', location: 'Nakuru' },
  { id: 8, name: 'FitKenya', logo: 'FK', description: 'Quality fitness and sports equipment for all levels.', rating: 4.6, totalProducts: 41, totalSales: 923, status: 'active', joinedDate: '2023-01-28', location: 'Nairobi' },
  { id: 9, name: 'Artisan Kenya', logo: 'AK', description: 'Handcrafted Kenyan products by local artisans.', rating: 4.9, totalProducts: 18, totalSales: 312, status: 'pending', joinedDate: '2024-01-10', location: 'Mombasa' },
];

export const TESTIMONIALS = [
  { name: 'Grace Wanjiku', location: 'Nairobi', text: "Nabbis Collections has the best quality fashion items I've ever shopped online. Delivery was faster than expected!", avatar: 'GW', rating: 5 },
  { name: 'Brian Otieno', location: 'Mombasa', text: "Running my small business on Nabbis has tripled my sales. The vendor tools are incredibly easy to use.", avatar: 'BO', rating: 5 },
  { name: 'Amina Hassan', location: 'Kisumu', text: "Love the variety of products and how easy it is to pay with M-Pesa. Will definitely recommend to friends!", avatar: 'AH', rating: 5 },
  { name: 'Peter Kariuki', location: 'Nakuru', text: "The quality of products is consistently excellent. I've been shopping here for 6 months and have never been disappointed.", avatar: 'PK', rating: 4 },
];

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter(p => p.category.toLowerCase() === category.toLowerCase());
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug);
}

export function getFlashSaleProducts(): Product[] {
  return PRODUCTS.filter(p => p.isFlash);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter(p => p.featured);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.vendor.toLowerCase().includes(q) ||
    (p.tags || []).some(t => t.includes(q))
  );
}

export const fmt = (n: number) => `KES ${n.toLocaleString()}`;
export const discountPct = (price: number, old: number) => Math.round(((old - price) / old) * 100);
