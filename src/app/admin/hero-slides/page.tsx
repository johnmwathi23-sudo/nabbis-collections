'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { Button } from '../../../components/Button';
import { PlusIcon, TrashIcon, EditIcon } from '../../../components/Icons';
import type { HeroSlide } from '../../../lib/types';
import ImagePicker from '../../../components/ImagePicker';

const emptySlide = {
  title: '',
  subtitle: '',
  cta_text: '',
  cta_link: '',
  desktop_image_url: '',
  mobile_image_url: '',
  overlay_opacity: 0.4,
  text_color: '#FFFFFF',
  bg_color: '#3B0764',
  sort_order: 0,
  is_active: true,
  scheduled_from: null as string | null,
  scheduled_to: null as string | null,
  created_by: null as string | null,
};

export default function AdminHeroSlidesPage() {
  const router = useRouter();
  const { currentUser, heroSlides, loadAdminData, createHeroSlide, updateHeroSlide, deleteHeroSlide, createAuditEntry } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptySlide);
  const [imagePickerField, setImagePickerField] = useState<'desktop' | 'mobile' | null>(null);

  useEffect(() => {
    if (!currentUser) { router.push('/login'); return; }
    if (currentUser.role !== 'admin' && currentUser.role !== 'super_admin') { router.push('/account'); return; }
    loadAdminData();
  }, [currentUser, router, loadAdminData]);

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
    return <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>Verifying admin authorization...</div>;
  }

  const resetForm = () => {
    setForm(emptySlide);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (slide: HeroSlide) => {
    setForm({
      title: slide.title,
      subtitle: slide.subtitle || '',
      cta_text: slide.cta_text || '',
      cta_link: slide.cta_link || '',
      desktop_image_url: slide.desktop_image_url || '',
      mobile_image_url: slide.mobile_image_url || '',
      overlay_opacity: slide.overlay_opacity,
      text_color: slide.text_color,
      bg_color: slide.bg_color,
      sort_order: slide.sort_order,
      is_active: slide.is_active,
      scheduled_from: slide.scheduled_from,
      scheduled_to: slide.scheduled_to,
      created_by: slide.created_by,
    });
    setEditingId(slide.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateHeroSlide(editingId, form as any);
      await createAuditEntry('update', 'hero_slide', editingId, { title: form.title });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await createHeroSlide({ ...form, created_by: String(currentUser.id) } as any);
      await createAuditEntry('create', 'hero_slide', undefined, { title: form.title });
    }
    resetForm();
  };

  const handleDelete = async (slide: HeroSlide) => {
    if (!confirm(`Delete slide "${slide.title}"?`)) return;
    await deleteHeroSlide(slide.id);
    await createAuditEntry('delete', 'hero_slide', slide.id, { title: slide.title });
  };

  const handleToggle = async (slide: HeroSlide) => {
    await updateHeroSlide(slide.id, { is_active: !slide.is_active });
  };

  const sortedSlides = [...heroSlides].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Hero Slides</h1>
          <p style={{ color: 'var(--color-gray-600)' }}>Manage the homepage carousel slideshow</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => { resetForm(); setShowForm(!showForm); }}>
          <PlusIcon size={16} /> {showForm ? 'Cancel' : 'New Slide'}
        </Button>
      </div>

      {showForm && (
        <div style={{
          background: 'white', borderRadius: '12px', border: '1px solid var(--color-gray-200)',
          padding: '1.5rem', marginBottom: '2rem',
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            {editingId ? 'Edit Slide' : 'New Slide'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Title *</label>
                <input type="text" required value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Sort Order</label>
                <input type="number" value={form.sort_order} onChange={(e) => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Subtitle</label>
                <input type="text" value={form.subtitle} onChange={(e) => setForm(p => ({ ...p, subtitle: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>CTA Text</label>
                <input type="text" value={form.cta_text} onChange={(e) => setForm(p => ({ ...p, cta_text: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>CTA Link</label>
                <input type="text" value={form.cta_link} onChange={(e) => setForm(p => ({ ...p, cta_link: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Desktop Image</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="url" value={form.desktop_image_url} onChange={(e) => setForm(p => ({ ...p, desktop_image_url: e.target.value }))}
                    style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px' }} />
                  <Button type="button" variant="secondary" size="sm" onClick={() => setImagePickerField('desktop')}>
                    Browse
                  </Button>
                </div>
                {form.desktop_image_url && (
                  <div style={{ marginTop: '0.5rem', width: '120px', height: '70px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                    <img src={form.desktop_image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Mobile Image</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="url" value={form.mobile_image_url} onChange={(e) => setForm(p => ({ ...p, mobile_image_url: e.target.value }))}
                    style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px' }} />
                  <Button type="button" variant="secondary" size="sm" onClick={() => setImagePickerField('mobile')}>
                    Browse
                  </Button>
                </div>
                {form.mobile_image_url && (
                  <div style={{ marginTop: '0.5rem', width: '120px', height: '70px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                    <img src={form.mobile_image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Background Color</label>
                <input type="color" value={form.bg_color} onChange={(e) => setForm(p => ({ ...p, bg_color: e.target.value }))}
                  style={{ width: '100%', height: '38px', padding: '2px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Text Color</label>
                <input type="color" value={form.text_color} onChange={(e) => setForm(p => ({ ...p, text_color: e.target.value }))}
                  style={{ width: '100%', height: '38px', padding: '2px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Overlay Opacity ({form.overlay_opacity})</label>
                <input type="range" min="0" max="1" step="0.05" value={form.overlay_opacity}
                  onChange={(e) => setForm(p => ({ ...p, overlay_opacity: parseFloat(e.target.value) }))}
                  style={{ width: '100%' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm(p => ({ ...p, is_active: e.target.checked }))} />
                  Active
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit" variant="primary">{editingId ? 'Update' : 'Create'} Slide</Button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sortedSlides.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--color-gray-200)', padding: '3rem', textAlign: 'center', color: 'var(--color-gray-500)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No hero slides yet</p>
            <p style={{ fontSize: '0.9rem' }}>Create your first slide to display on the homepage carousel</p>
          </div>
        ) : (
          sortedSlides.map((slide) => (
            <div key={slide.id} style={{
              background: 'white', borderRadius: '12px', border: '1px solid var(--color-gray-200)',
              padding: '1.25rem', display: 'flex', gap: '1.25rem', alignItems: 'center',
              opacity: slide.is_active ? 1 : 0.5,
            }}>
              <div style={{
                width: '120px', height: '70px', borderRadius: '8px',
                background: slide.bg_color, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: slide.text_color, fontSize: '0.7rem', fontWeight: 700, textAlign: 'center',
                padding: '0.5rem', overflow: 'hidden',
              }}>
                {slide.desktop_image_url ? (
                  <img src={slide.desktop_image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                ) : (
                  slide.title
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <strong style={{ fontSize: '1rem' }}>{slide.title}</strong>
                  <span style={{
                    padding: '2px 8px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700,
                    background: slide.is_active ? '#d1fae5' : '#f3f4f6',
                    color: slide.is_active ? '#065f46' : '#6b7280',
                  }}>
                    {slide.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>Order: {slide.sort_order}</span>
                </div>
                {slide.subtitle && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-600)', marginBottom: '0.25rem' }}>{slide.subtitle}</p>
                )}
                {slide.cta_text && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>CTA: {slide.cta_text} → {slide.cta_link}</p>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                <button onClick={() => handleToggle(slide)} style={{
                  padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db',
                  background: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                }}>
                  {slide.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => handleEdit(slide)} style={{ color: 'var(--color-purple)', cursor: 'pointer', padding: '4px' }} aria-label="Edit slide">
                  <EditIcon size={18} />
                </button>
                <button onClick={() => handleDelete(slide)} style={{ color: 'var(--color-error)', cursor: 'pointer', padding: '4px' }} aria-label="Delete slide">
                  <TrashIcon size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ImagePicker
        open={imagePickerField !== null}
        onClose={() => setImagePickerField(null)}
        onSelect={(url) => {
          if (imagePickerField === 'desktop') setForm(p => ({ ...p, desktop_image_url: url }));
          if (imagePickerField === 'mobile') setForm(p => ({ ...p, mobile_image_url: url }));
          setImagePickerField(null);
        }}
        category="hero"
        currentUrl={imagePickerField === 'desktop' ? form.desktop_image_url : imagePickerField === 'mobile' ? form.mobile_image_url : undefined}
      />
    </div>
  );
}
