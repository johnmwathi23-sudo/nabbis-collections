const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://hmjfbzifrwuqwzqqvajs.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtamZiemlmcnd1cXd6cXF2YWpzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTMzMzY5NiwiZXhwIjoyMDk2OTA5Njk2fQ.WpZuGoh37jvFU8nE4cClWubslUErJCqsWtgCIaPfoM8';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const categoryProducts = {
  'womens-fashion': [
    {
      name: 'Floral Maxi Dress',
      description: 'Elegant floral print maxi dress perfect for any occasion. Features a flattering A-line silhouette with adjustable waist tie. Made from lightweight, breathable fabric.',
      short_description: 'Elegant floral print maxi dress with A-line silhouette',
      price: 4500,
      sale_price: 3500,
      on_sale: true,
      images: [{ url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600', alt: 'Floral Maxi Dress' }],
      attributes: { Size: ['S', 'M', 'L', 'XL'], Color: ['Red Floral', 'Blue Floral', 'White Floral'], Material: ['Cotton Blend'] },
    },
    {
      name: 'Classic Blazer',
      description: 'Tailored women\'s blazer in premium fabric. Perfect for office wear or formal events. Features notched lapels and a single breasted closure.',
      short_description: 'Tailored blazer in premium fabric for office or formal wear',
      price: 6800,
      images: [{ url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600', alt: 'Classic Blazer' }],
      attributes: { Size: ['XS', 'S', 'M', 'L', 'XL'], Color: ['Black', 'Navy', 'Beige'], Material: ['Polyester Blend'] },
    },
    {
      name: 'Casual Wrap Top',
      description: 'Versatile wrap top that transitions from day to night effortlessly. Soft and stretchy fabric with a flattering wrap design.',
      short_description: 'Versatile wrap top for day to night wear',
      price: 2200,
      images: [{ url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600', alt: 'Casual Wrap Top' }],
      attributes: { Size: ['XS', 'S', 'M', 'L', 'XL'], Color: ['White', 'Black', 'Olive', 'Burgundy'], Material: ['Rayon Spandex'] },
    },
  ],
  'mens-fashion': [
    {
      name: 'Slim Fit Chinos',
      description: 'Modern slim fit chinos crafted from stretch cotton twill. Perfect for both casual and semi-formal occasions.',
      short_description: 'Modern slim fit chinos in stretch cotton twill',
      price: 3500,
      images: [{ url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600', alt: 'Slim Fit Chinos' }],
      attributes: { Size: ['30', '32', '34', '36', '38'], Color: ['Khaki', 'Navy', 'Charcoal', 'Olive'], Material: ['Cotton Twill'] },
    },
    {
      name: 'Oxford Button-Down Shirt',
      description: 'Classic Oxford cloth button-down shirt. A wardrobe essential featuring a button-down collar and chest pocket.',
      short_description: 'Classic Oxford cloth button-down shirt',
      price: 2800,
      sale_price: 2200,
      on_sale: true,
      images: [{ url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600', alt: 'Oxford Button-Down Shirt' }],
      attributes: { Size: ['S', 'M', 'L', 'XL', 'XXL'], Color: ['White', 'Light Blue', 'Pink'], Material: ['Cotton Oxford'] },
    },
    {
      name: 'Leather Belt',
      description: 'Genuine leather belt with a polished brass buckle. A timeless accessory that complements any outfit.',
      short_description: 'Genuine leather belt with polished brass buckle',
      price: 1800,
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', alt: 'Leather Belt' }],
      attributes: { Size: ['95cm', '100cm', '105cm', '110cm'], Color: ['Brown', 'Black'], Material: ['Genuine Leather'] },
    },
  ],
  'children': [
    {
      name: 'Printed Cotton Romper',
      description: 'Adorable printed romper for babies and toddlers. Made from 100% organic cotton with snap buttons for easy diaper changes.',
      short_description: 'Adorable printed romper in 100% organic cotton',
      price: 1500,
      images: [{ url: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600', alt: 'Printed Cotton Romper' }],
      attributes: { Size: ['0-3M', '3-6M', '6-12M', '12-18M'], Color: ['Animal Print', 'Polka Dot', 'Stripes'], Material: ['Organic Cotton'] },
    },
    {
      name: 'Kids Denim Jacket',
      description: 'Cool denim jacket for boys and girls. Features classic styling with adjustable button tabs at the waist.',
      short_description: 'Cool classic denim jacket for boys and girls',
      price: 2800,
      images: [{ url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600', alt: 'Kids Denim Jacket' }],
      attributes: { Size: ['2T', '3T', '4T', '5', '6', '7'], Color: ['Light Wash', 'Medium Wash'], Material: ['Denim'] },
    },
    {
      name: 'School Backpack',
      description: 'Durable and comfortable school backpack with padded straps and multiple compartments. Features reflective strips for safety.',
      short_description: 'Durable school backpack with padded straps',
      price: 2200,
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', alt: 'School Backpack' }],
      attributes: { Color: ['Blue', 'Pink', 'Red', 'Green'], Material: ['Polyester'] },
    },
  ],
  'home-living': [
    {
      name: 'Scented Candle Set',
      description: 'Set of 3 hand-poured soy wax candles in premium glass jars. Long-lasting fragrances: Vanilla Bean, Lavender Fields, and Fresh Linen.',
      short_description: 'Set of 3 hand-poured soy wax candles',
      price: 1800,
      sale_price: 1500,
      on_sale: true,
      images: [{ url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600', alt: 'Scented Candle Set' }],
      attributes: { Fragrance: ['Vanilla Bean', 'Lavender Fields', 'Fresh Linen'], Size: ['200ml each'], Material: ['Soy Wax'] },
    },
    {
      name: 'Throw Blanket',
      description: 'Ultra-soft microfiber throw blanket perfect for cozy evenings. Lightweight yet warm with a modern geometric pattern.',
      short_description: 'Ultra-soft microfiber throw blanket with geometric pattern',
      price: 2500,
      images: [{ url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600', alt: 'Throw Blanket' }],
      attributes: { Size: ['150x200cm'], Color: ['Grey', 'Navy', 'Burgundy', 'Blush'], Material: ['Microfiber'] },
    },
    {
      name: 'Ceramic Mug Set',
      description: 'Set of 4 elegant ceramic mugs. Dishwasher and microwave safe. Each mug holds 350ml.',
      short_description: 'Set of 4 elegant ceramic mugs, 350ml each',
      price: 1200,
      images: [{ url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600', alt: 'Ceramic Mug Set' }],
      attributes: { Color: ['Matte Black', 'Cream White', 'Sage Green'], Material: ['Ceramic'] },
    },
  ],
  'beauty-body': [
    {
      name: 'Vitamin C Serum',
      description: 'Brightening vitamin C serum with hyaluronic acid and vitamin E. Helps reduce dark spots and even skin tone.',
      short_description: 'Brightening vitamin C serum with hyaluronic acid',
      price: 1500,
      images: [{ url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600', alt: 'Vitamin C Serum' }],
      attributes: { Size: ['30ml'], Type: ['Serum'], SkinType: ['All Skin Types'] },
    },
    {
      name: 'Shea Butter Body Lotion',
      description: 'Rich and nourishing body lotion made with natural shea butter. Deeply moisturizes without feeling greasy.',
      short_description: 'Rich nourishing body lotion with natural shea butter',
      price: 900,
      images: [{ url: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38c5f?w=600', alt: 'Shea Butter Body Lotion' }],
      attributes: { Size: ['250ml'], Fragrance: ['Original', 'Coconut', 'Lavender'], Type: ['Body Lotion'] },
    },
    {
      name: 'Essential Oil Diffuser',
      description: 'Ultrasonic aromatherapy diffuser with LED lights. Runs for up to 8 hours with auto shut-off. Includes 3 essential oil samples.',
      short_description: 'Ultrasonic aromatherapy diffuser with LED lights',
      price: 3200,
      sale_price: 2800,
      on_sale: true,
      images: [{ url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600', alt: 'Essential Oil Diffuser' }],
      attributes: { Color: ['White', 'Black', 'Wood Grain'], Capacity: ['200ml'], Material: ['BPA-free Plastic'] },
    },
  ],
  'accessories': [
    {
      name: 'Leather Crossbody Bag',
      description: 'Minimalist leather crossbody bag with adjustable strap. Features multiple interior pockets and a secure zip closure.',
      short_description: 'Minimalist leather crossbody bag with adjustable strap',
      price: 5500,
      sale_price: 4200,
      on_sale: true,
      images: [{ url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600', alt: 'Leather Crossbody Bag' }],
      attributes: { Color: ['Brown', 'Black', 'Tan'], Material: ['Genuine Leather'] },
    },
    {
      name: 'Aviator Sunglasses',
      description: 'Classic aviator sunglasses with UV400 protection. Lightweight metal frame with adjustable nose pads.',
      short_description: 'Classic aviator sunglasses with UV400 protection',
      price: 2000,
      images: [{ url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600', alt: 'Aviator Sunglasses' }],
      attributes: { FrameColor: ['Gold', 'Silver', 'Black'], Lens: ['Green', 'Brown', 'Grey'], Material: ['Metal Frame'] },
    },
    {
      name: 'Woven Bracelet',
      description: 'Handwoven bracelet made from premium threads and finished with a brass charm. Adjustable to fit any wrist size.',
      short_description: 'Handwoven bracelet with brass charm',
      price: 500,
      images: [{ url: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600', alt: 'Woven Bracelet' }],
      attributes: { Color: ['Black', 'Navy', 'Red', 'Brown'], Style: ['With Charm', 'Plain'], Material: ['Cotton Thread'] },
    },
  ],
};

async function seed() {
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('sort_order');

  if (!categories) {
    console.error('No categories found');
    process.exit(1);
  }

  console.log(`Found ${categories.length} categories`);

  let total = 0;
  for (const cat of categories) {
    const products = categoryProducts[cat.slug];
    if (!products) {
      console.log(`  Skipping ${cat.name} (no products defined)`);
      continue;
    }

    for (const p of products) {
      const slug = slugify(p.name) + '-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
      const { error } = await supabase.from('products').insert({
        name: p.name,
        slug,
        description: p.description,
        short_description: p.short_description,
        price: p.price,
        sale_price: p.sale_price || null,
        sku: 'DM-' + Math.random().toString(36).slice(2, 10).toUpperCase(),
        stock_quantity: Math.floor(Math.random() * 50) + 5,
        stock_status: 'instock',
        images: JSON.stringify(p.images),
        category_id: cat.id,
        featured: false,
        attributes: JSON.stringify(p.attributes),
        average_rating: (Math.random() * 2 + 3).toFixed(2),
        review_count: Math.floor(Math.random() * 20),
        is_active: true,
      });

      if (error) {
        console.error(`  Error inserting "${p.name}": ${error.message}`);
      } else {
        console.log(`  ✓ ${cat.name} → ${p.name} (KSh ${p.price})`);
        total++;
      }
    }
  }

  console.log(`\nDone! Inserted ${total} demo products.`);
  process.exit(0);
}

seed().catch(e => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
