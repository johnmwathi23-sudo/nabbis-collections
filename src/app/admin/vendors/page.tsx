'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { Button } from '../../../components/Button';
import styles from '../dashboard/admin.module.css';

export default function AdminVendorsPage() {
  const router = useRouter();
  const { currentUser, vendors, approveVendor, suspendVendor, createAuditEntry } = useApp();

  useEffect(() => {
    if (!currentUser) { router.push('/login'); return; }
    if (currentUser.role !== 'admin' && currentUser.role !== 'super_admin') { router.push('/account'); }
  }, [currentUser, router]);

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
    return <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>Verifying admin authorization...</div>;
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active': return styles.statusActive;
      case 'pending': return styles.statusPending;
      case 'suspended': return styles.statusSuspended;
      default: return '';
    }
  };

  const handleApprove = async (vendorId: number) => {
    await approveVendor(vendorId);
    await createAuditEntry('update', 'profile', String(vendorId), { status: 'active' });
  };

  const handleSuspend = async (vendorId: number) => {
    await suspendVendor(vendorId);
    await createAuditEntry('update', 'profile', String(vendorId), { status: 'suspended' });
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Vendor Management</h1>
        <p style={{ color: 'var(--color-gray-600)' }}>Approve, suspend, and manage vendor accounts</p>
      </div>

      <div className={styles.sectionCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Business Name</th>
              <th className={styles.th}>Location</th>
              <th className={styles.th}>Joined Date</th>
              <th className={styles.th}>Products</th>
              <th className={styles.th}>Sales Volume</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-gray-500)' }}>No vendors found</td>
              </tr>
            ) : (
              vendors.map((vendor) => (
                <tr key={vendor.id} className={styles.tr}>
                  <td className={styles.td}>
                    <strong>{vendor.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-600)', marginTop: '2px' }}>
                      ID: {vendor.id}
                    </div>
                  </td>
                  <td className={styles.td}>{vendor.location}</td>
                  <td className={styles.td}>{vendor.joinedDate}</td>
                  <td className={styles.td}>{vendor.totalProducts} items</td>
                  <td className={styles.td}>{vendor.totalSales} sales</td>
                  <td className={styles.td}>
                    <span className={`${styles.statusBadge} ${getStatusClass(vendor.status)}`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className={styles.td} style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {vendor.status === 'pending' && (
                        <Button variant="primary" size="sm" onClick={() => handleApprove(vendor.id)}>Approve</Button>
                      )}
                      {vendor.status === 'active' && (
                        <Button variant="outline" size="sm" onClick={() => handleSuspend(vendor.id)}
                          style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}>Suspend</Button>
                      )}
                      {vendor.status === 'suspended' && (
                        <Button variant="outline" size="sm" onClick={() => handleApprove(vendor.id)}>Unsuspend</Button>
                      )}
                    </div>
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
