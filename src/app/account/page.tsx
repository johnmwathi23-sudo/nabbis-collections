'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import styles from './account.module.css';

export default function AccountPage() {
  const router = useRouter();
  const { currentUser, logoutUser, orders } = useApp();

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Access Denied</h1>
        <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
          Please log in to view your account details and order history.
        </p>
        <Link href="/login">
          <Button variant="primary">Log In</Button>
        </Link>
      </div>
    );
  }

  // Get orders from global list that belong to this customer
  // Since Order doesn't have customerId, we use the currentUser.orders which is kept synced.
  const myOrders = currentUser.orders || [];

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending': return styles.statusPending;
      case 'confirmed': return styles.statusConfirmed;
      case 'shipped': return styles.statusShipped;
      case 'delivered': return styles.statusDelivered;
      case 'cancelled': return styles.statusCancelled;
      default: return '';
    }
  };

  const formatDate = (isoStr: string) => {
    return new Date(isoStr).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeliveryLabel = (type: string) => {
    if (type === 'nairobi') return 'Nairobi Express';
    if (type === 'parcel') return 'Countrywide Parcel';
    return 'Self Pickup';
  };

  return (
    <div className={`container ${styles.container}`}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Account</h1>

      <div className={styles.profileLayout}>
        {/* Sidebar Info Card */}
        <aside className={styles.profileCard}>
          <div className={styles.avatar}>
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <h2 className={styles.name}>{currentUser.name}</h2>
          <span className={styles.roleBadge}>{currentUser.role}</span>

          <div className={styles.profileMeta}>
            <div>
              <strong>Email:</strong>
              <div style={{ wordBreak: 'break-all', marginTop: '2px' }}>{currentUser.email}</div>
            </div>
            {currentUser.phone && (
              <div style={{ marginTop: '10px' }}>
                <strong>Phone:</strong>
                <div style={{ marginTop: '2px' }}>{currentUser.phone}</div>
              </div>
            )}
            <div style={{ marginTop: '10px' }}>
              <strong>Joined:</strong>
              <div style={{ marginTop: '2px' }}>{currentUser.joinedDate}</div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={logoutUser}
            className={styles.logoutBtn}
          >
            Log Out
          </Button>

          {currentUser.role === 'vendor' && (
            <Link href="/vendor/dashboard" style={{ display: 'block', marginTop: '1rem' }}>
              <Button variant="primary" size="sm" style={{ width: '100%' }}>
                Vendor Dashboard
              </Button>
            </Link>
          )}

          {currentUser.role === 'admin' && (
            <Link href="/admin/dashboard" style={{ display: 'block', marginTop: '1rem' }}>
              <Button variant="primary" size="sm" style={{ width: '100%' }}>
                Admin Cockpit
              </Button>
            </Link>
          )}
        </aside>

        {/* Orders Dashboard */}
        <div className={styles.ordersPanel}>
          <h2 className={styles.panelTitle}>Order History</h2>

          {myOrders.length === 0 ? (
            <div className={styles.noOrders}>
              <p style={{ marginBottom: '1.5rem' }}>You haven&apos;t placed any orders yet.</p>
              <Link href="/shop">
                <Button variant="primary" size="sm">Browse Products</Button>
              </Link>
            </div>
          ) : (
            myOrders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div>
                    Order ID: <span className={styles.orderId}>{order.id}</span>
                  </div>
                  <div>
                    Placed: <strong>{formatDate(order.createdAt)}</strong>
                  </div>
                  <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className={styles.orderBody}>
                  {order.items.map((item, idx) => (
                    <div key={idx} className={styles.itemRow}>
                      <div>
                        <span className={styles.itemName}>{item.product.name}</span>
                        <span className={styles.itemQty}> &times; {item.quantity}</span>
                      </div>
                      <span style={{ fontWeight: 600 }}>
                        KES {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={styles.orderFooter}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-600)' }}>
                    Fulfillment: <strong>{getDeliveryLabel(order.deliveryType)}</strong> | Method: <strong>{order.paymentMethod.toUpperCase()}</strong>
                  </div>
                  <div className={styles.orderTotal}>
                    Total: KES {order.total.toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
