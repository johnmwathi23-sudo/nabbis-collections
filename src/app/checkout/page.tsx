'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/Button';
import { DELIVERY_FEES, FREE_DELIVERY_THRESHOLD } from '../../lib/types';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  const { currentUser, placeOrder } = useApp();
  const { items, subtotal, totalItems, clearCart } = useCart();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Nairobi');
  const [deliveryType, setDeliveryType] = useState<'nairobi' | 'parcel' | 'pickup'>('nairobi');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'airtel'>('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState('');

  const [showSTKModal, setShowSTKModal] = useState(false);
  const [stkTimer, setStkTimer] = useState(15);
  const [placedOrderDetails, setPlacedOrderDetails] = useState<any>(null);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.name);
      setPhone(currentUser.phone || '');
      setMpesaPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showSTKModal && stkTimer > 0) {
      interval = setInterval(() => setStkTimer(prev => prev - 1), 1000);
    } else if (showSTKModal && stkTimer === 0) {
      setShowSTKModal(false);
      handleCompleteOrderPlacement();
    }
    return () => clearInterval(interval);
  }, [showSTKModal, stkTimer]);

  if (items.length === 0 && step !== 3) {
    return (
      <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Your Cart is Empty</h1>
        <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
          Please add products to your cart before proceeding to checkout.
        </p>
        <Link href="/shop"><Button variant="primary">Browse Products</Button></Link>
      </div>
    );
  }

  const deliveryFee = () => {
    if (deliveryType === 'pickup') return 0;
    if (deliveryType === 'nairobi' && subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
    return DELIVERY_FEES[deliveryType];
  };
  const finalTotal = subtotal + deliveryFee();

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) setStep(2);
  };

  const handlePlaceOrderSubmit = () => {
    setStkTimer(15);
    setShowSTKModal(true);
  };

  const handleCompleteOrderPlacement = async () => {
    try {
      const order = await placeOrder(items, finalTotal, deliveryType, paymentMethod);
      setPlacedOrderDetails(order);
      clearCart();
      setStep(3);
    } catch (e: any) {
      alert(e.message || 'Failed to place order');
    }
  };

  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.stepsHeader}>
        <div className={`${styles.stepNode} ${step >= 1 ? styles.stepNodeActive : ''}`}>
          <span className={styles.stepNum}>1</span><span>Delivery Details</span>
        </div>
        <div className={`${styles.stepNode} ${step >= 2 ? styles.stepNodeActive : ''}`}>
          <span className={styles.stepNum}>2</span><span>Payment Info</span>
        </div>
        <div className={`${styles.stepNode} ${step === 3 ? styles.stepNodeActive : ''}`}>
          <span className={styles.stepNum}>3</span><span>Confirmation</span>
        </div>
      </div>

      {step === 3 && placedOrderDetails ? (
        <div className={styles.receiptBox}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.receiptTitle}>Order Placed Successfully!</h1>
          <p className={styles.receiptDesc}>Your order has been placed and payment is being processed.</p>
          <div className={styles.receiptSummary}>
            <div className={styles.receiptRow}><span>Order Reference:</span><strong>{placedOrderDetails.id}</strong></div>
            <div className={styles.receiptRow}>
              <span>Estimated Delivery:</span>
              <strong>
                {deliveryType === 'nairobi' ? 'Within 24 Hours' :
                 deliveryType === 'parcel' ? '2 - 3 Days' : 'Ready in 2 Hours'}
              </strong>
            </div>
            <div className={styles.receiptTotalRow}><span>Total:</span><span>KES {placedOrderDetails.total.toLocaleString()}</span></div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/account" style={{ flex: 1 }}><Button variant="primary" style={{ width: '100%' }}>Track Order</Button></Link>
            <Link href="/shop" style={{ flex: 1 }}><Button variant="outline" style={{ width: '100%' }}>Continue Shopping</Button></Link>
          </div>
        </div>
      ) : (
        <div className={styles.checkoutLayout}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {!currentUser ? (
              <div className={styles.panelCard} style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Please Log In</h2>
                <p style={{ color: 'var(--color-gray-600)', marginBottom: '1.5rem' }}>Log in to complete your order.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <Link href="/login"><Button variant="primary" size="sm">Log In</Button></Link>
                  <Link href="/register"><Button variant="outline" size="sm">Sign Up</Button></Link>
                </div>
              </div>
            ) : (
              <>
                {step === 1 ? (
                  <form onSubmit={handleNextStep} className={styles.panelCard}>
                    <h2 className={styles.panelTitle}>Delivery Details</h2>
                    <div className={styles.formGrid}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Recipient Name</label>
                        <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className={styles.input} />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Phone Number</label>
                        <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className={styles.input} />
                      </div>
                    </div>
                    <div className={styles.inputGroup} style={{ marginBottom: '1.5rem' }}>
                      <label className={styles.label}>Address</label>
                      <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} className={styles.input} />
                    </div>
                    <div className={styles.inputGroup} style={{ marginBottom: '1.5rem' }}>
                      <label className={styles.label}>City</label>
                      <select value={city} onChange={(e) => { setCity(e.target.value); setDeliveryType(e.target.value === 'Nairobi' ? 'nairobi' : 'parcel'); }} className={styles.input}>
                        {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Kiambu', 'Machakos'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <h3 className={styles.label} style={{ marginBottom: '10px' }}>Delivery Method</h3>
                    <div className={styles.deliveryOptions}>
                      {city === 'Nairobi' && (
                        <div onClick={() => setDeliveryType('nairobi')} className={`${styles.deliveryCard} ${deliveryType === 'nairobi' ? styles.deliveryCardActive : ''}`}>
                          <span className={styles.deliveryLabel}>Nairobi Express</span>
                          <span className={styles.deliveryPrice}>{subtotal >= FREE_DELIVERY_THRESHOLD ? 'FREE' : 'KES 250'}</span>
                        </div>
                      )}
                      {city !== 'Nairobi' && (
                        <div onClick={() => setDeliveryType('parcel')} className={`${styles.deliveryCard} ${deliveryType === 'parcel' ? styles.deliveryCardActive : ''}`}>
                          <span className={styles.deliveryLabel}>Courier</span>
                          <span className={styles.deliveryPrice}>KES 400</span>
                        </div>
                      )}
                      <div onClick={() => setDeliveryType('pickup')} className={`${styles.deliveryCard} ${deliveryType === 'pickup' ? styles.deliveryCardActive : ''}`}>
                        <span className={styles.deliveryLabel}>Pickup</span>
                        <span className={styles.deliveryPrice}>FREE</span>
                      </div>
                    </div>
                    <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '2rem' }}>Proceed to Payment</Button>
                  </form>
                ) : step === 2 ? (
                  <div className={styles.panelCard}>
                    <h2 className={styles.panelTitle}>Payment Details</h2>
                    <div className={styles.paymentMethods}>
                      <div onClick={() => setPaymentMethod('mpesa')} className={`${styles.paymentCard} ${paymentMethod === 'mpesa' ? styles.paymentCardActive : ''}`}>
                        <div className={styles.paymentLogo} style={{ color: '#39b54a' }}>M-PESA</div>
                        <div className={styles.paymentInfo}>
                          <span className={styles.paymentName}>Lipa Na M-Pesa</span>
                          <span className={styles.paymentDesc}>STK Push to your phone</span>
                        </div>
                    </div>
                    </div>
                    {paymentMethod === 'mpesa' && (
                      <div className={styles.inputGroup} style={{ marginTop: '1.5rem' }}>
                        <label className={styles.label}>M-Pesa Phone</label>
                        <input type="tel" required value={mpesaPhone} onChange={(e) => setMpesaPhone(e.target.value)} className={styles.input} />
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                      <Button variant="outline" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</Button>
                      <Button variant="primary" onClick={handlePlaceOrderSubmit} style={{ flex: 1 }}>
                        Place Order (KES {finalTotal.toLocaleString()})
                      </Button>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
          <aside className={styles.summaryBox}>
            <h2 className={styles.summaryTitle}>Cart Summary</h2>
            <div style={{ maxHeight: '160px', overflowY: 'auto', marginBottom: '1rem' }}>
              {items.map((item, idx) => (
                <div key={idx} className={styles.summaryItemRow}>
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '240px' }}>{item.product.name}</span>
                  <span>KES {(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryRow}><span>Items ({totalItems})</span><span>KES {subtotal.toLocaleString()}</span></div>
            <div className={styles.summaryRow}><span>Delivery</span><span>{deliveryFee() === 0 ? 'FREE' : `KES ${deliveryFee()}`}</span></div>
            <div className={styles.summaryTotalRow}><span>Total</span><span>KES {finalTotal.toLocaleString()}</span></div>
          </aside>
        </div>
      )}
      {showSTKModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.pulseSpinner} />
            <h3>Lipa Na M-Pesa</h3>
            <p>Payment prompt sent to <strong>{mpesaPhone}</strong></p>
            <div className={styles.timer}>{stkTimer}s</div>
            <p>Awaiting confirmation...</p>
          </div>
        </div>
      )}
    </div>
  );
}