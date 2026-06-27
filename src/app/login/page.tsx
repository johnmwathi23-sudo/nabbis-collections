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
  const [password, setPassword] = useState('');
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
      const user = await loginUser(email, password);
      if (user.role === 'admin' || user.role === 'super_admin') window.location.href = '/admin/dashboard';
      else if (user.role === 'vendor') window.location.href = '/vendor/dashboard';
      else window.location.href = '/account';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to login');
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
              placeholder="e.g. tessndunge@gmail.com"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={styles.input}
            />
          </div>

          <Button type="submit" variant="primary" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <div style={{ marginTop: '1.5rem', background: '#f5f3ff', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid #ddd6fe' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '8px', color: '#5b21b6' }}>🔐 Admin Access</p>
          <p style={{ marginBottom: '8px', lineHeight: '1.5' }}>
            Enter <code style={{ background: '#ede9fe', padding: '2px 6px', borderRadius: '4px' }}>tessndunge@gmail.com</code> with password <code style={{ background: '#ede9fe', padding: '2px 6px', borderRadius: '4px' }}>+254758516135</code> to access the CMS dashboard.
          </p>
          <button
            type="button"
            onClick={async () => {
              setEmail('tessndunge@gmail.com');
              setPassword('+254758516135');
              setLoading(true);
              try {
                const user = await loginUser('tessndunge@gmail.com', '+254758516135');
                window.location.href = '/admin/dashboard';
              } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Failed to login');
                setLoading(false);
              }
            }}
            style={{
              background: '#5b21b6', color: 'white', border: 'none', padding: '6px 16px',
              borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
            }}
          >
            Quick Admin Login →
          </button>
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
