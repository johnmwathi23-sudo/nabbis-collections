'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import styles from '../login/auth.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const { currentUser, registerUser } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'customer' | 'vendor'>('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (currentUser.role === 'vendor') {
        // If vendor user, check if they already have a vendor profile setup or need to complete it
        router.push('/become-a-seller');
      } else {
        router.push('/account');
      }
    }
  }, [currentUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser(name, email, phone, role);
      // Redirection is handled by the useEffect above
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapperBg} aria-hidden="true" />

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join Nabbis Collections today to start shopping or start selling.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorBox}>{error}</div>}

          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>Full Name / Business Owner</label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. jane@example.com"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="phone" className={styles.label}>Phone Number</label>
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

          <div className={styles.inputGroup}>
            <label htmlFor="role" className={styles.label}>Register As</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'customer' | 'vendor')}
              className={styles.select}
            >
              <option value="customer">Customer (Buy Products)</option>
              <option value="vendor">Vendor / Seller (Sell Products)</option>
            </select>
          </div>

          <Button type="submit" variant="primary" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        <div className={styles.footer}>
          Already have an account?{' '}
          <Link href="/login" className={styles.footerLink}>
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
