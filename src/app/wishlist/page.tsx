'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/Button';
import { TrashIcon } from '../../components/Icons';
import styles from './wishlist.module.css';

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  
  useEffect(() => {
    document.title = 'Saved Items | Nabbis Collections';
  }, []);
  const { addItem } = useCart();

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
    removeItem(product.id); // Option to remove after adding to cart
  };

  if (items.length === 0) {
    return (
      <div className={`container ${styles.container}`}>
        <div className={styles.emptyWish}>
          <h1 className={styles.emptyTitle}>Your Wishlist is Empty</h1>
          <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
            Save items that you like to buy them later. Start exploring our collections!
          </p>
          <Link href="/shop">
            <Button variant="primary">Explore Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.container}`}>
      <h1 className={styles.title}>My Saved Items</h1>

      <div className={styles.grid}>
        {items.map((p) => (
          <div key={p.id} className={styles.card}>
            {/* Remove Button */}
            <button
              onClick={() => removeItem(p.id)}
              className={styles.removeBtn}
              aria-label="Remove item"
            >
              <TrashIcon size={18} />
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

              <div className={styles.priceRow}>
                <span className={styles.price}>KES {p.price.toLocaleString()}</span>
              </div>

              <div className={styles.actionRow}>
                {p.stock === 0 ? (
                  <span style={{ color: 'var(--color-error)', fontWeight: 700, fontSize: '0.85rem' }}>Out of Stock</span>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    className={styles.cardBtn}
                    onClick={() => handleAddToCart(p)}
                  >
                    Add To Cart
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
