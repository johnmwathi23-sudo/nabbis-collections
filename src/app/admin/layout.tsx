'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '../../context/AppContext';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '◇' },
  { href: '/admin/vendors', label: 'Vendors', icon: '◈' },
  { href: '/admin/products', label: 'Products', icon: '◎' },
  { href: '/admin/orders', label: 'Orders', icon: '◉' },
  { href: '/admin/users', label: 'Users', icon: '👤' },
  { href: '/admin/hero-slides', label: 'Hero Slides', icon: '▶' },
  { href: '/admin/settings', label: 'Site Settings', icon: '⚙' },
  { href: '/admin/site-images', label: 'Site Images', icon: '🖼' },
  { href: '/admin/audit-log', label: 'Audit Log', icon: '📋' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

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
    return <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>Verifying admin authorization...</div>;
  }

  const sidebarWidth = 240;

  const sidebarStyle: React.CSSProperties = isMobile ? {
    width: sidebarWidth,
    background: '#1e1b4b',
    color: 'white',
    padding: '1.5rem 0',
    position: 'fixed',
    top: '60px',
    left: 0,
    bottom: 0,
    overflowY: 'auto',
    zIndex: 200,
    transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.25s ease',
  } : {
    width: sidebarWidth,
    background: '#1e1b4b',
    color: 'white',
    padding: '1.5rem 0',
    position: 'fixed',
    top: '60px',
    left: 0,
    bottom: 0,
    overflowY: 'auto',
    zIndex: 100,
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            zIndex: 150, top: '60px',
          }}
        />
      )}

      <aside style={sidebarStyle}>
        <div style={{ padding: '0 1.25rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a5b4fc' }}>Admin Panel</h2>
        </div>
        <nav>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => { e.preventDefault(); router.push(item.href); if (isMobile) setSidebarOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1.25rem',
                  color: isActive ? 'white' : '#a5b4fc',
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  borderRight: isActive ? '3px solid #818cf8' : '3px solid transparent',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 400,
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </aside>

      <main style={{
        marginLeft: isMobile ? 0 : sidebarWidth,
        flex: 1,
        padding: isMobile ? '1rem' : '2rem',
        paddingTop: isMobile ? '0.75rem' : '2rem',
        background: '#f8fafc',
        minHeight: 'calc(100vh - 60px)',
      }}>
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: '#1e1b4b', color: 'white', border: 'none',
              borderRadius: '6px', padding: '6px 12px',
              fontSize: '1.2rem', cursor: 'pointer', marginBottom: '0.75rem',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}
            aria-label="Toggle sidebar navigation"
          >
            <span>{sidebarOpen ? '✕' : '☰'}</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Menu</span>
          </button>
        )}
        {children}
      </main>
    </div>
  );
}
