'use client';
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Button } from '../../components/Button';
import { HeartIcon, SearchIcon } from '../../components/Icons';
import { CATEGORIES } from '../../lib/data';
import { Product } from '../../lib/types';
import styles from './shop.module.css';

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products } = useApp();
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  // State filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Read search parameters on load
  useEffect(() => {
    document.title = 'Shop | Nabbis Collections';
    
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory('All');
    }

    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
    } else {
      setSearchQuery('');
    }
  }, [searchParams]);

  // Filtering products
  const filteredProducts = useMemo(() => {
    return products.filter((p: Product) => {
      // Category Filter
      if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        // Fallback checks (matching parts like "Fashion" with "Fashion & Clothing")
        const term1 = selectedCategory.toLowerCase();
        const term2 = p.category.toLowerCase();
        if (!term2.includes(term1) && !term1.includes(term2)) {
          return false;
        }
      }

      // Search Query Filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesCat = p.category.toLowerCase().includes(query);
        const matchesVendor = p.vendor.toLowerCase().includes(query);
        const matchesTags = p.tags?.some(t => t.toLowerCase().includes(query)) || false;
        if (!matchesName && !matchesDesc && !matchesCat && !matchesVendor && !matchesTags) {
          return false;
        }
      }

      // Price Filters
      if (minPrice !== '' && p.price < parseFloat(minPrice)) return false;
      if (maxPrice !== '' && p.price > parseFloat(maxPrice)) return false;

      // Rating Filter
      if (minRating > 0 && p.rating < minRating) return false;

      return true;
    });
  }, [products, selectedCategory, searchQuery, minPrice, maxPrice, minRating]);

  // Sorting products
  const sortedProducts = useMemo(() => {
    const items = [...filteredProducts];
    if (sortBy === 'price-low') {
      return items.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-high') {
      return items.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'rating') {
      return items.sort((a, b) => b.rating - a.rating);
    }
    // 'newest' / default: higher IDs first
    return items.sort((a, b) => b.id - a.id);
  }, [filteredProducts, sortBy]);

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
    setSearchQuery('');
    setSortBy('newest');
    router.push('/shop');
  };

  const getDiscountPct = (price: number, old?: number | null) => {
    if (!old) return 0;
    return Math.round(((old - price) / old) * 100);
  };

  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.topBar}>
        <div className={styles.resultsCount}>
          Showing <strong>{sortedProducts.length}</strong> products
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--color-gray-600)' }}>Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
            aria-label="Sort products"
          >
            <option value="newest">Newest Arrival</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className={styles.shopLayout}>
        {/* Sidebar Filters */}
        <aside className={styles.sidebar}>
          <div className={styles.filterSection}>
            <h2 className={styles.filterTitle}>Search</h2>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Keywords..."
                style={{
                  width: '100%',
                  padding: '10px 32px 10px 12px',
                  borderRadius: 'var(--border-radius-sm)',
                  border: '1px solid var(--color-gray-400)',
                  outline: 'none',
                  fontSize: '0.85rem'
                }}
              />
              <span style={{ position: 'absolute', right: '10px', top: '12px', display: 'flex', alignItems: 'center' }}>
                <SearchIcon
                  size={16}
                  color="var(--color-gray-600)"
                />
              </span>
            </div>
          </div>

          <div className={styles.filterSection}>
            <h2 className={styles.filterTitle}>Categories</h2>
            <div className={styles.catList}>
              <button
                onClick={() => setSelectedCategory('All')}
                className={`${styles.catBtn} ${selectedCategory === 'All' ? styles.catBtnActive : ''}`}
              >
                All Categories
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`${styles.catBtn} ${selectedCategory.toLowerCase() === cat.name.toLowerCase() ? styles.catBtnActive : ''}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <h2 className={styles.filterTitle}>Price (KES)</h2>
            <div className={styles.priceInputs}>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                className={styles.priceInput}
                aria-label="Minimum price"
              />
              <span>-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                className={styles.priceInput}
                aria-label="Maximum price"
              />
            </div>
          </div>

          <div className={styles.filterSection}>
            <h2 className={styles.filterTitle}>Customer Rating</h2>
            <div className={styles.ratingList}>
              {[4, 3, 2].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setMinRating(stars)}
                  className={`${styles.ratingBtn} ${minRating === stars ? styles.ratingBtnActive : ''}`}
                >
                  <span>{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
                  <span>&amp; Up</span>
                </button>
              ))}
              <button
                onClick={() => setMinRating(0)}
                className={`${styles.ratingBtn} ${minRating === 0 ? styles.ratingBtnActive : ''}`}
              >
                All Ratings
              </button>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={handleClearFilters} style={{ width: '100%', marginTop: '1rem' }}>
            Clear All Filters
          </Button>
        </aside>

        {/* Products Grid Area */}
        <div className={styles.productsArea}>
          {sortedProducts.length === 0 ? (
            <div className={styles.noProducts}>
              <h2 className={styles.noProductsTitle}>No Products Found</h2>
              <p style={{ color: 'var(--color-gray-600)', marginBottom: '1.5rem' }}>
                We couldn&apos;t find any products matching your current filters. Try resetting them!
              </p>
              <Button onClick={handleClearFilters}>Reset Filters</Button>
            </div>
          ) : (
            <div className={styles.grid}>
              {sortedProducts.map((p) => {
                const discount = getDiscountPct(p.price, p.oldPrice);
                const wish = isWishlisted(p.id);

                return (
                  <div key={p.id} className={styles.card}>
                    {/* Badge */}
                    {p.badge && (
                      <span className={`${styles.badge} ${p.badge === 'Sale' ? styles.badgeSale : p.badge === 'New' ? styles.badgeNew : ''}`}>
                        {p.badge}
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggle(p)}
                      className={`${styles.wishlistBtn} ${wish ? styles.wishlisted : ''}`}
                      aria-label="Add to Wishlist"
                    >
                      <HeartIcon size={20} fill={wish ? 'currentColor' : 'none'} />
                    </button>

                    {/* Product Image */}
                    <Link href={`/shop/${p.slug}`} className={styles.imageWrapper}>
                      <img
                        src={p.image}
                        alt={p.name}
                        className={styles.image}
                        loading="lazy"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className={styles.cardContent}>
                      <span className={styles.vendor}>{p.vendor}</span>
                      <Link href={`/shop/${p.slug}`}>
                        <h3 className={styles.name}>{p.name}</h3>
                      </Link>

                      <div className={styles.rating}>
                        <span className={styles.starFilled}>{'★'.repeat(Math.round(p.rating))}</span>
                        <span style={{ color: 'var(--color-gray-400)' }}>{'★'.repeat(5 - Math.round(p.rating))}</span>
                        <span>({p.reviews})</span>
                      </div>

                      <div className={styles.priceRow}>
                        <span className={styles.price}>KES {p.price.toLocaleString()}</span>
                        {p.oldPrice && (
                          <>
                            <span className={styles.oldPrice}>KES {p.oldPrice.toLocaleString()}</span>
                            <span className={styles.discount}>-{discount}%</span>
                          </>
                        )}
                      </div>

                      <div className={styles.actionRow}>
                        {p.stock === 0 ? (
                          <div className={styles.stockStatus}>Out of Stock</div>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            className={styles.cardBtn}
                            onClick={() => addItem(p)}
                          >
                            Add To Cart
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading shop catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
