'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';
import {
  FashionIcon, FootwearIcon, HomeIcon, BeddingIcon,
  KitchenIcon, BabyIcon, BeautyIcon, HealthIcon,
  FitnessIcon, AssistiveIcon, GiftIcon,
  QualityIcon, VendorIcon, DeliveryIcon, SecureIcon, AffordableIcon,
  ArrowRightIcon, ChevronRightIcon
} from '../components/Icons';
import styles from './page.module.css';

// --- Static Data ---
const CATEGORIES = [
  { name: 'Fashion & Clothing', icon: FashionIcon },
  { name: 'Footwear',           icon: FootwearIcon },
  { name: 'Home Accessories',   icon: HomeIcon },
  { name: 'Beddings & Decor',   icon: BeddingIcon },
  { name: 'Kitchen Essentials', icon: KitchenIcon },
  { name: 'Baby Products',      icon: BabyIcon },
  { name: 'Beauty & Care',      icon: BeautyIcon },
  { name: 'Health & Wellness',  icon: HealthIcon },
  { name: 'Fitness & Yoga',     icon: FitnessIcon },
  { name: 'Assistive Devices',  icon: AssistiveIcon },
  { name: 'Lifestyle & Gifts',  icon: GiftIcon },
];

const FEATURES = [
  { icon: QualityIcon,    title: 'Quality Products',   desc: 'Every vendor is verified to ensure top-quality products meet our standards.' },
  { icon: VendorIcon,     title: 'Trusted Vendors',    desc: 'Shop from thousands of verified sellers across the country.' },
  { icon: DeliveryIcon,   title: 'Nationwide Delivery', desc: 'Fast delivery within Nairobi (KES 250) and across Kenya via courier.' },
  { icon: SecureIcon,     title: 'Secure Payments',    desc: 'Pay safely via M-Pesa, Airtel Money, or your debit/credit card.' },
  { icon: AffordableIcon, title: 'Affordable Prices',  desc: 'Competitive prices and regular flash sales keep your budget happy.' },
];

const TESTIMONIALS = [
  { name: 'Grace Wanjiku', location: 'Nairobi', text: "Nabbis Collections has the best quality fashion items I've ever shopped online. Delivery was faster than I expected!", avatar: 'GW' },
  { name: 'Brian Otieno',  location: 'Mombasa', text: "Running my small business on Nabbis has tripled my sales. The vendor tools are incredibly easy to use.", avatar: 'BO' },
  { name: 'Amina Hassan',  location: 'Kisumu',  text: "Love the variety of products and how easy it is to pay with M-Pesa. Will definitely recommend to friends!", avatar: 'AH' },
];

const fmt = (n: number) => `KES ${n.toLocaleString()}`;
const discount = (p: number, o: number) => Math.round(((o - p) / o) * 100);

// --- Intersection Observer Hook ---
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add(styles.revealed); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

