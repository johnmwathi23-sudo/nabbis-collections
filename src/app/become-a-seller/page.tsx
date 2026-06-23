'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import styles from './become.module.css';

export default function BecomeSellerPage() {
  const router = useRouter();
  const { currentUser, vendors, becomeSeller } = useApp();

  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Nairobi');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Find vendor profile if logged in
  const vendorProfile = currentUser ? vendors.find(v => v.id === currentUser.id) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await becomeSeller(businessName, description, location);
      // Wait for local state update
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Onboarding failed');
      setLoading(false);
    }
  };

  // If vendor status is active, direct to dashboard
  if (vendorProfile && vendorProfile.status === 'active') {
    return (
      <div className="container" style={{ padding: '8rem 2rem' }}>
        <div className={styles.statusBox}>
          <div className={styles.statusIcon}>🎉</div>
          <h1 className={styles.statusTitle}>You are a Seller!</h1>
          <p className={styles.statusDesc}>
            Your vendor account for <strong>{vendorProfile.name}</strong> is active. You can now list products and manage orders on your vendor dashboard.
          </p>
          <Link href="/vendor/dashboard">
            <Button variant="primary">Go to Vendor Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  // If vendor status is pending
  if (vendorProfile && vendorProfile.status === 'pending') {
    return (
      <div className="container" style={{ padding: '8rem 2rem' }}>
        <div className={styles.statusBox}>
          <div className={styles.statusIcon}>⏳</div>
          <h1 className={styles.statusTitle}>Application Under Review</h1>
          <p className={styles.statusDesc}>
            Thank you for applying to sell on Nabbis Collections! Your business profile for <strong>{vendorProfile.name}</strong> is currently pending administrator review.
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-600)', marginBottom: '1.5rem' }}>
            💡 You can log in as <code>admin@nabbis.com</code> in another tab to approve your application immediately!
          </p>
          <Link href="/account">
            <Button variant="outline">Back to Profile</Button>
          </Link>
        </div>
      </div>
    );
  }

  // If vendor status is suspended
  if (vendorProfile && vendorProfile.status === 'suspended') {
    return (
      <div className="container" style={{ padding: '8rem 2rem' }}>
        <div className={styles.statusBox}>
          <div className={styles.statusIcon}>⚠️</div>
          <h1 className={styles.statusTitle}>Account Suspended</h1>
          <p className={styles.statusDesc}>
            Your vendor profile for <strong>{vendorProfile.name}</strong> has been suspended. Please contact platform support at support@nabbis.com for clarification.
          </p>
          <Link href="/contact">
            <Button variant="primary">Contact Support</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Sell on Nabbis Collections</h1>
        <p className={styles.subtitle}>
          Reach thousands of shoppers across Kenya. Leverage our payment network and courier hubs to grow your retail business.
        </p>
      </div>

      <div className={styles.grid}>
        {/* Left: Pitch */}
        <div className={styles.benefitsCard}>
          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>🇰🇪</div>
            <div>
              <h3 className={styles.benefitTitle}>Countrywide Courier Network</h3>
              <p className={styles.benefitDesc}>
                Drop off your packages at our Nairobi hub. We coordinate delivery to Mombasa, Kisumu, Eldoret, and all 47 counties via trusted courier agents.
              </p>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>💳</div>
            <div>
              <h3 className={styles.benefitTitle}>M-Pesa STK & Card Payouts</h3>
              <p className={styles.benefitDesc}>
                Customers pay instantly via M-Pesa. Payouts are reconciled daily and wired to your registered Safaricom Till/Paybill number or bank account.
              </p>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>📈</div>
            <div>
              <h3 className={styles.benefitTitle}>Low Platform Fees</h3>
              <p className={styles.benefitDesc}>
                We only charge a flat 5% commission on successful sales. No listing fees, no subscription fees. You only pay when you make money!
              </p>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>🛠️</div>
            <div>
              <h3 className={styles.benefitTitle}>Advanced Seller Dashboards</h3>
              <p className={styles.benefitDesc}>
                Monitor sales graphs, manage inventory levels, print shipping receipts, and track order fulfillment statuses through a customized vendor portal.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Registration Form */}
        <div className={styles.formCard}>
          {!currentUser ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <h2 className={styles.formTitle}>Register to Continue</h2>
              <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                You need a Nabbis Collections account to register as a seller. Sign up or log in to get started.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link href="/register?role=vendor">
                  <Button variant="primary" style={{ width: '100%' }}>Create Seller Account</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" style={{ width: '100%' }}>I already have an account</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <h2 className={styles.formTitle}>Business Profile</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div className={styles.errorBox}>{error}</div>}

                <div className={styles.inputGroup}>
                  <label htmlFor="businessName" className={styles.label}>Business / Brand Name</label>
                  <input
                    id="businessName"
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Nairobi Footwear Shop"
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="description" className={styles.label}>Shop Description</label>
                  <textarea
                    id="description"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what products you sell and your store policy..."
                    className={styles.textarea}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="location" className={styles.label}>Store Location (County)</label>
                  <select
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={styles.input}
                    style={{ cursor: 'pointer' }}
                  >
                    {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Kiambu', 'Machakos', 'Meru'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <Button type="submit" variant="primary" className={styles.submitBtn} disabled={loading}>
                  {loading ? 'Submitting Application...' : 'Apply to Sell'}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
