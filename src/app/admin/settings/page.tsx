'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { Button } from '../../../components/Button';
import { SiteSetting } from '../../../lib/types';
import ImagePicker from '../../../components/ImagePicker';

export default function AdminSettingsPage() {
  const router = useRouter();
  const { currentUser, siteSettings, loadAdminData, updateSiteSetting, createAuditEntry } = useApp();
  const [saving, setSaving] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [imagePickerKey, setImagePickerKey] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) { router.push('/login'); return; }
    if (currentUser.role !== 'admin' && currentUser.role !== 'super_admin') { router.push('/account'); return; }
    loadAdminData();
  }, [currentUser, router, loadAdminData]);

  useEffect(() => {
    if (siteSettings.length === 0) return;
    setFormValues(prev => {
      const vals = { ...prev };
      let changed = false;
      siteSettings.forEach(s => {
        const v = s.value;
        const str = typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v);
        if (vals[s.key] !== str) { vals[s.key] = str; changed = true; }
      });
      return changed ? vals : prev;
    });
  }, [siteSettings]);

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
    return <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>Verifying admin authorization...</div>;
  }

  const handleSave = async (setting: SiteSetting) => {
    setSaving(setting.key);
    try {
      let parsed: string | Record<string, unknown>;
      try {
        parsed = JSON.parse(formValues[setting.key]) as Record<string, unknown>;
      } catch {
        parsed = formValues[setting.key];
      }
      await updateSiteSetting(setting.key, parsed);
      await createAuditEntry('update', 'site_setting', setting.key, { key: setting.key });
    } catch (err) {
      console.error('Failed to save setting:', err);
    } finally {
      setSaving(null);
    }
  };

  const getSettingLabel = (key: string): string => {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const isJsonField = (setting: SiteSetting): boolean => {
    const jsonKeys = ['social_links', 'trust_badges', 'seo_defaults', 'contact_info', 'site_logo', 'site_favicon', 'announcement_bar'];
    return jsonKeys.includes(setting.key);
  };

  const getImageUrl = (key: string): string | null => {
    try {
      const val = JSON.parse(formValues[key] || '{}');
      return val?.url || null;
    } catch { return null; }
  };

  const handleImageSelect = (url: string) => {
    if (!imagePickerKey) return;
    try {
      const current = JSON.parse(formValues[imagePickerKey] || '{}');
      current.url = url;
      setFormValues(p => ({ ...p, [imagePickerKey]: JSON.stringify(current, null, 2) }));
    } catch {
      setFormValues(p => ({ ...p, [imagePickerKey]: JSON.stringify({ url }, null, 2) }));
    }
    setImagePickerKey(null);
  };

  const categorizedSettings: Record<string, SiteSetting[]> = {
    'Branding': siteSettings.filter(s => ['site_name', 'site_tagline', 'site_description', 'site_logo', 'site_favicon'].includes(s.key)),
    'Announcement': siteSettings.filter(s => ['announcement_bar'].includes(s.key)),
    'Social & Contact': siteSettings.filter(s => ['social_links', 'contact_info', 'footer_text'].includes(s.key)),
    'SEO': siteSettings.filter(s => ['seo_defaults'].includes(s.key)),
    'Trust Badges': siteSettings.filter(s => ['trust_badges'].includes(s.key)),
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Site Settings</h1>
        <p style={{ color: 'var(--color-gray-600)' }}>Configure global site settings, branding, and metadata</p>
      </div>

      {Object.entries(categorizedSettings).map(([category, settings]) => (
        <div key={category} style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-black)' }}>{category}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {settings.map(setting => (
              <div key={setting.key} style={{
                background: 'white', borderRadius: '12px', border: '1px solid var(--color-gray-200)',
                padding: '1.25rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{getSettingLabel(setting.key)}</h3>
                    {setting.description && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', marginTop: '2px' }}>{setting.description}</p>
                    )}
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSave(setting)}
                    disabled={saving === setting.key}
                  >
                    {saving === setting.key ? 'Saving...' : 'Save'}
                  </Button>
                </div>
                {setting.key === 'site_logo' || setting.key === 'site_favicon' ? (
                  <div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      {getImageUrl(setting.key) && (
                        <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb', flexShrink: 0, background: '#f9fafb' }}>
                          <img src={getImageUrl(setting.key)!} alt={setting.key}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                      )}
                      <Button variant="secondary" size="sm" onClick={() => setImagePickerKey(setting.key)}>
                        Browse Images
                      </Button>
                    </div>
                    <textarea
                      value={formValues[setting.key] || ''}
                      onChange={(e) => setFormValues(p => ({ ...p, [setting.key]: e.target.value }))}
                      rows={3}
                      style={{
                        width: '100%', padding: '0.6rem', border: '1px solid #d1d5db',
                        borderRadius: '6px', fontSize: '0.85rem', fontFamily: 'monospace',
                        resize: 'vertical', outline: 'none',
                        whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                      }}
                    />
                  </div>
                ) : isJsonField(setting) ? (
                  <textarea
                    value={formValues[setting.key] || ''}
                    onChange={(e) => setFormValues(p => ({ ...p, [setting.key]: e.target.value }))}
                    rows={5}
                    style={{
                      width: '100%', padding: '0.6rem', border: '1px solid #d1d5db',
                      borderRadius: '6px', fontSize: '0.85rem', fontFamily: 'monospace',
                      resize: 'vertical', outline: 'none',
                      whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                    }}
                  />
                ) : (
                  <input
                    type="text"
                    value={formValues[setting.key] || ''}
                    onChange={(e) => setFormValues(p => ({ ...p, [setting.key]: e.target.value }))}
                    style={{
                      width: '100%', padding: '0.6rem', border: '1px solid #d1d5db',
                      borderRadius: '6px', fontSize: '0.9rem', outline: 'none',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <ImagePicker
        open={imagePickerKey !== null}
        onClose={() => setImagePickerKey(null)}
        onSelect={handleImageSelect}
        category="logo"
        currentUrl={imagePickerKey ? getImageUrl(imagePickerKey) || undefined : undefined}
      />

      {siteSettings.length === 0 && (
        <div style={{
          background: 'white', borderRadius: '12px', border: '1px solid var(--color-gray-200)',
          padding: '3rem', textAlign: 'center', color: 'var(--color-gray-500)',
        }}>
          <p>No settings loaded. Ensure the site_settings table exists in the database.</p>
        </div>
      )}
    </div>
  );
}