// Reveal wrapper component
const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = '', delay = 0 }) => {
  const ref = useReveal();
  return (
    <div ref={ref} className={`${styles.revealBlock} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

// --- Page ---
export default function Home() {
  const { products } = useApp();
  const displayProducts = products.filter(p => p.featured).length >= 8
    ? products.filter(p => p.featured)
    : products.slice(0, 8);

  return (
    <div className={styles.home}>

      {/* ===== HERO ===== */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <div className={`${styles.heroBadge} animate-scaleIn`}>🇰🇪 Kenya&apos;s #1 Multi-Vendor Marketplace</div>
            <h1 className={`${styles.heroHeadline} animate-fadeUp`}>
              Everything You Need,<br />
              <span className={styles.heroAccent}>All in One Place</span>
            </h1>
            <p className={`${styles.heroSubtitle} animate-fadeUp`} style={{ animationDelay: '0.15s' }}>
              Shop quality products from trusted vendors across Kenya — fashion, home, beauty, fitness &amp; more.
            </p>
            <div className={`${styles.heroActions} animate-fadeUp`} style={{ animationDelay: '0.3s' }}>
              <Link href="/shop">
                <Button variant="primary" size="lg">
                  Shop Now &nbsp; <ArrowRightIcon size={18} />
                </Button>
              </Link>
              <Link href="/become-a-seller">
                <Button variant="outline" size="lg">Become a Seller</Button>
              </Link>
            </div>
            <div className={`${styles.heroStats} animate-fadeIn`} style={{ animationDelay: '0.5s' }}>
              <div className={styles.stat}><strong>10,000+</strong><span>Products</span></div>
              <div className={styles.statDivider} />
              <div className={styles.stat}><strong>500+</strong><span>Vendors</span></div>
              <div className={styles.statDivider} />
              <div className={styles.stat}><strong>47</strong><span>Counties</span></div>
            </div>
          </div>
          <div className={`${styles.heroImage} animate-fadeIn`} style={{ animationDelay: '0.2s' }}>
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=700"
              alt="Nabbis Collections — Shop quality products"
            />
            <div className={styles.floatCard}>
              <span className={styles.floatCardDot} />
              <div>
                <strong>Free Delivery</strong>
                <span>Orders above KES 5,000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MARQUEE STRIP ===== */}
      <div className={styles.marqueeStrip} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {['Free Nairobi Delivery on Orders over KES 5,000', 'Verified Kenyan Vendors', 'Secure M-Pesa Payments', 'Flash Sales Every Friday', 'Nationwide Courier Delivery', 'Become a Seller Today'].concat(
            ['Free Nairobi Delivery on Orders over KES 5,000', 'Verified Kenyan Vendors', 'Secure M-Pesa Payments', 'Flash Sales Every Friday', 'Nationwide Courier Delivery', 'Become a Seller Today']
          ).map((t, i) => (
            <span key={i} className={styles.marqueeItem}>{t}</span>
          ))}
        </div>
      </div>

      {/* ===== CATEGORIES ===== */}
      <section className={styles.section}>
        <div className="container">
          <Reveal>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.sectionLabel}>Browse by Type</p>
                <h2 className={styles.sectionTitle}>Featured Categories</h2>
              </div>
              <Link href="/categories" className={styles.viewAll}>View All <ChevronRightIcon /></Link>
            </div>
          </Reveal>
          <div className={`${styles.categoriesGrid} stagger`}>
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <Reveal key={i} delay={i * 40}>
                  <Link href={`/shop?category=${encodeURIComponent(cat.name)}`} className={styles.categoryCard}>
                    <div className={styles.categoryIconWrap}>
                      <Icon size={38} color="var(--color-purple)" />
                    </div>
                    <span className={styles.categoryName}>{cat.name}</span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== BEST SELLERS ===== */}
      <section className={`${styles.section} ${styles.altSection}`}>
        <div className="container">
          <Reveal>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.sectionLabel}>Trending Now</p>
                <h2 className={styles.sectionTitle}>Best Sellers</h2>
              </div>
              <Link href="/shop?filter=best-sellers" className={styles.viewAll}>View All <ChevronRightIcon /></Link>
            </div>
          </Reveal>
          <div className={styles.productGrid}>
            {displayProducts.map((product, i) => (
              <Reveal key={product.id} delay={i * 50}>
                <div className={styles.productCard}>
                  <div className={styles.productImageWrap}>
                    <img src={product.image} alt={product.name} className={styles.productImage} />
                    {product.badge && (
                      <span className={`${styles.badge} ${styles[`badge${product.badge.replace(' ', '')}`]}`}>{product.badge}</span>
                    )}
                    {product.oldPrice && (
                      <span className={styles.discountBadge}>-{discount(product.price, product.oldPrice)}%</span>
                    )}
                    <div className={styles.productOverlay}>
                      <button className={styles.overlayBtn} aria-label="Quick View">Quick View</button>
                    </div>
                  </div>
                  <div className={styles.productInfo}>
                    <p className={styles.vendorLabel}>{product.vendor}</p>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <div className={styles.priceRow}>
                      <span className={styles.price}>{fmt(product.price)}</span>
                      {product.oldPrice && <span className={styles.oldPrice}>{fmt(product.oldPrice)}</span>}
                    </div>
                    <Button variant="primary" fullWidth size="sm">Add to Cart</Button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROMO BANNER ===== */}
      <section className={styles.promoBanner}>
        <div className="container">
          <Reveal>
            <div className={styles.promoGrid}>
              <div className={styles.promoCard} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=700)' }}>
                <div className={styles.promoOverlay}>
                  <p className={styles.promoLabel}>New Season</p>
                  <h3>Fashion & Clothing</h3>
                  <Link href="/shop?category=Fashion" className={styles.promoLink}>Shop Now <ArrowRightIcon size={16} /></Link>
                </div>
              </div>
              <div className={styles.promoCard} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=700)' }}>
                <div className={styles.promoOverlay}>
                  <p className={styles.promoLabel}>Up to 30% off</p>
                  <h3>Kitchen & Home</h3>
                  <Link href="/shop?category=Kitchen" className={styles.promoLink}>Shop Now <ArrowRightIcon size={16} /></Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== WHY SHOP ===== */}
      <section className={styles.section}>
        <div className="container">
          <Reveal>
            <div className={styles.sectionCenter}>
              <p className={styles.sectionLabel}>Why Choose Us</p>
              <h2 className={styles.sectionTitle}>Why Shop With Nabbis</h2>
            </div>
          </Reveal>
          <div className={styles.featuresGrid}>
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={i} delay={i * 60}>
                  <div className={styles.featureCard}>
                    <div className={styles.featureIconWrap}>
                      <Icon size={44} color="var(--color-purple)" />
                    </div>
                    <h3 className={styles.featureTitle}>{f.title}</h3>
                    <p className={styles.featureDesc}>{f.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== BECOME A SELLER ===== */}
      <section className={styles.sellerSection}>
        <div className="container">
          <Reveal>
            <div className={styles.sellerInner}>
              <div className={styles.sellerContent}>
                <p className={styles.sectionLabel} style={{ color: 'var(--color-lavender)' }}>For Entrepreneurs</p>
                <h2 style={{ color: 'white' }}>Grow Your Business on Nabbis</h2>
                <p>Join 500+ vendors already selling to customers across Kenya. Get access to a powerful dashboard, order management, and analytics — all for an affordable monthly subscription.</p>
                <ul className={styles.sellerPerks}>
                  <li>✓ Easy product upload and management</li>
                  <li>✓ Real-time sales analytics</li>
                  <li>✓ Automatic order notifications</li>
                  <li>✓ M-Pesa payouts directly to your phone</li>
                </ul>
                <Link href="/become-a-seller">
                  <Button variant="secondary" size="lg">Start Selling Today</Button>
                </Link>
              </div>
              <div className={styles.sellerImageWrap}>
                <img src="https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&q=80&w=600" alt="Vendor using Nabbis dashboard" className={styles.sellerImage} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className={styles.section}>
        <div className="container">
          <Reveal>
            <div className={styles.sectionCenter}>
              <p className={styles.sectionLabel}>What Our Customers Say</p>
              <h2 className={styles.sectionTitle}>Customer Testimonials</h2>
            </div>
          </Reveal>
          <div className={styles.testimonialsGrid}>
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className={styles.testimonialCard}>
                  <p className={styles.testimonialText}>"{t.text}"</p>
                  <div className={styles.testimonialAuthor}>
                    <div className={styles.avatar}>{t.avatar}</div>
                    <div>
                      <strong>{t.name}</strong>
                      <span>{t.location}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className={styles.newsletter}>
        <div className="container">
          <Reveal>
            <div className={styles.newsletterInner}>
              <div>
                <h2>Stay in the Loop</h2>
                <p>Get early access to flash sales, new arrivals and exclusive deals delivered to your inbox.</p>
              </div>
              <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Enter your email address" required />
                <Button variant="primary" size="md">Subscribe</Button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
