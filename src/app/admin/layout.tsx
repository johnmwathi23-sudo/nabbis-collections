'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '../../context/AppContext';

const mainNav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '◇' },
  { href: '/admin/vendors', label: 'Vendors', icon: '◈' },
  { href: '/admin/products', label: 'Products', icon: '◎' },
  { href: '/admin/orders', label: 'Orders', icon: '◉' },
  { href: '/admin/users', label: 'Users', icon: '👤' },
];

const contentNav = [
  { href: '/admin/hero-slides', label: 'Hero Slides', icon: '▶' },
  { href: '/admin/settings', label: 'Site Settings', icon: '⚙' },
  { href: '/admin/site-images', label: 'Site Images', icon: '🖼' },
];

const siteManagerNav = [
  { href: '/admin/contacts', label: 'Contacts', icon: '📞' },
  { href: '/admin/audit-log', label: 'Audit Log', icon: '📋' },
  { href: '/admin/permissions', label: 'Permissions', icon: '🔑', superOnly: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, logoutUser } = useApp();
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarHover, setSidebarHover] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const sidebarCollapsedWidth = 64;
  const sidebarExpandedWidth = 240;
  const isExpanded = isMobile ? sidebarOpen : (sidebarHover || sidebarPinned);

  const handleLogout = () => {
    logoutUser();
    window.location.href = '/';
  };

  const handleSidebarLeave = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => {
      if (!sidebarPinned) setSidebarHover(false);
    }, 300);
  };

  const renderNavItem = (item: { href: string; label: string; icon: string }) => {
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
          padding: '0.7rem 1rem',
          margin: '0 0.5rem',
          borderRadius: '10px',
          color: isActive ? '#ffffff' : 'rgba(255,255,255,0.6)',
          background: isActive ? 'rgba(168,85,247,0.2)' : 'transparent',
          border: isActive ? '1px solid rgba(168,85,247,0.3)' : '1px solid transparent',
          fontSize: '0.85rem',
          fontWeight: isActive ? 600 : 400,
          textDecoration: 'none',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          position: 'relative',
          ...(isActive ? { boxShadow: '0 0 12px rgba(168,85,247,0.25)' } : {}),
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = 'rgba(168,85,247,0.1)';
            e.currentTarget.style.color = '#ffffff';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
          }
        }}
      >
        <span style={{ fontSize: '1.1rem', flexShrink: 0, width: '24px', textAlign: 'center' }}>{item.icon}</span>
        <span style={{
          opacity: isExpanded ? 1 : 0,
          transition: 'opacity 0.15s ease',
          transitionDelay: isExpanded ? '0.1s' : '0s',
        }}>{item.label}</span>
      </a>
    );
  };

  const sectionLabel = (label: string) => (
    <div style={{
      padding: isExpanded ? '0.6rem 1.25rem 0.3rem' : '0.6rem 0',
      display: 'flex',
      justifyContent: isExpanded ? 'flex-start' : 'center',
    }}>
      <span style={{
        fontSize: '0.6rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: '#a855f7',
        textShadow: '0 0 8px rgba(168,85,247,0.4)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }}>{isExpanded ? label : '—'}</span>
    </div>
  );

  const sidebarWidth = isExpanded ? sidebarExpandedWidth : (isMobile ? 0 : sidebarCollapsedWidth);

  const sidebarStyle: React.CSSProperties = isMobile ? {
    width: sidebarExpandedWidth,
    background: 'rgba(15, 8, 30, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    color: 'white',
    padding: '1rem 0',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    zIndex: 200,
    transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.3s ease',
    borderRight: '1px solid rgba(168,85,247,0.2)',
    boxShadow: '4px 0 24px rgba(168,85,247,0.15)',
  } : {
    width: sidebarWidth,
    background: 'rgba(15, 8, 30, 0.75)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    color: 'white',
    padding: '1rem 0',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    zIndex: 100,
    borderRight: '1px solid rgba(168,85,247,0.15)',
    boxShadow: isExpanded ? '4px 0 32px rgba(168,85,247,0.15)' : '2px 0 16px rgba(168,85,247,0.08)',
    transition: 'width 0.25s ease, box-shadow 0.25s ease',
  };

  const mainMargin = isMobile ? 0 : sidebarExpandedWidth;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>
      {/* Background gradient overlay */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 0% 50%, rgba(88,28,135,0.08) 0%, transparent 60%), radial-gradient(ellipse at 100% 0%, rgba(168,85,247,0.04) 0%, transparent 50%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
            zIndex: 150,
          }}
        />
      )}

      <aside
        style={sidebarStyle}
        onMouseEnter={() => { if (!isMobile) { if (hideTimeout.current) clearTimeout(hideTimeout.current); setSidebarHover(true); } }}
        onMouseLeave={handleSidebarLeave}
      >
        {/* Logo / Brand */}
        <div style={{
          padding: isExpanded ? '0.5rem 1.25rem 1.25rem' : '0.5rem 0 1.25rem',
          display: 'flex',
          justifyContent: isExpanded ? 'flex-start' : 'center',
          alignItems: 'center',
          gap: '0.5rem',
          borderBottom: '1px solid rgba(168,85,247,0.1)',
          marginBottom: '0.75rem',
        }}>
          <span style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #a855f7, #6d28d9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', fontWeight: 800, color: 'white',
            flexShrink: 0,
            boxShadow: '0 0 12px rgba(168,85,247,0.4)',
          }}>N</span>
          <span style={{
            opacity: isExpanded ? 1 : 0,
            transition: 'opacity 0.15s ease',
            transitionDelay: isExpanded ? '0.1s' : '0s',
            fontSize: '0.95rem', fontWeight: 700, color: 'white',
            whiteSpace: 'nowrap',
          }}>Admin Panel</span>
        </div>

        {/* Pin toggle (desktop only) */}
        {!isMobile && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 0.75rem 0.5rem' }}>
            <button
              onClick={() => { setSidebarPinned(!sidebarPinned); if (!sidebarPinned) setSidebarHover(true); }}
              style={{
                background: sidebarPinned ? 'rgba(168,85,247,0.2)' : 'transparent',
                border: 'none', color: sidebarPinned ? '#a855f7' : 'rgba(255,255,255,0.3)',
                fontSize: '0.8rem', cursor: 'pointer', padding: '4px 6px',
                borderRadius: '4px', transition: 'all 0.2s',
              }}
              title={sidebarPinned ? 'Unpin sidebar' : 'Pin sidebar'}
            >
              {sidebarPinned ? '📌' : '📍'}
            </button>
          </div>
        )}

        <nav>
          {sectionLabel('Main')}
          {mainNav.map(renderNavItem)}
          {sectionLabel('Content')}
          {contentNav.map(renderNavItem)}
          {sectionLabel('Site Manager')}
          {siteManagerNav.filter(item => !item.superOnly || isSuperAdmin).map(renderNavItem)}
        </nav>

        {/* Bottom: Logout */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: isExpanded ? '1rem' : '0.5rem',
          borderTop: '1px solid rgba(168,85,247,0.1)',
          background: 'rgba(15,8,30,0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              width: '100%', padding: isExpanded ? '0.6rem 1rem' : '0.6rem 0',
              borderRadius: '10px', border: '1px solid rgba(239,68,68,0.2)',
              background: 'rgba(239,68,68,0.08)',
              color: '#fca5a5', cursor: 'pointer',
              fontSize: '0.85rem', fontWeight: 500,
              transition: 'all 0.2s',
              justifyContent: isExpanded ? 'flex-start' : 'center',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}
          >
            <span style={{ fontSize: '1rem', flexShrink: 0 }}>🚪</span>
            <span style={{
              opacity: isExpanded ? 1 : 0,
              transition: 'opacity 0.15s ease',
              transitionDelay: isExpanded ? '0.1s' : '0s',
              whiteSpace: 'nowrap',
            }}>Sign Out</span>
          </button>
        </div>
      </aside>

      <main style={{
        marginLeft: mainMargin,
        flex: 1,
        padding: isMobile ? '1rem' : '2rem',
        paddingTop: isMobile ? '0.75rem' : '2rem',
        background: 'transparent',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
        transition: 'margin-left 0.25s ease',
      }}>
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'linear-gradient(135deg, #6d28d9, #a855f7)',
              color: 'white', border: 'none',
              borderRadius: '10px', padding: '8px 14px',
              fontSize: '1.2rem', cursor: 'pointer', marginBottom: '0.75rem',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              boxShadow: '0 0 12px rgba(168,85,247,0.3)',
            }}
            aria-label="Toggle sidebar navigation"
          >
            <span>{sidebarOpen ? '✕' : '☰'}</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Menu</span>
          </button>
        )}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '16px',
          border: '1px solid rgba(168,85,247,0.08)',
          padding: '1.5rem',
          minHeight: 'calc(100vh - 4rem)',
        }}>
          {children}
        </div>
      </main>
    </div>
  );
}
