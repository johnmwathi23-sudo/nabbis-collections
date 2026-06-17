const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://hmjfbzifrwuqwzqqvajs.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtamZiemlmcnd1cXd6cXF2YWpzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTMzMzY5NiwiZXhwIjoyMDk2OTA5Njk2fQ.WpZuGoh37jvFU8nE4cClWubslUErJCqsWtgCIaPfoM8';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const slides = [
  {
    title: 'Premium Fashion & Lifestyle<br />for Kenya',
    subtitle: 'Discover curated collections of fashion, bags, and home essentials delivered to your doorstep.',
    cta_text: 'Shop Now',
    cta_link: '/shop',
    desktop_image_url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1920&q=80',
    overlay_opacity: 0.4,
    text_color: '#FFFFFF',
    bg_color: '#3B0764',
    is_active: true,
    sort_order: 0,
  },
  {
    title: 'New Season Collection',
    subtitle: 'Explore the latest trends in fashion and accessories. Fresh styles arriving daily.',
    cta_text: 'Explore New Arrivals',
    cta_link: '/shop?orderby=date',
    desktop_image_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80',
    overlay_opacity: 0.45,
    text_color: '#FFFFFF',
    bg_color: '#1E1B4B',
    is_active: true,
    sort_order: 1,
  },
  {
    title: 'Bags & Accessories',
    subtitle: 'Complete your look with our handpicked selection of bags, belts, and accessories.',
    cta_text: 'Shop Accessories',
    cta_link: '/shop?category=accessories',
    desktop_image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1920&q=80',
    overlay_opacity: 0.4,
    text_color: '#FFFFFF',
    bg_color: '#4C1D95',
    is_active: true,
    sort_order: 2,
  },
  {
    title: 'Flash Sale – Up to 50% Off',
    subtitle: 'Limited time offers on selected items. Stock is moving fast — don\'t miss out!',
    cta_text: 'Shop the Sale',
    cta_link: '/shop?on_sale=true',
    desktop_image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80',
    overlay_opacity: 0.5,
    text_color: '#FFFFFF',
    bg_color: '#B91C1C',
    is_active: true,
    sort_order: 3,
  },
  {
    title: 'Home & Living Essentials',
    subtitle: 'Transform your space with our curated home collection — from decor to kitchenware.',
    cta_text: 'Shop Home',
    cta_link: '/shop?category=home-living',
    desktop_image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=80',
    overlay_opacity: 0.4,
    text_color: '#FFFFFF',
    bg_color: '#065F46',
    is_active: true,
    sort_order: 4,
  },
];

async function seed() {
  const { data: existing } = await supabase
    .from('hero_slides')
    .select('id')
    .limit(1);

  if (existing && existing.length > 0) {
    console.log('Hero slides already exist, skipping seed.');
    process.exit(0);
  }

  const { data: { user } } = await supabase.auth.admin.listUsers();
  const admin = user?.users?.find(u => u.email === 'ceo@nabbiscollections.com');
  const userId = admin?.id || null;

  let count = 0;
  for (const slide of slides) {
    const { error } = await supabase.from('hero_slides').insert({
      ...slide,
      created_by: userId,
    });
    if (error) {
      console.error(`Error inserting "${slide.title}": ${error.message}`);
    } else {
      console.log(`  ✓ ${slide.title}`);
      count++;
    }
  }

  console.log(`\nDone! Inserted ${count} hero slides.`);
  process.exit(0);
}

seed().catch(e => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
