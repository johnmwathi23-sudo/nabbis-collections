'use client';
import React, { useEffect, useState, useRef } from 'react';
import { DatabaseService } from '../lib/database';

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

interface ImagePickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  category?: string;
  currentUrl?: string;
}

export default function ImagePicker({ open, onClose, onSelect, category, currentUrl }: ImagePickerProps) {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadData, setUploadData] = useState({ name: '', alt: '', category: category || 'other' });
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!open) return;
    loadImages();
  }, [open, category]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const data = await DatabaseService.getSiteImages(category);
      setImages(data);
    } catch (e) {
      console.error('Failed to load images:', e);
    }
    setLoading(false);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    if (!uploadData.name) {
      setUploadData(prev => ({ ...prev, name: file.name.replace(/\.[^/.]+$/, '') }));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const bucket = category === 'hero' ? 'hero-images' : 
                     category === 'logo' ? 'site-assets' : 'site-assets';
      const result = await DatabaseService.uploadImage(selectedFile, bucket);
      await DatabaseService.createSiteImage({
        name: uploadData.name || selectedFile.name,
        url: result.path,
        alt: uploadData.alt,
        category: uploadData.category,
        file_size: selectedFile.size,
        mime_type: selectedFile.type,
      });
      setSelectedFile(null);
      setUploadData({ name: '', alt: '', category: category || 'other' });
      setActiveTab('gallery');
      loadImages();
    } catch (e) {
      console.error('Upload failed:', e);
    }
    setUploading(false);
  };

  const handleDelete = async (id: string, url: string) => {
    try {
      const path = url.split('/').pop();
      if (path) {
        const bucket = url.includes('hero-images') ? 'hero-images' : 'site-assets';
        await DatabaseService.deleteImage(bucket, path);
      }
      await DatabaseService.deleteSiteImage(id);
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
      <div style={{
        position: 'relative', width: '90vw', maxWidth: '800px', maxHeight: '85vh',
        background: 'white', borderRadius: '16px', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Image Picker</h2>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button onClick={() => setActiveTab('gallery')} style={{
              padding: '0.4rem 1rem', borderRadius: '8px', border: '1px solid #d1d5db',
              background: activeTab === 'gallery' ? '#3B0764' : 'white',
              color: activeTab === 'gallery' ? 'white' : '#374151',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
            }}>Gallery</button>
            <button onClick={() => setActiveTab('upload')} style={{
              padding: '0.4rem 1rem', borderRadius: '8px', border: '1px solid #d1d5db',
              background: activeTab === 'upload' ? '#3B0764' : 'white',
              color: activeTab === 'upload' ? 'white' : '#374151',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
            }}>Upload</button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '0 0.5rem', color: '#6b7280' }}>×</button>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
          {activeTab === 'gallery' ? (
            loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading images...</div>
            ) : images.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                <p>No images found. Switch to Upload tab to add some.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                {images.map(img => (
                  <div key={img.id} style={{
                    border: `2px solid ${currentUrl === img.url ? '#3B0764' : '#e5e7eb'}`,
                    borderRadius: '10px', overflow: 'hidden', cursor: 'pointer',
                    transition: 'border-color 0.15s',
                  }}
                    onClick={() => onSelect(img.url)}
                  >
                    <div style={{ width: '100%', height: '120px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      <img src={img.url} alt={img.alt || img.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '0.5rem' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.name}</p>
                      <p style={{ fontSize: '0.65rem', color: '#6b7280', margin: '2px 0 0' }}>{img.category}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(img.id, img.url); }} style={{
                      position: 'absolute', top: '4px', right: '4px',
                      background: 'rgba(239,68,68,0.9)', color: 'white', border: 'none',
                      borderRadius: '50%', width: '24px', height: '24px',
                      cursor: 'pointer', fontSize: '0.75rem', display: images.some(i => i.id === img.id) ? 'block' : 'none',
                      opacity: 0.8,
                    }}>×</button>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div>
              <div style={{
                border: `2px dashed ${dragOver ? '#3B0764' : '#d1d5db'}`,
                borderRadius: '12px', padding: '2rem', textAlign: 'center',
                background: dragOver ? '#faf5ff' : '#f9fafb',
                transition: 'all 0.15s', marginBottom: '1rem',
              }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]); }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input ref={fileInputRef} type="file" accept="image/*" hidden
                  onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }} />
                {selectedFile ? (
                  <div>
                    <p style={{ fontWeight: 600, margin: '0 0 4px' }}>{selectedFile.name}</p>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontWeight: 600, margin: '0 0 4px', color: '#374151' }}>
                      Drop an image or click to browse
                    </p>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>
                      PNG, JPG, WebP up to 10MB
                    </p>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                <input type="text" placeholder="Image name" value={uploadData.name}
                  onChange={(e) => setUploadData(prev => ({ ...prev, name: e.target.value }))}
                  style={{ padding: '0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }} />
                <input type="text" placeholder="Alt text (for accessibility)" value={uploadData.alt}
                  onChange={(e) => setUploadData(prev => ({ ...prev, alt: e.target.value }))}
                  style={{ padding: '0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }} />
              </div>

              <button onClick={handleUpload} disabled={!selectedFile || uploading} style={{
                width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none',
                background: !selectedFile ? '#d1d5db' : '#3B0764',
                color: 'white', fontWeight: 700, cursor: selectedFile ? 'pointer' : 'not-allowed',
                fontSize: '0.95rem',
              }}>
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
