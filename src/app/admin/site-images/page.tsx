'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { Button } from '../../../components/Button';
import { TrashIcon, PlusIcon, UploadIcon } from '../../../components/Icons';
import { DatabaseService } from '../../../lib/database';
import styles from './site-images.module.css';

interface SiteImage {
  id: string;
  name: string;
  url: string;
  alt: string | null;
  category: string;
  file_size: number | null;
  mime_type: string | null;
  uploaded_by: string | null;
  created_at: string;
}

export default function SiteImagesManagerPage() {
  const router = useRouter();
  const { currentUser } = useApp();
  const [images, setImages] = useState<SiteImage[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    alt: '',
    category: 'other' as string,
    file: null as File | null,
  });

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    if (currentUser.role !== 'admin' && currentUser.role !== 'super_admin') {
      router.push('/account');
      return;
    }
    loadImages();
  }, [currentUser, router]);

  const loadImages = async () => {
    try {
      const data = await DatabaseService.getSiteImages();
      setImages(data);
    } catch (e) {
      console.error('Failed to load images:', e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm(prev => ({ ...prev, file: e.target.files![0] }));
      if (!uploadForm.name) {
        setUploadForm(prev => ({
          ...prev,
          file: e.target.files![0],
          name: e.target.files![0].name.replace(/\.[^/.]+$/, ''),
        }));
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.file) return;

    setUploading(true);

    try {
      const bucket = uploadForm.category === 'hero' ? 'hero-images' : 'site-assets';
      const result = await DatabaseService.uploadImage(uploadForm.file, bucket);

      await DatabaseService.createSiteImage({
        name: uploadForm.name || uploadForm.file.name,
        url: result.path,
        alt: uploadForm.alt,
        category: uploadForm.category,
        file_size: uploadForm.file.size,
        mime_type: uploadForm.file.type,
        uploaded_by: String(currentUser!.id),
      });

      setShowUploadForm(false);
      setUploadForm({ name: '', alt: '', category: 'other', file: null });
      loadImages();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (image: SiteImage) => {
    if (!confirm(`Delete "${image.name}"?`)) return;

    try {
      const path = image.url.split('/').pop();
      if (path) {
        const bucket = image.category === 'hero' ? 'hero-images' : 'site-assets';
        await DatabaseService.deleteImage(bucket, path);
      }
      await DatabaseService.deleteSiteImage(image.id);
      setImages(prev => prev.filter(img => img.id !== image.id));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      hero: '#e2e8f0',
      banner: '#fef3c7',
      promo: '#dcfce7',
      testimonial: '#fce7f3',
      logo: '#e0f2fe',
      other: '#f3f4f6',
    };
    return colors[category] || colors.other;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
    return <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>Verifying admin authorization...</div>;
  }

  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Site Images Manager</h1>
          <p style={{ color: 'var(--color-gray-600)' }}>
            Manage all site images including hero banners, promotional images, and testimonials
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowUploadForm(!showUploadForm)}
        >
          <PlusIcon size={16} /> Upload Image
        </Button>
      </div>

      {showUploadForm && (
        <div className={styles.sectionCard} style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Upload New Image</h2>
          <form onSubmit={handleUploadSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Image Name</label>
                <input
                  type="text"
                  required
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Summer Sale Banner"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Category</label>
                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                  className={styles.input}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="hero">Hero Section</option>
                  <option value="banner">Banner</option>
                  <option value="promo">Promotional</option>
                  <option value="testimonial">Testimonial</option>
                  <option value="logo">Logo</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                <label className={styles.label}>Alt Text</label>
                <input
                  type="text"
                  required
                  value={uploadForm.alt}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, alt: e.target.value }))}
                  placeholder="Descriptive text for accessibility"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                <label className={styles.label}>Image File</label>
                <div style={{ border: '2px dashed #d1d5db', borderRadius: '8px', padding: '2rem', textAlign: 'center', backgroundColor: '#f9fafb' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <UploadIcon size={32} color="var(--color-gray-600)" />
                    <span style={{ color: 'var(--color-gray-600)' }}>
                      {uploadForm.file ? uploadForm.file.name : 'Click to upload image or drag and drop'}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>
                      PNG, JPG, WEBP up to 10MB
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowUploadForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={uploading || !uploadForm.file}>
                {uploading ? 'Uploading...' : 'Upload Image'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.imagesGrid}>
        {images.length === 0 ? (
          <div className={styles.emptyState}>
            <UploadIcon size={48} color="var(--color-gray-400)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No Images Uploaded</h2>
            <p style={{ color: 'var(--color-gray-600)', marginBottom: '1.5rem' }}>
              Upload your first site image to get started
            </p>
            <Button
              variant="primary"
              onClick={() => setShowUploadForm(true)}
            >
              Upload Image
            </Button>
          </div>
        ) : (
          images.map((image) => (
            <div key={image.id} className={styles.imageCard}>
              <div className={styles.imagePreview}>
                <img
                  src={image.url}
                  alt={image.alt || image.name}
                  className={styles.image}
                />
                <div className={styles.imageOverlay}>
                  <span
                    className={styles.categoryBadge}
                    style={{ backgroundColor: getCategoryColor(image.category) }}
                  >
                    {image.category}
                  </span>
                </div>
              </div>
              <div className={styles.imageInfo}>
                <h3 className={styles.imageName}>{image.name}</h3>
                <p className={styles.imageAlt}>
                  Alt: {image.alt || '-'}
                </p>
                <div className={styles.imageMeta}>
                  <span>Uploaded: {new Date(image.created_at).toLocaleDateString()}</span>
                  <span>Size: {formatFileSize(image.file_size)}</span>
                </div>
              </div>
              <div className={styles.imageActions}>
                <button
                  onClick={() => handleDeleteImage(image)}
                  style={{ color: 'var(--color-error)', cursor: 'pointer' }}
                  aria-label="Delete Image"
                >
                  <TrashIcon size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
