'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { Button } from '../../../components/Button';
import { PlusIcon, TrashIcon, EditIcon } from '../../../components/Icons';
import { SiteContact } from '../../../lib/types';
import styles from '../dashboard/admin.module.css';

const CONTACT_TYPES = ['phone', 'email', 'address', 'social', 'hours'] as const;

const emptyForm = { label: '', type: 'phone' as SiteContact['type'], value: '', sort_order: 0, is_active: true };

export default function AdminContactsPage() {
  const router = useRouter();
  const { currentUser, siteContacts, loadSiteContacts, createSiteContact, updateSiteContact, deleteSiteContact, createAuditEntry } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!currentUser) { router.push('/login'); return; }
    if (currentUser.role !== 'admin' && currentUser.role !== 'super_admin') { router.push('/account'); return; }
    loadSiteContacts();
  }, [currentUser, router, loadSiteContacts]);

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
    return <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>Verifying admin authorization...</div>;
  }

  const handleEdit = (contact: SiteContact) => {
    setForm({ label: contact.label, type: contact.type, value: contact.value, sort_order: contact.sort_order, is_active: contact.is_active });
    setEditingId(contact.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.label || !form.value) return;

    if (editingId) {
      await updateSiteContact(editingId, form);
      await createAuditEntry('update', 'site_setting', editingId, { label: form.label });
    } else {
      await createSiteContact(form);
      await createAuditEntry('create', 'site_setting', undefined, { label: form.label });
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = async (contact: SiteContact) => {
    if (!confirm(`Delete "${contact.label}"?`)) return;
    await deleteSiteContact(contact.id);
    await createAuditEntry('delete', 'site_setting', contact.id, { label: contact.label });
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'phone': return '📞';
      case 'email': return '📧';
      case 'address': return '📍';
      case 'social': return '🔗';
      case 'hours': return '🕐';
      default: return '📄';
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Site Manager</h1>
          <p style={{ color: 'var(--color-gray-600)' }}>Manage site contacts, phone numbers, emails, hours, and social links</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}>
          <PlusIcon size={16} /> Add Contact
        </Button>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '500px', width: '90%' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>{editingId ? 'Edit Contact' : 'New Contact'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Label</label>
                <input type="text" value={form.label} onChange={(e) => setForm(p => ({ ...p, label: e.target.value }))} required
                  placeholder="e.g. Customer Support"
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Type</label>
                  <select value={form.type} onChange={(e) => setForm(p => ({ ...p, type: e.target.value as SiteContact['type'] }))}
                    style={{ width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }}>
                    {CONTACT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={(e) => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))}
                    style={{ width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }} />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Value</label>
                <input type="text" value={form.value} onChange={(e) => setForm(p => ({ ...p, value: e.target.value }))} required
                  placeholder="e.g. +254 700 000 000"
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm(p => ({ ...p, is_active: e.target.checked }))} />
                  Active
                </label>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Button>
                <Button type="submit" variant="primary">{editingId ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.sectionCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Type</th>
              <th className={styles.th}>Label</th>
              <th className={styles.th}>Value</th>
              <th className={styles.th}>Order</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {siteContacts.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-gray-500)' }}>No contacts added yet</td>
              </tr>
            ) : (
              siteContacts.map(contact => (
                <tr key={contact.id}>
                  <td className={styles.td} style={{ fontSize: '1.1rem' }}>{typeIcon(contact.type)}</td>
                  <td className={styles.td}><strong>{contact.label}</strong></td>
                  <td className={styles.td} style={{ color: 'var(--color-gray-600)' }}>{contact.value}</td>
                  <td className={styles.td}>{contact.sort_order}</td>
                  <td className={styles.td}>
                    <span style={{
                      padding: '2px 10px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700,
                      background: contact.is_active ? '#d1fae5' : '#f3f4f6',
                      color: contact.is_active ? '#065f46' : '#374151',
                    }}>
                      {contact.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className={styles.td} style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleEdit(contact)} style={{ color: 'var(--color-purple)', cursor: 'pointer' }}>
                        <EditIcon size={18} />
                      </button>
                      <button onClick={() => handleDelete(contact)} style={{ color: 'var(--color-error)', cursor: 'pointer' }}>
                        <TrashIcon size={18} />
                      </button>
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