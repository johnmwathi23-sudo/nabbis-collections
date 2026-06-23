'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import styles from './auth.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, loginUser } = useApp();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Log In | Nabbis Collections';
  }, []);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (currentUser.role === 'vendor') {
        router.push('/vendor/dashboard');
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
      await loginUser(email);
      // Redirection is handled by the useEffect above
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapperBg} aria-hidden="true" />
      
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Log in to manage your orders, shop, or access your seller panel.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorBox}>{error}</div>}

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. customer@nabbis.com or admin@nabbis.com"
              className={styles.input}
            />
          </div>

          <Button type="submit" variant="primary" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <div style={{ marginTop: '1.5rem', background: '#edf2f7', padding: '12px', borderRadius: '8px', fontSize: '0.8rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>💡 Quick Test Accounts (Demo):</p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '16px' }}>
            <li>Customer: <code>customer@nabbis.com</code></li>
            <li>Vendor: <code>seller@nabbis.com</code></li>
            <li>Admin: <code>admin@nabbis.com</code></li>
          </ul>
        </div>

        <div className={styles.footer}>
          Don&apos;t have an account?{' '}
          <Link href="/register" className={styles.footerLink}>
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}
