'use client';
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useApp } from '../../../context/AppContext';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { Button } from '../../../components/Button';
import { HeartIcon, ChevronRightIcon } from '../../../components/Icons';
import styles from './details.module.css';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: Props) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  
  const { products, vendors } = useApp();
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  // Find product by slug
  const product = products.find(p => p.slug === slug);

  // States
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs'>('desc');

  // Set initial image when product loads
  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Product Not Found</h1>
        <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
          The product you are looking for does not exist or has been removed.
        </p>
        <Link href="/shop">
          <Button variant="primary">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  // Get vendor profile info
  const vendorInfo = vendors.find(v => v.id === product.vendorId);

  // Fallback to array with just main image if images is undefined
  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];

  const getDiscountPct = (price: number, old?: number | null) => {
    if (!old) return 0;
    return Math.round(((old - price) / old) * 100);
  };

  const handleQtyChange = (val: number) => {
    const newVal = quantity + val;
    if (newVal >= 1 && newVal <= product.stock) {
      setQuantity(newVal);
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const isWish = isWishlisted(product.id);

  return (
    <div className={`container ${styles.container}`}>
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/" className={styles.breadcrumbLink}>Home</Link>
        <ChevronRightIcon size={12} />
        <Link href="/shop" className={styles.breadcrumbLink}>Shop</Link>
        <ChevronRightIcon size={12} />
        <span style={{ color: 'var(--color-black)', fontWeight: 500 }}>{product.name}</span>
      </nav>

      {/* Main Details Section */}
      <div className={styles.detailsLayout}>
        {/* Left Column: Gallery */}
        <div className={styles.gallery}>
          <div className={styles.mainImageWrapper}>
            <img
              src={activeImage}
              alt={product.name}
              className={styles.mainImage}
            />
          </div>
          
          {productImages.length > 1 && (
            <div className={styles.thumbnails}>
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`${styles.thumbnail} ${activeImage === img ? styles.thumbnailActive : ''}`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info */}
        <div className={styles.infoPanel}>
          <span className={styles.vendorTag}>{product.vendor}</span>
          <h1 className={styles.title}>{product.name}</h1>
          
          <div className={styles.ratingRow}>
            <div style={{ display: 'flex', gap: '2px' }}>
              <span className={styles.starFilled}>{'★'.repeat(Math.round(product.rating))}</span>
              <span style={{ color: 'var(--color-gray-400)' }}>{'★'.repeat(5 - Math.round(product.rating))}</span>
            </div>
            <span>{product.rating.toFixed(1)} / 5.0 ({product.reviews} reviews)</span>
          </div>

          <div className={styles.divider} />

          <div className={styles.priceBlock}>
            <span className={styles.price}>KES {product.price.toLocaleString()}</span>
            {product.oldPrice && (
              <>
                <span className={styles.oldPrice}>KES {product.oldPrice.toLocaleString()}</span>
                <span className={styles.discount}>-{getDiscountPct(product.price, product.oldPrice)}% Off</span>
              </>
            )}
          </div>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.metaGrid}>
            <span className={styles.metaLabel}>Availability:</span>
            <span className={product.stock > 0 ? styles.stockIn : styles.stockOut}>
              {product.stock > 0 ? `In Stock (${product.stock} items left)` : 'Out of Stock'}
            </span>

            <span className={styles.metaLabel}>Category:</span>
            <span className={styles.metaValue}>{product.category}</span>

            <span className={styles.metaLabel}>Fulfillment:</span>
            <span className={styles.metaValue}>Shipped by {product.vendor}</span>
          </div>

          <div className={styles.divider} />

          {/* Action Row */}
          {product.stock > 0 && (
            <div className={styles.actionsRow}>
              <div className={styles.qtySelector}>
                <button onClick={() => handleQtyChange(-1)} className={styles.qtyBtn} aria-label="Decrease quantity">−</button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className={styles.qtyInput}
                  aria-label="Quantity"
                />
                <button onClick={() => handleQtyChange(1)} className={styles.qtyBtn} aria-label="Increase quantity">+</button>
              </div>

              <Button
                variant="primary"
                className={styles.cartBtn}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>

              <button
                onClick={() => toggle(product)}
                className={`${styles.wishBtn} ${isWish ? styles.wishBtnActive : ''}`}
                aria-label="Toggle Wishlist"
              >
                <HeartIcon size={24} fill={isWish ? 'currentColor' : 'none'} />
              </button>
            </div>
          )}

          {/* Vendor Details Box */}
          {vendorInfo && (
            <div className={styles.vendorCard}>
              <div className={styles.vendorLogo}>{vendorInfo.logo}</div>
              <div>
                <h3 className={styles.vendorName}>Sold by: {vendorInfo.name}</h3>
                <div className={styles.vendorMeta}>
                  <span>📍 {vendorInfo.location}</span>
                  <span>★ {vendorInfo.rating} Rating</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description Tabs */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabHeaders}>
          <button
            onClick={() => setActiveTab('desc')}
            className={`${styles.tabHeader} ${activeTab === 'desc' ? styles.tabHeaderActive : ''}`}
          >
            Product Description
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`${styles.tabHeader} ${activeTab === 'specs' ? styles.tabHeaderActive : ''}`}
          >
            Specifications
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'desc' ? (
            <div>
              <p style={{ marginBottom: '1rem' }}>{product.description}</p>
              <p>
                All products from <strong>{product.vendor}</strong> are verified for quality before delivery. Nabbis Collections guarantees returns within 7 days if the product does not match description.
              </p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
                  <td style={{ padding: '12px 0', fontWeight: 600, color: 'var(--color-gray-600)', width: '200px' }}>Item Name</td>
                  <td style={{ padding: '12px 0', color: 'var(--color-black)' }}>{product.name}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
                  <td style={{ padding: '12px 0', fontWeight: 600, color: 'var(--color-gray-600)' }}>Category</td>
                  <td style={{ padding: '12px 0', color: 'var(--color-black)' }}>{product.category}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
                  <td style={{ padding: '12px 0', fontWeight: 600, color: 'var(--color-gray-600)' }}>Vendor</td>
                  <td style={{ padding: '12px 0', color: 'var(--color-black)' }}>{product.vendor}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
                  <td style={{ padding: '12px 0', fontWeight: 600, color: 'var(--color-gray-600)' }}>Tags</td>
                  <td style={{ padding: '12px 0', color: 'var(--color-black)' }}>{product.tags?.join(', ') || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
