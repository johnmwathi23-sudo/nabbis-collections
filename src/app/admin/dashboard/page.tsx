'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { Button } from '../../../components/Button';
import { TrashIcon, EditIcon } from '../../../components/Icons';
import { Product, ProductBadge } from '../../../lib/types';
import styles from './admin.module.css';

export default function AdminDashboardPage() {
  const router = useRouter();
  const {
    currentUser,
    vendors,
    products,
    users,
    orders,
    approveVendor,
    suspendVendor,
    deleteProduct,
    updateOrderStatus,
    editProduct
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'vendors' | 'products' | 'orders'>('overview');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    price: '',
    oldPrice: '',
    stock: '',
    image: '',
    description: '',
    tags: '',
    badge: '',
    featured: false,
    isFlash: false,
  });

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      oldPrice: product.oldPrice?.toString() || '',
      stock: product.stock.toString(),
      image: product.image,
      description: product.description,
      tags: product.tags?.join(', ') || '',
      badge: product.badge || '',
      featured: product.featured || false,
      isFlash: product.isFlash || false,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updatedProduct: Product = {
      ...editingProduct,
      name: editForm.name,
      category: editForm.category,
      price: parseFloat(editForm.price),
      oldPrice: editForm.oldPrice ? parseFloat(editForm.oldPrice) : null,
      stock: parseInt(editForm.stock),
      image: editForm.image,
      description: editForm.description,
      tags: editForm.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      badge: editForm.badge as ProductBadge,
      featured: editForm.featured,
      isFlash: editForm.isFlash,
    };

    editProduct(updatedProduct);
    setEditingProduct(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setEditForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Verify Admin authorization
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    if (currentUser.role !== 'admin') {
      router.push('/account');
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'admin') {
    return <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>Verifying admin authorization...</div>;
  }

  // Calculations
  const totalGMV = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const totalCommissions = totalGMV * 0.05; // flat 5% commission rate
  const pendingVendors = vendors.filter(v => v.status === 'pending').length;

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active': return styles.statusActive;
      case 'pending': return styles.statusPending;
      case 'suspended': return styles.statusSuspended;
      default: return '';
    }
  };

  const getOrderStatusClass = (status: string) => {
    if (status === 'pending') return 'color: var(--color-warning); font-weight: bold;';
    if (status === 'delivered') return 'color: var(--color-success); font-weight: bold;';
    if (status === 'cancelled') return 'color: var(--color-error);';
    return 'color: var(--color-purple); font-weight: bold;';
  };

  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>Admin Cockpit</h1>
        <p style={{ color: 'var(--color-gray-600)' }}>
          Platform Administrator Dashboard — System Control and Oversight
        </p>
      </div>

      {/* Stats Cards */}
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

      {/* Tabs */}
      <nav className={styles.tabNav}>
        <button
          onClick={() => setActiveTab('overview')}
          className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.tabBtnActive : ''}`}
        >
          System Overview
        </button>
        <button
          onClick={() => setActiveTab('vendors')}
          className={`${styles.tabBtn} ${activeTab === 'vendors' ? styles.tabBtnActive : ''}`}
        >
          Vendors ({vendors.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`${styles.tabBtn} ${activeTab === 'products' ? styles.tabBtnActive : ''}`}
        >
          Product Catalog ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`${styles.tabBtn} ${activeTab === 'orders' ? styles.tabBtnActive : ''}`}
        >
          System Orders ({orders.length})
        </button>
      </nav>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Administrator Controls</h2>
          <p style={{ color: 'var(--color-gray-600)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Welcome to the Nabbis Collections administrator dashboard. From here, you have global control over store listings, vendor registrations, customer accounts, and order management. Verify incoming vendor requests, adjust payouts, and ensure smooth system operations.
          </p>
          <div style={{ background: '#f7fafc', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--color-purple)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>💡 Quick Tip for Development Testing</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-600)' }}>
              Open another private window or tab, register a new vendor account, apply for business verification, and watch it appear in the **Vendors** tab here in real-time. Click **Approve** to immediately unlock their seller tools!
            </p>
          </div>
        </div>
      )}

      {activeTab === 'vendors' && (
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Vendor Accounts</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Location</th>
                <th>Joined Date</th>
                <th>Products</th>
                <th>Sales Volume</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id} className={styles.tr}>
                  <td className={styles.td}>
                    <strong>{vendor.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-600)', marginTop: '2px' }}>
                      Owner ID: {vendor.id}
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
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => approveVendor(vendor.id)}
                        >
                          Approve
                        </Button>
                      )}
                      {vendor.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => suspendVendor(vendor.id)}
                          style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                        >
                          Suspend
                        </Button>
                      )}
                      {vendor.status === 'suspended' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => approveVendor(vendor.id)}
                        >
                          Unsuspend
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'products' && (
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Product Catalog Management</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Vendor</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className={styles.tr}>
                  <td className={styles.td}>
                    <img src={p.image} alt="" style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td className={styles.td}>
                    <strong>{p.name}</strong>
                  </td>
                  <td className={styles.td}>{p.category}</td>
                  <td className={styles.td}>KES {p.price.toLocaleString()}</td>
                  <td className={styles.td}>{p.stock} units</td>
                  <td className={styles.td}>{p.vendor}</td>
                    <td className={styles.td} style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleEditClick(p)}
                          style={{ color: 'var(--color-purple)', cursor: 'pointer' }}
                          aria-label="Edit Product"
                        >
                          <EditIcon size={18} />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          style={{ color: 'var(--color-error)', cursor: 'pointer' }}
                          aria-label="Delete Product"
                        >
                          <TrashIcon size={18} />
                        </button>
                      </div>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>System-Wide Orders</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total Value</th>
                <th>Delivery Type</th>
                <th>Payment</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action Override</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className={styles.tr}>
                  <td className={styles.td}>
                    <strong>{order.id}</strong>
                  </td>
                  <td className={styles.td}>
                    {new Date(order.createdAt).toLocaleDateString('en-KE')}
                  </td>
                  <td className={styles.td}>
                    <strong>KES {order.total.toLocaleString()}</strong>
                  </td>
                  <td className={styles.td}>
                    {order.deliveryType.toUpperCase()}
                  </td>
                  <td className={styles.td}>
                    {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                  </td>
                  <td className={styles.td}>
                    <span style={{ textTransform: 'capitalize' }}>
                      {order.status}
                    </span>
                  </td>
                  <td className={styles.td} style={{ textAlign: 'right' }}>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
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
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '800px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Edit Product</h2>
            <form onSubmit={handleEditSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Category</label>
                  <select
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="Fashion & Clothing">Fashion & Clothing</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Home & Household Accessories">Home & Household Accessories</option>
                    <option value="Beddings & Decor">Beddings & Decor</option>
                    <option value="Kitchen Essentials">Kitchen Essentials</option>
                    <option value="Baby Products">Baby Products</option>
                    <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                    <option value="Health & Wellness">Health & Wellness</option>
                    <option value="Fitness & Yoga Accessories">Fitness & Yoga Accessories</option>
                    <option value="Assistive Devices">Assistive Devices</option>
                    <option value="Lifestyle & Gifts">Lifestyle & Gifts</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Price (KES)</label>
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleEditChange}
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Old Price (KES)</label>
                  <input
                    type="number"
                    name="oldPrice"
                    value={editForm.oldPrice}
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={editForm.stock}
                    onChange={handleEditChange}
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={editForm.image}
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Badge</label>
                  <select
                    name="badge"
                    value={editForm.badge}
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="">None</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="New">New</option>
                    <option value="Sale">Sale</option>
                    <option value="Flash">Flash</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={editForm.tags}
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  required
                  rows={3}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={editForm.featured}
                    onChange={handleEditChange}
                  />
                  Featured
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    name="isFlash"
                    checked={editForm.isFlash}
                    onChange={handleEditChange}
                  />
                  Flash Sale
                </label>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
