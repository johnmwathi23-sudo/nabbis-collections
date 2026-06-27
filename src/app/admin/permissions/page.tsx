'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { Button } from '../../../components/Button';
import { TrashIcon } from '../../../components/Icons';
import { Permission } from '../../../lib/types';
import styles from '../dashboard/admin.module.css';

const RESOURCES = ['products', 'vendors', 'orders', 'users', 'settings', 'hero_slides', 'site_images', 'audit_log', 'permissions', 'contacts'];
const ALL_ACTIONS = ['create', 'read', 'update', 'delete'];

export default function AdminPermissionsPage() {
  const router = useRouter();
  const { currentUser, profiles, permissions, loadPermissions, setPermission, deletePermission, createAuditEntry } = useApp();
  const [newUserId, setNewUserId] = useState('');
  const [newResource, setNewResource] = useState('products');
  const [newActions, setNewActions] = useState<string[]>(['read']);

  useEffect(() => {
    if (!currentUser) { router.push('/login'); return; }
    if (currentUser.role !== 'super_admin') { router.push('/admin/dashboard'); return; }
    loadPermissions();
  }, [currentUser, router, loadPermissions]);

  if (!currentUser || currentUser.role !== 'super_admin') {
    return <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>Access denied. Super admin only.</div>;
  }

  const handleToggleAction = (action: string) => {
    setNewActions(prev =>
      prev.includes(action) ? prev.filter(a => a !== action) : [...prev, action]
    );
  };

  const handleAddPermission = async () => {
    if (!newUserId || !newResource || newActions.length === 0) return;
    const target = profiles.find((p: any) => p.id === newUserId);
    await setPermission({
      user_id: newUserId,
      resource: newResource,
      actions: newActions,
    });
    await createAuditEntry('create', 'user_role', newUserId, { resource: newResource, actions: newActions, user: target?.name || newUserId });
    setNewActions(['read']);
  };

  const handleDelete = async (perm: Permission) => {
    if (!confirm(`Remove permission for ${perm.resource}?`)) return;
    await deletePermission(perm.id);
    await createAuditEntry('delete', 'user_role', perm.user_id, { resource: perm.resource });
  };

  const getUserName = (userId: string) => {
    const p = profiles.find((p: any) => p.id === userId);
    return p?.name || p?.full_name || userId;
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Permissions Management</h1>
        <p style={{ color: 'var(--color-gray-600)' }}>Grant granular access to admin resources by user</p>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--color-gray-200)', padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Add Permission</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>User</label>
            <select value={newUserId} onChange={(e) => setNewUserId(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }}>
              <option value="">Select user...</option>
              {profiles.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name || p.full_name || p.email || p.id} ({p.role})</option>
              ))}
            </select>
          </div>
          <div style={{ flex: '1 1 160px' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Resource</label>
            <select value={newResource} onChange={(e) => setNewResource(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }}>
              {RESOURCES.map(r => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Actions</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {ALL_ACTIONS.map(a => (
                <label key={a} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={newActions.includes(a)} onChange={() => handleToggleAction(a)} />
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </label>
              ))}
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={handleAddPermission} disabled={!newUserId || newActions.length === 0}>
            Grant Permission
          </Button>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>User</th>
              <th className={styles.th}>Resource</th>
              <th className={styles.th}>Actions</th>
              <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {permissions.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-gray-500)' }}>No permissions configured</td>
              </tr>
            ) : (
              permissions.map(perm => (
                <tr key={perm.id}>
                  <td className={styles.td}><strong>{getUserName(perm.user_id)}</strong></td>
                  <td className={styles.td} style={{ textTransform: 'capitalize' }}>{perm.resource.replace(/_/g, ' ')}</td>
                  <td className={styles.td}>
                    {perm.actions.map(a => (
                      <span key={a} style={{
                        display: 'inline-block', padding: '2px 8px', borderRadius: '4px',
                        background: '#e0e7ff', color: '#3730a3', fontSize: '0.75rem',
                        fontWeight: 600, marginRight: '4px', textTransform: 'capitalize',
                      }}>{a}</span>
                    ))}
                  </td>
                  <td className={styles.td} style={{ textAlign: 'right' }}>
                    <button onClick={() => handleDelete(perm)} style={{ color: 'var(--color-error)', cursor: 'pointer' }}>
                      <TrashIcon size={18} />
                    </button>
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