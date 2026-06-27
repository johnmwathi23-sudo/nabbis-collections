'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';

interface UserRow {
  id: string | number;
  name?: string;
  full_name?: string;
  email?: string;
  role?: string;
  joinedDate?: string;
  created_at?: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { currentUser, users, profiles, loadAdminData, updateProfileRole, createAuditEntry } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  useEffect(() => {
    if (!currentUser) { router.push('/login'); return; }
    if (currentUser.role !== 'admin' && currentUser.role !== 'super_admin') { router.push('/account'); return; }
    loadAdminData();
  }, [currentUser, router, loadAdminData]);

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
    return <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>Verifying admin authorization...</div>;
  }

  const allUsers: UserRow[] = profiles.length > 0 ? profiles : users;

  const filteredUsers = allUsers.filter((u) => {
    const matchesSearch = !searchQuery ||
      (u.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    await updateProfileRole(userId, newRole);
    await createAuditEntry('update', 'user_role', userId, { newRole });
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'super_admin': return { background: '#fef3c7', color: '#92400e' };
      case 'admin': return { background: '#e0e7ff', color: '#3730a3' };
      case 'vendor': return { background: '#d1fae5', color: '#065f46' };
      default: return { background: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>User Management</h1>
        <p style={{ color: 'var(--color-gray-600)' }}>Manage all platform users, roles, and permissions</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1, padding: '0.6rem 1rem', border: '1px solid #d1d5db',
            borderRadius: '8px', fontSize: '0.9rem', outline: 'none',
          }}
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            padding: '0.6rem 1rem', border: '1px solid #d1d5db',
            borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer', background: 'white',
          }}
        >
          <option value="all">All Roles</option>
          <option value="customer">Customers</option>
          <option value="vendor">Vendors</option>
          <option value="admin">Admins</option>
          <option value="super_admin">Super Admins</option>
        </select>
        <span style={{ fontSize: '0.9rem', color: 'var(--color-gray-600)', whiteSpace: 'nowrap' }}>
          {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--color-gray-200)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-gray-600)', textTransform: 'uppercase' }}>Name</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-gray-600)', textTransform: 'uppercase' }}>Email</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-gray-600)', textTransform: 'uppercase' }}>Role</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-gray-600)', textTransform: 'uppercase' }}>Joined</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-gray-600)', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-gray-500)' }}>No users found</td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} style={{ borderTop: '1px solid var(--color-gray-200)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <strong>{u.name || u.full_name || 'Unknown'}</strong>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--color-gray-600)', fontSize: '0.9rem' }}>
                    {u.email ?? '-'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{
                      ...getRoleBadgeStyle(u.role ?? 'customer'),
                      padding: '3px 10px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                    }}>
                      {u.role ?? 'customer'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--color-gray-600)', fontSize: '0.9rem' }}>
                    {u.joinedDate || u.created_at ? new Date(u.joinedDate ?? u.created_at ?? '').toLocaleDateString('en-KE') : '-'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <select
                      value={u.role ?? 'customer'}
                      onChange={(e) => handleRoleChange(String(u.id), e.target.value)}
                      style={{
                        padding: '0.4rem 0.75rem', border: '1px solid #d1d5db',
                        borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', background: 'white',
                      }}
                    >
                      <option value="customer">Customer</option>
                      <option value="vendor">Vendor</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
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
