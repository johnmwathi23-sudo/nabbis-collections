'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { Button } from '../../../components/Button';
import { TrashIcon, EditIcon, PlusIcon } from '../../../components/Icons';
import { Product, ProductBadge } from '../../../lib/types';
import styles from './dashboard.module.css';

export default function VendorDashboardPage() {
  const router = useRouter();
  const { currentUser, vendors, products, orders, addProduct, deleteProduct, updateOrderStatus, editProduct } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [showAddForm, setShowAddForm] = useState(false);
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

  // Add Product Form State
  const [pName, setPName] = useState('');
  const [pCategory, setPCategory] = useState('Fashion & Clothing');
  const [pPrice, setPPrice] = useState('');
  const [pOldPrice, setPOldPrice] = useState('');
  const [pStock, setPStock] = useState('');
  const [pImage, setPImage] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pTags, setPTags] = useState('');

  // Redirect / verify authorization
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    if (currentUser.role !== 'vendor') {
      router.push('/become-a-seller');
      return;
    }
    const vendorProfile = vendors.find(v => v.id === currentUser.id);
    if (!vendorProfile || vendorProfile.status !== 'active') {
      router.push('/become-a-seller');
    }
  }, [currentUser, vendors, router]);

  if (!currentUser || currentUser.role !== 'vendor') {
    return <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>Loading vendor portal...</div>;
  }

  const vendorProfile = vendors.find(v => v.id === currentUser.id);
  if (!vendorProfile || vendorProfile.status !== 'active') {
    return <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>Verifying vendor credentials...</div>;
  }

  // Get vendor specific products
  const myProducts = products.filter(p => p.vendorId === currentUser.id);

  // Get orders containing this vendor's products
  const myOrders = orders.filter(order =>
    order.items.some(item => item.product.vendorId === currentUser.id)
  );

  // Calculate stats
  // Revenue: Sum of (price * qty) for all items in "paid" or "delivered" or "shipped" orders that belong to this vendor
  const vendorSales = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, order) => {
      const vendorItems = order.items.filter(item => item.product.vendorId === currentUser.id);
      const orderSubtotal = vendorItems.reduce((s, i) => s + (i.product.price * i.quantity), 0);
      return sum + orderSubtotal;
    }, 0);

  const totalSalesCount = myProducts.reduce((sum, p) => sum + (vendorProfile.totalSales || 0), 0); // fallback or sum up items in actual orders
  const actualOrdersCount = myOrders.length;

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fallbackImg = pImage.trim() !== '' ? pImage : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=500';

    addProduct({
      name: pName,
      category: pCategory,
      price: parseFloat(pPrice),
      oldPrice: pOldPrice ? parseFloat(pOldPrice) : null,
      stock: parseInt(pStock),
      image: fallbackImg,
      description: pDesc,
      tags: pTags.split(',').map(t => t.trim()).filter(t => t !== ''),
    });

    // Reset Form
    setPName('');
    setPPrice('');
    setPOldPrice('');
    setPStock('');
    setPImage('');
    setPDesc('');
    setPTags('');
    setShowAddForm(false);
    setActiveTab('products');
  };

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

  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Vendor Center</h1>
          <p style={{ color: 'var(--color-gray-600)' }}>
            Managing store: <strong>{vendorProfile.name}</strong> ({vendorProfile.location})
          </p>
        </div>
        <div className={styles.btnActions}>
          <Button variant="primary" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            <PlusIcon size={16} /> Add Product
          </Button>
          <Link href="/shop">
            <Button variant="outline" size="sm">View Storefront</Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Store Earnings</span>
          <span className={styles.statVal}>KES {vendorSales.toLocaleString()}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Orders Received</span>
          <span className={styles.statVal}>{actualOrdersCount}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Active Products</span>
          <span className={styles.statVal}>{myProducts.length}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Store Rating</span>
          <span className={styles.statVal}>★ {vendorProfile.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <nav className={styles.tabNav}>
        <button
          onClick={() => { setActiveTab('overview'); setShowAddForm(false); }}
          className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.tabBtnActive : ''}`}
        >
          Overview &amp; Sales
        </button>
        <button
          onClick={() => { setActiveTab('products'); setShowAddForm(false); }}
          className={`${styles.tabBtn} ${activeTab === 'products' ? styles.tabBtnActive : ''}`}
        >
          Products ({myProducts.length})
        </button>
        <button
          onClick={() => { setActiveTab('orders'); setShowAddForm(false); }}
          className={`${styles.tabBtn} ${activeTab === 'orders' ? styles.tabBtnActive : ''}`}
        >
          Orders &amp; Shipments ({actualOrdersCount})
        </button>
      </nav>

      {/* Add Product Form */}
      {showAddForm && (
        <div className={styles.sectionCard} style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>List New Product</h2>
          <form onSubmit={handleAddProductSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Product Name</label>
                <input
                  type="text"
                  required
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  placeholder="e.g. Vintage Leather Jacket"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Category</label>
                <select
                  value={pCategory}
                  onChange={(e) => setPCategory(e.target.value)}
                  className={styles.input}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="Fashion & Clothing">Fashion &amp; Clothing</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Home & Household Accessories">Home &amp; Household Accessories</option>
                  <option value="Beddings & Decor">Beddings &amp; Decor</option>
                  <option value="Kitchen Essentials">Kitchen Essentials</option>
                  <option value="Baby Products">Baby Products</option>
                  <option value="Beauty & Personal Care">Beauty &amp; Personal Care</option>
                  <option value="Health & Wellness">Health &amp; Wellness</option>
                  <option value="Fitness & Yoga Accessories">Fitness &amp; Yoga Accessories</option>
                  <option value="Assistive Devices">Assistive Devices</option>
                  <option value="Lifestyle & Gifts">Lifestyle &amp; Gifts</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Price (KES)</label>
                <input
                  type="number"
                  required
                  value={pPrice}
                  onChange={(e) => setPPrice(e.target.value)}
                  placeholder="e.g. 3500"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Old Price (KES, Optional for Discount badge)</label>
                <input
                  type="number"
                  value={pOldPrice}
                  onChange={(e) => setPOldPrice(e.target.value)}
                  placeholder="e.g. 4500"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Stock Quantity</label>
                <input
                  type="number"
                  required
                  value={pStock}
                  onChange={(e) => setPStock(e.target.value)}
                  placeholder="e.g. 10"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Image URL (Optional)</label>
                <input
                  type="text"
                  value={pImage}
                  onChange={(e) => setPImage(e.target.value)}
                  placeholder="Paste direct Unsplash/image link..."
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
              <label className={styles.label}>Description</label>
              <textarea
                required
                value={pDesc}
                onChange={(e) => setPDesc(e.target.value)}
                placeholder="Product material, sizing, dimensions, washing instructions..."
                className={styles.textarea}
              />
            </div>

            <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
              <label className={styles.label}>Tags (Comma-separated)</label>
              <input
                type="text"
                value={pTags}
                onChange={(e) => setPTags(e.target.value)}
                placeholder="e.g. leather, jacket, warm, fashion"
                className={styles.input}
              />
            </div>

            <div className={styles.formActions}>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                List Product
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className={styles.dashboardGrid}>
          <div className={styles.sectionCard}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Fulfillment Summary</h2>
            <p style={{ color: 'var(--color-gray-600)', marginBottom: '1.5rem' }}>
              Here is a summary of sales performance. Manage catalog updates or check active shipments using the navigation tabs above.
            </p>
            <div style={{ padding: '2rem', textAlign: 'center', background: '#f7fafc', borderRadius: '8px' }}>
              <p style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--color-purple)' }}>🚀 Daily Sales Dashboard Active</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-600)', marginTop: '8px' }}>
                All orders are processed through the Central Nairobi drop-off hub. Order notifications trigger automatically.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Listed Products</h2>
          </div>

          {myProducts.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-gray-600)' }}>
              No products listed yet. Click &quot;Add Product&quot; to list your first item.
            </p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Image</th>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Category</th>
                  <th className={styles.th}>Price</th>
                  <th className={styles.th}>Stock</th>
                  <th className={styles.th}>Rating</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myProducts.map((p) => (
                  <tr key={p.id} className={styles.tr}>
                    <td className={styles.td}>
                      <img src={p.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    </td>
                    <td className={styles.td}>
                      <span className={styles.productName}>{p.name}</span>
                    </td>
                    <td className={styles.td}>{p.category}</td>
                    <td className={styles.td}>KES {p.price.toLocaleString()}</td>
                    <td className={styles.td}>{p.stock} pcs</td>
                    <td className={styles.td}>★ {p.rating.toFixed(1)}</td>
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
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className={styles.sectionCard}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Incoming Orders</h2>

          {myOrders.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-gray-600)' }}>
              You haven&apos;t received any orders yet.
            </p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Order ID</th>
                  <th className={styles.th}>Date</th>
                  <th className={styles.th}>Items Ordered</th>
                  <th className={styles.th}>Total Revenue</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myOrders.map((order) => {
                  const vendorItems = order.items.filter(item => item.product.vendorId === currentUser.id);
                  const vendorSubtotal = vendorItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

                  return (
                    <tr key={order.id} className={styles.tr}>
                      <td className={styles.td}>
                        <strong>{order.id}</strong>
                      </td>
                      <td className={styles.td}>
                        {new Date(order.createdAt).toLocaleDateString('en-KE')}
                      </td>
                      <td className={styles.td}>
                        {vendorItems.map((item, idx) => (
                          <div key={idx} className={styles.orderItemRow}>
                            {item.product.name} <span style={{ color: 'var(--color-gray-600)' }}>&times; {item.quantity}</span>
                          </div>
                        ))}
                      </td>
                      <td className={styles.td}>
                        <strong>KES {vendorSubtotal.toLocaleString()}</strong>
                      </td>
                      <td className={styles.td}>
                        <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className={styles.td} style={{ textAlign: 'right' }}>
                        {order.status === 'pending' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          >
                            Confirm Order
                          </Button>
                        )}
                        {order.status === 'confirmed' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'shipped')}
                          >
                            Mark as Shipped
                          </Button>
                        )}
                        {order.status === 'shipped' && (
                          <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-600)', fontStyle: 'italic' }}>
                            Awaiting Delivery
                          </span>
                        )}
                        {order.status === 'delivered' && (
                          <span style={{ fontSize: '0.85rem', color: 'var(--color-success)', fontWeight: 700 }}>
                            Delivered ✅
                          </span>
                        )}
                        {order.status === 'cancelled' && (
                          <span style={{ fontSize: '0.85rem', color: 'var(--color-error)' }}>
                            Cancelled
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
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
