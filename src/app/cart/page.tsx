'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/Button';
import { TrashIcon } from '../../components/Icons';
import styles from './cart.module.css';

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, totalItems } = useCart();
  const [promoCode, setPromoCode] = useState('');
  
  useEffect(() => {
    document.title = 'My Cart | Nabbis Collections';
  }, []);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    const code = promoCode.trim().toUpperCase();
    if (code === 'NABBIS10' || code === 'WELCOME') {
      setDiscountPercent(10);
      setPromoSuccess('Promo code applied successfully! 10% discount has been applied.');
    } else if (code === 'FREE250') {
      setDiscountPercent(5); // 5% discount
      setPromoSuccess('Promo code applied! 5% discount applied.');
    } else {
      setPromoError('Invalid promo code. Try NABBIS10 or WELCOME.');
    }
  };

  const discountAmount = (subtotal * discountPercent) / 100;
  const finalSubtotal = subtotal - discountAmount;
  const deliveryEstimation = subtotal >= 5000 ? 0 : 250; // Simple estimate
  const finalTotal = finalSubtotal + deliveryEstimation;

  if (items.length === 0) {
    return (
      <div className={`container ${styles.container}`}>
        <div className={styles.emptyCart}>
          <h1 className={styles.emptyTitle}>Your Cart is Empty</h1>
          <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
            Looks like you haven&apos;t added anything to your cart yet. Discover quality products today!
          </p>
          <Link href="/shop">
            <Button variant="primary">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.container}`}>
      <h1 className={styles.title}>Shopping Cart ({totalItems} items)</h1>

      <div className={styles.cartLayout}>
        {/* Left Column: Items */}
        <div className={styles.itemList}>
          {items.map((item) => (
            <div key={item.product.id} className={styles.cartItem}>
              <img
                src={item.product.image}
                alt={item.product.name}
                className={styles.itemImage}
              />
              <div className={styles.itemInfo}>
                <Link href={`/shop/${item.product.slug}`} className={styles.itemName}>
                  {item.product.name}
                </Link>
                <span className={styles.itemVendor}>Sold by: {item.product.vendor}</span>
                <span className={styles.itemPrice}>KES {item.product.price.toLocaleString()}</span>
              </div>

              {/* Quantity Controls */}
              <div className={styles.qtyControls}>
                <button
                  onClick={() => updateQty(item.product.id, item.quantity - 1)}
                  className={styles.qtyBtn}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="text"
                  value={item.quantity}
                  readOnly
                  className={styles.qtyInput}
                  aria-label="Quantity"
                />
                <button
                  onClick={() => updateQty(item.product.id, item.quantity + 1)}
                  className={styles.qtyBtn}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeItem(item.product.id)}
                className={styles.removeBtn}
                aria-label="Remove item"
              >
                <TrashIcon size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary */}
        <div className={styles.summaryPanel}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>KES {subtotal.toLocaleString()}</span>
          </div>

          {discountPercent > 0 && (
            <div className={styles.summaryRow} style={{ color: 'var(--color-success)' }}>
              <span>Promo Discount ({discountPercent}%)</span>
              <span>- KES {discountAmount.toLocaleString()}</span>
            </div>
          )}

          <div className={styles.summaryRow}>
            <span>Est. Delivery (Nairobi)</span>
            <span>{deliveryEstimation === 0 ? 'FREE' : `KES ${deliveryEstimation.toLocaleString()}`}</span>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-600)', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>
            * Accurate shipping fee calculated at checkout based on county location. Free Nairobi delivery for orders KES 5,000+.
          </p>

          <form onSubmit={handleApplyPromo} className={styles.promoBlock}>
            <label htmlFor="promo-input" style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Have a Promo Code?
            </label>
            <div className={styles.promoInputGroup}>
              <input
                id="promo-input"
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="e.g. NABBIS10"
                className={styles.promoInput}
              />
              <Button type="submit" variant="outline" size="sm">Apply</Button>
            </div>
            {promoError && <p style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '6px' }}>{promoError}</p>}
            {promoSuccess && <p style={{ color: 'var(--color-success)', fontSize: '0.8rem', marginTop: '6px' }}>{promoSuccess}</p>}
          </form>

          <div className={styles.summaryTotalRow}>
            <span>Total</span>
            <span>KES {finalTotal.toLocaleString()}</span>
          </div>

          <Link href="/checkout" style={{ display: 'block', marginTop: '1.5rem' }}>
            <Button variant="primary" className={styles.checkoutBtn}>
              Proceed to Checkout
            </Button>
          </Link>

          <Link href="/shop" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: 'var(--color-purple)' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
