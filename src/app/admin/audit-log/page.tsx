'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';

export default function AdminAuditLogPage() {
  const router = useRouter();
  const { currentUser, auditLogs, loadAdminData, profiles } = useApp();
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!currentUser) { router.push('/login'); return; }
    if (currentUser.role !== 'admin' && currentUser.role !== 'super_admin') { router.push('/account'); return; }
    loadAdminData();
  }, [currentUser, router, loadAdminData]);

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
    return <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>Verifying admin authorization...</div>;
  }

  const getAdminName = (adminId: string): string => {
    const profile = profiles.find((p: { id?: string; name?: string; full_name?: string }) => p.id === adminId);
    return profile?.name || profile?.full_name || adminId.substring(0, 8) + '...';
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return { bg: '#d1fae5', color: '#065f46' };
      case 'update': return { bg: '#dbeafe', color: '#1e40af' };
      case 'delete': return { bg: '#fce7f3', color: '#9d174d' };
      case 'login': return { bg: '#fef3c7', color: '#92400e' };
      case 'logout': return { bg: '#f3f4f6', color: '#374151' };
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    if (entityFilter !== 'all' && log.entity !== entityFilter) return false;
    if (actionFilter !== 'all' && log.action !== actionFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.entity?.toLowerCase().includes(q) ||
        log.entity_id?.toLowerCase().includes(q) ||
        log.action?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Audit Log</h1>
        <p style={{ color: 'var(--color-gray-600)' }}>Track all administrative actions across the platform</p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search logs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1, minWidth: '200px', padding: '0.6rem 1rem', border: '1px solid #d1d5db',
            borderRadius: '8px', fontSize: '0.9rem', outline: 'none',
          }}
        />
        <select value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)}
          style={{ padding: '0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer', background: 'white' }}>
          <option value="all">All Entities</option>
          <option value="product">Product</option>
          <option value="category">Category</option>
          <option value="order">Order</option>
          <option value="profile">Profile</option>
          <option value="site_setting">Site Setting</option>
          <option value="hero_slide">Hero Slide</option>
          <option value="user_role">User Role</option>
        </select>
        <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}
          style={{ padding: '0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer', background: 'white' }}>
          <option value="all">All Actions</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
          <option value="login">Login</option>
          <option value="logout">Logout</option>
          <option value="export">Export</option>
        </select>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)', whiteSpace: 'nowrap' }}>
          {filteredLogs.length} entries
        </span>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--color-gray-200)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-gray-600)', textTransform: 'uppercase' }}>Timestamp</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-gray-600)', textTransform: 'uppercase' }}>Admin</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-gray-600)', textTransform: 'uppercase' }}>Action</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-gray-600)', textTransform: 'uppercase' }}>Entity</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-gray-600)', textTransform: 'uppercase' }}>Entity ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-gray-500)' }}>No audit entries found</td>
              </tr>
            ) : (
              filteredLogs.slice(0, 200).map((log) => {
                const ac = getActionColor(log.action);
                return (
                  <tr key={log.id} style={{ borderTop: '1px solid var(--color-gray-200)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--color-gray-600)', whiteSpace: 'nowrap' }}>
                      {new Date(log.created_at).toLocaleString('en-KE')}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}>
                      {getAdminName(log.admin_id)}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700,
                        textTransform: 'uppercase', background: ac.bg, color: ac.color,
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}>
                      <span style={{ textTransform: 'capitalize' }}>{log.entity.replace('_', ' ')}</span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--color-gray-500)', fontFamily: 'monospace' }}>
                      {log.entity_id || '-'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {filteredLogs.length > 200 && (
          <div style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid var(--color-gray-200)', color: 'var(--color-gray-500)', fontSize: '0.85rem' }}>
            Showing 200 of {filteredLogs.length} entries. Use filters to narrow results.
          </div>
        )}
      </div>
    </div>
  );
}
