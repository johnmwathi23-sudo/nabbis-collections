'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { Button } from '../../../components/Button';
import { PlusIcon, TrashIcon, EditIcon } from '../../../components/Icons';
import { Product, ProductBadge } from '../../../lib/types';
import { DatabaseService } from '../../../lib/database';
import { PRODUCTS as SEED_PRODUCTS } from '../../../lib/data';
import styles from '../dashboard/admin.module.css';
import ImagePicker from '../../../components/ImagePicker';

export default function AdminProductsPage() {
  const router = useRouter();
  const { currentUser, products, deleteProduct, editProduct, createAuditEntry } = useApp();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [imagePickerTarget, setImagePickerTarget] = useState<'edit' | 'create'>('edit');
  const [editForm, setEditForm] = useState({
    name: '', category: '', price: '', oldPrice: '', stock: '', image: '',
    description: '', tags: '', badge: '', featured: false, isFlash: false,
  });

  useEffect(() => {
    if (!currentUser) { router.push('/login'); return; }
    if (currentUser.role !== 'admin' && currentUser.role !== 'super_admin') { router.push('/account'); }
  }, [currentUser, router]);

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
    return <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>Verifying admin authorization...</div>;
  }

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

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (creating) {
      const slug = editForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newProduct: Omit<Product, 'id' | 'slug' | 'vendor' | 'vendorId' | 'rating' | 'reviews'> = {
        name: editForm.name,
        price: parseFloat(editForm.price),
        oldPrice: editForm.oldPrice ? parseFloat(editForm.oldPrice) : null,
        image: editForm.image,
        category: editForm.category,
        stock: parseInt(editForm.stock),
        description: editForm.description,
        tags: editForm.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
        badge: editForm.badge as ProductBadge,
        featured: editForm.featured,
        isFlash: editForm.isFlash,
      };
      try {
        const created = await DatabaseService.createProduct(newProduct);
        // Reload products since we can't easily update the state from here
        window.location.reload();
        await createAuditEntry('create', 'product', String(created.id), { name: created.name });
      } catch (err) {
        console.error('Failed to create product:', err);
      }
      setCreating(false);
      return;
    }

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
    await createAuditEntry('update', 'product', String(updatedProduct.id), { name: updatedProduct.name });
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

  const handleDelete = async (productId: number) => {
    if (!confirm('Delete this product permanently?')) return;
    await deleteProduct(productId);
    await createAuditEntry('delete', 'product', String(productId));
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Product Catalog</h1>
          <p style={{ color: 'var(--color-gray-600)' }}>Manage all products across the platform</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="outline" size="sm" onClick={async () => {
            if (!confirm('Seed all products from data.ts into the database? This will update existing products.')) return;
            for (const p of SEED_PRODUCTS) {
              try { await DatabaseService.seedProduct(p); } catch (err) { console.error('Failed to seed:', p.name, err); }
            }
            window.location.reload();
          }}>
            Seed Products
          </Button>
          <Button variant="primary" size="sm" onClick={() => {
            setCreating(true);
            setEditForm({ name: '', category: 'Fashion & Clothing', price: '', oldPrice: '', stock: '', image: '', description: '', tags: '', badge: '', featured: false, isFlash: false });
          }}>
            <PlusIcon size={16} /> New Product
          </Button>
        </div>
      </div>
      <div className={styles.sectionCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Image</th>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Category</th>
              <th className={styles.th}>Price</th>
              <th className={styles.th}>Stock</th>
              <th className={styles.th}>Vendor</th>
              <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-gray-500)' }}>No products found</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className={styles.tr}>
                  <td className={styles.td}>
                    <img src={p.image} alt="" style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td className={styles.td}><strong>{p.name}</strong></td>
                  <td className={styles.td}>{p.category}</td>
                  <td className={styles.td}>KES {p.price.toLocaleString()}</td>
                  <td className={styles.td}>{p.stock} units</td>
                  <td className={styles.td}>{p.vendor}</td>
                  <td className={styles.td} style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleEditClick(p)} style={{ color: 'var(--color-purple)', cursor: 'pointer' }} aria-label="Edit">
                        <EditIcon size={18} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} style={{ color: 'var(--color-error)', cursor: 'pointer' }} aria-label="Delete">
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

      {(editingProduct || creating) && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '800px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>{creating ? 'New Product' : 'Edit Product'}</h2>
            <form onSubmit={handleEditSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Product Name</label>
                  <input type="text" name="name" value={editForm.name} onChange={handleEditChange} required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Category</label>
                  <select name="category" value={editForm.category} onChange={handleEditChange} required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
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
                  <input type="number" name="price" value={editForm.price} onChange={handleEditChange} required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Old Price (KES)</label>
                  <input type="number" name="oldPrice" value={editForm.oldPrice} onChange={handleEditChange}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Stock</label>
                  <input type="number" name="stock" value={editForm.stock} onChange={handleEditChange} required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Image</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" name="image" value={editForm.image} onChange={handleEditChange}
                      style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                    <Button type="button" variant="secondary" size="sm" onClick={() => { setImagePickerOpen(true); setImagePickerTarget(creating ? 'create' : 'edit'); }}>
                      Browse
                    </Button>
                  </div>
                  {editForm.image && (
                    <div style={{ marginTop: '0.5rem', width: '80px', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                      <img src={editForm.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  )}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Badge</label>
                  <select name="badge" value={editForm.badge} onChange={handleEditChange}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                    <option value="">None</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="New">New</option>
                    <option value="Sale">Sale</option>
                    <option value="Flash">Flash</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Tags (comma-separated)</label>
                  <input type="text" name="tags" value={editForm.tags} onChange={handleEditChange}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description</label>
                <textarea name="description" value={editForm.description} onChange={handleEditChange} required rows={3}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" name="featured" checked={editForm.featured} onChange={handleEditChange} />
                  Featured
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" name="isFlash" checked={editForm.isFlash} onChange={handleEditChange} />
                  Flash Sale
                </label>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <Button type="button" variant="outline" onClick={() => { setEditingProduct(null); setCreating(false); }}>Cancel</Button>
                <Button type="submit" variant="primary">{creating ? 'Create' : 'Save Changes'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ImagePicker
        open={imagePickerOpen}
        onClose={() => setImagePickerOpen(false)}
        onSelect={(url) => {
          setEditForm(prev => ({ ...prev, image: url }));
          setImagePickerOpen(false);
        }}
        category="other"
        currentUrl={editForm.image || undefined}
      />
    </div>
  );
}
