'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import styles from './admin.module.css';

type QuickLink = { href: string; label: string; desc: string; color: string; countKey: 'vendors' | 'products' | 'orders' | 'users' | null };

const quickLinks: QuickLink[] = [
  { href: '/admin/vendors', label: 'Vendors', desc: 'Approve, suspend, and manage vendors', color: '#f59e0b', countKey: 'vendors' },
  { href: '/admin/products', label: 'Products', desc: 'Manage product catalog', color: '#10b981', countKey: 'products' },
  { href: '/admin/orders', label: 'Orders', desc: 'View and update order statuses', color: '#ec4899', countKey: 'orders' },
  { href: '/admin/users', label: 'Users', desc: 'Manage platform users and roles', color: '#6366f1', countKey: 'users' },
  { href: '/admin/hero-slides', label: 'Hero Slides', desc: 'Manage homepage carousel slides', color: '#8b5cf6', countKey: null },
  { href: '/admin/settings', label: 'Site Settings', desc: 'Configure site name, logo, social links', color: '#06b6d4', countKey: null },
  { href: '/admin/site-images', label: 'Site Images', desc: 'Upload and organize site images', color: '#84cc16', countKey: null },
  { href: '/admin/audit-log', label: 'Audit Log', desc: 'Review admin activity history', color: '#64748b', countKey: null },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { currentUser, vendors, products, users, orders } = useApp();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    if (currentUser.role !== 'admin' && currentUser.role !== 'super_admin') {
      router.push('/account');
    }
  }, [currentUser, router]);

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
    return <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>Verifying admin authorization...</div>;
  }

  const totalGMV = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const totalCommissions = totalGMV * 0.05;
  const pendingVendors = vendors.filter(v => v.status === 'pending').length;

  const getCount = (key: QuickLink['countKey']) => {
    switch (key) {
      case 'users': return users.length;
      case 'vendors': return vendors.length;
      case 'products': return products.length;
      case 'orders': return orders.length;
      default: return null;
    }
  };

  return (
    <div>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p style={{ color: 'var(--color-gray-600)' }}>
          Platform overview and quick access to all management tools
        </p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Platform GMV</span>
          <span className={styles.statVal}>KES {totalGMV.toLocaleString()}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Platform Revenue (5%)</span>
          <span className={styles.statVal}>KES {totalCommissions.toLocaleString()}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Users</span>
          <span className={styles.statVal}>{users.length}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Pending Vendors</span>
          <span className={styles.statVal} style={pendingVendors > 0 ? { color: 'var(--color-warning)' } : {}}>{pendingVendors}</span>
        </div>
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--color-black)' }}>Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {quickLinks.map((link) => (
          <div
            key={link.label}
            onClick={() => router.push(link.href)}
            style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid var(--color-gray-200)',
              padding: '1.25rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
              boxShadow: 'var(--shadow-sm)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: link.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: link.color, fontWeight: 700, fontSize: '1.2rem' }}>
                {link.label[0]}
              </div>
              {link.countKey && (
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: link.color }}>{getCount(link.countKey)}</span>
              )}
            </div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>{link.label}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-600)' }}>{link.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#f7fafc', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--color-purple)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>System Overview</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-600)', lineHeight: '1.6' }}>
          Welcome to the Nabbis Collections admin panel. Use the sidebar to navigate between management sections.
          From here you can manage vendors, products, orders, users, site settings, hero slides, and more.
        </p>
      </div>
    </div>
  );
}
