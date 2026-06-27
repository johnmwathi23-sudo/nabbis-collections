'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import styles from '../dashboard/admin.module.css';

export default function AdminOrdersPage() {
  const router = useRouter();
  const { currentUser, orders, updateOrderStatus, createAuditEntry } = useApp();

  useEffect(() => {
    if (!currentUser) { router.push('/login'); return; }
    if (currentUser.role !== 'admin' && currentUser.role !== 'super_admin') { router.push('/account'); }
  }, [currentUser, router]);

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
    return <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>Verifying admin authorization...</div>;
  }

  const handleStatusChange = async (orderId: string, status: string) => {
    await updateOrderStatus(orderId, status as any);
    await createAuditEntry('update', 'order', orderId, { newStatus: status });
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Order Management</h1>
        <p style={{ color: 'var(--color-gray-600)' }}>View and manage all platform orders</p>
      </div>

      <div className={styles.sectionCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Order ID</th>
              <th className={styles.th}>Date</th>
              <th className={styles.th}>Total Value</th>
              <th className={styles.th}>Delivery Type</th>
              <th className={styles.th}>Payment</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th} style={{ textAlign: 'right' }}>Action Override</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-gray-500)' }}>No orders found</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className={styles.tr}>
                  <td className={styles.td}><strong>{order.id}</strong></td>
                  <td className={styles.td}>{new Date(order.createdAt).toLocaleDateString('en-KE')}</td>
                  <td className={styles.td}><strong>KES {order.total.toLocaleString()}</strong></td>
                  <td className={styles.td}>{order.deliveryType.toUpperCase()}</td>
                  <td className={styles.td}>{order.paymentMethod.toUpperCase()} ({order.paymentStatus})</td>
                  <td className={styles.td} style={{ textTransform: 'capitalize' }}>{order.status}</td>
                  <td className={styles.td} style={{ textAlign: 'right' }}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={styles.actionSelect}
                      aria-label="Change order status"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
