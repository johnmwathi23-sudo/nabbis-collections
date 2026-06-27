'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/Button';
import { DELIVERY_FEES, FREE_DELIVERY_THRESHOLD } from '../../lib/types';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  const router = useRouter();
  const { currentUser, placeOrder } = useApp();
  const { items, subtotal, totalItems, clearCart } = useCart();

  // Checkout flow states
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Nairobi');
  const [deliveryType, setDeliveryType] = useState<'nairobi' | 'parcel' | 'pickup'>('nairobi');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'airtel' | 'card'>('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState('');

  // Simulation states
  const [showSTKModal, setShowSTKModal] = useState(false);
  const [stkTimer, setStkTimer] = useState(15);
  const [placedOrderDetails, setPlacedOrderDetails] = useState<any>(null);

  // Set default values from currentUser
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.name);
      setPhone(currentUser.phone || '');
      setMpesaPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  // STK Timer Countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showSTKModal && stkTimer > 0) {
      interval = setInterval(() => {
        setStkTimer(prev => prev - 1);
      }, 1000);
    } else if (showSTKModal && stkTimer === 0) {
      setShowSTKModal(false);
      handleCompleteOrderPlacement();
    }
    return () => clearInterval(interval);
  }, [showSTKModal, stkTimer]);

  // If cart is empty and order hasn't been placed yet
  if (items.length === 0 && step !== 3) {
    return (
      <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Your Cart is Empty</h1>
        <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
          Please add products to your cart before proceeding to checkout.
        </p>
        <Link href="/shop">
          <Button variant="primary">Browse Products</Button>
        </Link>
      </div>
    );
  }

  // Calculate delivery fee
  const deliveryFee = () => {
    if (deliveryType === 'pickup') return 0;
    if (deliveryType === 'nairobi' && subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
    return DELIVERY_FEES[deliveryType];
  };

  const finalTotal = subtotal + deliveryFee();

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    }
  };

  const handlePlaceOrderSubmit = () => {
    if (paymentMethod === 'mpesa') {
      setStkTimer(15);
      setShowSTKModal(true);
    } else {
      // Direct placement for other methods (mock loading)
      handleCompleteOrderPlacement();
    }
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
      {/* Step Nodes */}
      <div className={styles.stepsHeader}>
        <div className={`${styles.stepNode} ${step >= 1 ? styles.stepNodeActive : ''}`}>
          <span className={styles.stepNum}>1</span>
          <span>Delivery Details</span>
        </div>
        <div className={`${styles.stepNode} ${step >= 2 ? styles.stepNodeActive : ''}`}>
          <span className={styles.stepNum}>2</span>
          <span>Payment Info</span>
        </div>
        <div className={`${styles.stepNode} ${step === 3 ? styles.stepNodeActive : ''}`}>
          <span className={styles.stepNum}>3</span>
          <span>Order Confirmation</span>
        </div>
      </div>

      {step === 3 && placedOrderDetails ? (
        /* ===== STEP 3: SUCCESS RECEIPT ===== */
        <div className={styles.receiptBox}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.receiptTitle}>Order Placed Successfully!</h1>
          <p className={styles.receiptDesc}>
            Your order has been logged. An STK payment verification was approved.
          </p>

          <div className={styles.receiptSummary}>
            <div className={styles.receiptRow}>
              <span>Order Reference ID:</span>
              <strong>{placedOrderDetails.id}</strong>
            </div>
            <div className={styles.receiptRow}>
              <span>Estimated Delivery:</span>
              <strong>
                {deliveryType === 'nairobi' 
                  ? 'Within 24 Hours (Express)' 
                  : deliveryType === 'parcel' 
                  ? '2 - 3 Days (Courier)' 
                  : 'Ready in 2 Hours (Pickup)'
                }
              </strong>
            </div>
            <div className={styles.receiptRow}>
              <span>Courier Partner:</span>
              <strong>Nabbis Logistics Hub</strong>
            </div>
            <div className={styles.receiptRow}>
              <span>Support Contact:</span>
              <strong>+254 700 000 000</strong>
            </div>

            <div className={styles.receiptTotalRow}>
              <span>Total Reconciled:</span>
              <span>KES {placedOrderDetails.total.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/account" style={{ flex: 1 }}>
              <Button variant="primary" style={{ width: '100%' }}>Track Order</Button>
            </Link>
            <Link href="/shop" style={{ flex: 1 }}>
              <Button variant="outline" style={{ width: '100%' }}>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      ) : (
        /* ===== STEPS 1 & 2: CHECKOUT LAYOUT ===== */
        <div className={styles.checkoutLayout}>
          {/* Left Column: Forms */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {!currentUser ? (
              <div className={styles.panelCard} style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Checkout as Guest or Register</h2>
                <p style={{ color: 'var(--color-gray-600)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  Please login or sign up for a Nabbis Collections account to log this order under your account history.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <Link href="/login">
                    <Button variant="primary" size="sm">Log In First</Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline" size="sm">Sign Up</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {step === 1 ? (
                  /* Step 1 Form */
                  <form onSubmit={handleNextStep} className={styles.panelCard}>
                    <h2 className={styles.panelTitle}>Delivery Details</h2>
                    
                    <div className={styles.formGrid}>
                      <div className={styles.inputGroup}>
                        <label htmlFor="fullName" className={styles.label}>Recipient Name</label>
                        <input
                          id="fullName"
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Jane Doe"
                          className={styles.input}
                        />
                      </div>

                      <div className={styles.inputGroup}>
                        <label htmlFor="phone" className={styles.label}>Recipient Phone Number</label>
                        <input
                          id="phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +254 700 000 000"
                          className={styles.input}
                        />
                      </div>
                    </div>

                    <div className={styles.inputGroup} style={{ marginBottom: '1.5rem' }}>
                      <label htmlFor="address" className={styles.label}>Physical Address / Dropoff Point</label>
                      <input
                        id="address"
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Apartment name, house/office number, street..."
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.inputGroup} style={{ marginBottom: '1.5rem' }}>
                      <label htmlFor="city" className={styles.label}>City / County</label>
                      <select
                        id="city"
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          if (e.target.value === 'Nairobi') {
                            setDeliveryType('nairobi');
                          } else {
                            setDeliveryType('parcel');
                          }
                        }}
                        className={styles.input}
                        style={{ cursor: 'pointer' }}
                      >
                        {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Kiambu', 'Machakos'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <h3 className={styles.label} style={{ marginBottom: '10px' }}>Select Delivery Method</h3>
                    <div className={styles.deliveryOptions}>
                      {city === 'Nairobi' && (
                        <div
                          onClick={() => setDeliveryType('nairobi')}
                          className={`${styles.deliveryCard} ${deliveryType === 'nairobi' ? styles.deliveryCardActive : ''}`}
                        >
                          <span className={styles.deliveryLabel}>Nairobi Express</span>
                          <span className={styles.deliveryPrice}>
                            {subtotal >= FREE_DELIVERY_THRESHOLD ? 'FREE' : 'KES 250'}
                          </span>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-gray-600)', marginTop: '4px' }}>Within 24 Hours</span>
                        </div>
                      )}
                      
                      {city !== 'Nairobi' && (
                        <div
                          onClick={() => setDeliveryType('parcel')}
                          className={`${styles.deliveryCard} ${deliveryType === 'parcel' ? styles.deliveryCardActive : ''}`}
                        >
                          <span className={styles.deliveryLabel}>County Parcel Courier</span>
                          <span className={styles.deliveryPrice}>KES 400</span>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-gray-600)', marginTop: '4px' }}>2 - 3 Working Days</span>
                        </div>
                      )}

                      <div
                        onClick={() => setDeliveryType('pickup')}
                        className={`${styles.deliveryCard} ${deliveryType === 'pickup' ? styles.deliveryCardActive : ''}`}
                      >
                        <span className={styles.deliveryLabel}>Office Collection</span>
                        <span className={styles.deliveryPrice}>FREE</span>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-gray-600)', marginTop: '4px' }}>Nairobi CBD Hub</span>
                      </div>
                    </div>

                    <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '2rem' }}>
                      Proceed to Payment
                    </Button>
                  </form>
                ) : (
                  /* Step 2 Form */
                  <div className={styles.panelCard}>
                    <h2 className={styles.panelTitle}>Payment Details</h2>

                    <div className={styles.paymentMethods}>
                      <div
                        onClick={() => setPaymentMethod('mpesa')}
                        className={`${styles.paymentCard} ${paymentMethod === 'mpesa' ? styles.paymentCardActive : ''}`}
                      >
                        <div className={styles.paymentLogo} style={{ color: '#39b54a' }}>M-PESA</div>
                        <div className={styles.paymentInfo}>
                          <span className={styles.paymentName}>Lipa Na M-Pesa STK Push</span>
                          <span className={styles.paymentDesc}>Receive payment prompt directly on your mobile device instantly.</span>
                        </div>
                      </div>

                      <div
                        onClick={() => setPaymentMethod('airtel')}
                        className={`${styles.paymentCard} ${paymentMethod === 'airtel' ? styles.paymentCardActive : ''}`}
                      >
                        <div className={styles.paymentLogo} style={{ color: '#ff0000' }}>Airtel</div>
                        <div className={styles.paymentInfo}>
                          <span className={styles.paymentName}>Airtel Money Payout</span>
                          <span className={styles.paymentDesc}>Approve Airtel payment verification prompts securely.</span>
                        </div>
                      </div>

                      <div
                        onClick={() => setPaymentMethod('card')}
                        className={`${styles.paymentCard} ${paymentMethod === 'card' ? styles.paymentCardActive : ''}`}
                      >
                        <div className={styles.paymentLogo} style={{ color: 'var(--color-purple)' }}>CARDS</div>
                        <div className={styles.paymentInfo}>
                          <span className={styles.paymentName}>Visa / Mastercard / Amex</span>
                          <span className={styles.paymentDesc}>Secure checkout using debit or credit cards.</span>
                        </div>
                      </div>
                    </div>

                    {paymentMethod === 'mpesa' && (
                      <div className={styles.inputGroup} style={{ marginTop: '1.5rem' }}>
                        <label htmlFor="mpesaPhone" className={styles.label}>Enter M-Pesa Phone Number</label>
                        <input
                          id="mpesaPhone"
                          type="tel"
                          required
                          value={mpesaPhone}
                          onChange={(e) => setMpesaPhone(e.target.value)}
                          placeholder="e.g. 0712345678"
                          className={styles.input}
                        />
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                      <Button variant="outline" onClick={() => setStep(1)} style={{ flex: 1 }}>
                        Back to Delivery
                      </Button>
                      <Button variant="primary" onClick={handlePlaceOrderSubmit} style={{ flex: 1 }}>
                        Place Order (KES {finalTotal.toLocaleString()})
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Column: Summaries */}
          <aside className={styles.summaryBox}>
            <h2 className={styles.summaryTitle}>Cart Summary</h2>
            <div style={{ maxHeight: '160px', overflowY: 'auto', marginBottom: '1rem' }}>
              {items.map((item, idx) => (
                <div key={idx} className={styles.summaryItemRow}>
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                    {item.product.name}
                  </span>
                  <span>KES {(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className={styles.summaryDivider} />

            <div className={styles.summaryRow}>
              <span>Items Total ({totalItems})</span>
              <span>KES {subtotal.toLocaleString()}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Delivery Fee</span>
              <span>{deliveryFee() === 0 ? 'FREE' : `KES ${deliveryFee().toLocaleString()}`}</span>
            </div>

            <div className={styles.summaryTotalRow}>
              <span>Total</span>
              <span>KES {finalTotal.toLocaleString()}</span>
            </div>
          </aside>
        </div>
      )}

      {/* M-Pesa STK Push Prompt simulation Overlay */}
      {showSTKModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.pulseSpinner} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>Lipa Na M-Pesa</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-600)', marginBottom: '1.5rem' }}>
              An M-Pesa payment prompt (STK Push) has been dispatched to <strong>{mpesaPhone}</strong>. Please enter your M-Pesa PIN on your phone to complete payment.
            </p>
            <div className={styles.timer}>{stkTimer}s</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-400)' }}>
              Awaiting automatic confirmation from Safaricom API...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
