"use client"

import { useEffect, useState } from "react"
import { getSiteSettings } from "@/lib/admin/queries"
import { updateSiteSetting } from "@/lib/admin/actions"
import { getAdminClient } from "@/lib/supabase/admin-client"
import { Save, Upload, X } from "lucide-react"

export default function AdminSiteSettingsPage() {
  const [settings, setSettings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("general")

  const load = async () => {
    setLoading(true)
    try {
      const data = await getSiteSettings()
      setSettings(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const getSetting = (key: string) => {
    return settings.find((s) => s.key === key)
  }

  const getValue = (key: string, defaultValue: any = "") => {
    const s = getSetting(key)
    if (!s) return defaultValue
    try {
      return typeof s.value === "string" ? JSON.parse(s.value) : s.value
    } catch {
      return s.value
    }
  }

  const handleSave = async (key: string, value: any) => {
    setSaving(key)
    try {
      const supabase = getAdminClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")
      await updateSiteSetting(key, value, user.id)
      await load()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(null)
    }
  }

  const [edits, setEdits] = useState<Record<string, any>>({})

  const setEdit = (key: string, value: any) => {
    setEdits((e) => ({ ...e, [key]: value }))
  }

  const getEdit = (key: string, defaultValue: any = "") => {
    if (key in edits) return edits[key]
    return getValue(key, defaultValue)
  }

  const hasChanges = (key: string) => {
    return JSON.stringify(getEdit(key)) !== JSON.stringify(getValue(key))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const tabs = [
    { id: "general", label: "General" },
    { id: "logo", label: "Logo & Brand" },
    { id: "announcement", label: "Announcement Bar" },
    { id: "trust", label: "Trust Badges" },
    { id: "seo", label: "SEO" },
    { id: "contact", label: "Contact" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Content</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your store&apos;s content and branding</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6 -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-purple-primary text-purple-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* General */}
        {activeTab === "general" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
            {["site_name", "site_tagline", "site_description", "footer_text"].map((key) => {
              const label = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={getEdit(key, "")}
                      onChange={(e) => setEdit(key, e.target.value)}
                      className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary ${hasChanges(key) ? "border-yellow-300 bg-yellow-50" : "border-gray-300"}`}
                    />
                    {hasChanges(key) && (
                      <button onClick={() => handleSave(key, getEdit(key))} disabled={saving === key} className="px-4 py-2 bg-purple-primary text-white rounded-lg text-sm hover:bg-purple-deep disabled:opacity-50 flex items-center gap-1">
                        <Save size={16} /> {saving === key ? "..." : "Save"}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Logo & Brand */}
        {activeTab === "logo" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Logo</h2>
              <p className="text-sm text-gray-500 mt-1">Upload your brand logo and favicon</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Logo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-primary transition-colors cursor-pointer">
                  <Upload size={32} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500">Click to upload logo</p>
                  <p className="text-xs text-gray-400 mt-1">Recommended: 400×100px, PNG/SVG</p>
                </div>
                <p className="text-xs text-gray-400 mt-2">Logo preview not available yet. Image upload via Supabase Storage bucket will be added.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-primary transition-colors cursor-pointer">
                  <Upload size={32} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500">Click to upload favicon</p>
                  <p className="text-xs text-gray-400 mt-1">Recommended: 32×32px, ICO/PNG</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Announcement Bar */}
        {activeTab === "announcement" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Announcement Bar</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const current = getEdit("announcement_bar", { enabled: false, text: "", bg_color: "#3B0764", text_color: "#FFFFFF" })
                  setEdit("announcement_bar", { ...current, enabled: !current.enabled })
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${getEdit("announcement_bar", {}).enabled ? "bg-green-500" : "bg-gray-300"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${getEdit("announcement_bar", {}).enabled ? "translate-x-6" : "translate-x-1"}`} />
              </button>
              <span className="text-sm text-gray-700">Enabled</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Text</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={getEdit("announcement_bar", { text: "" }).text}
                  onChange={(e) => setEdit("announcement_bar", { ...getEdit("announcement_bar", {}), text: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary"
                  placeholder="Free delivery for orders above KES 5,000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={getEdit("announcement_bar", {}).bg_color || "#3B0764"}
                    onChange={(e) => setEdit("announcement_bar", { ...getEdit("announcement_bar", {}), bg_color: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={getEdit("announcement_bar", {}).text_color || "#FFFFFF"}
                    onChange={(e) => setEdit("announcement_bar", { ...getEdit("announcement_bar", {}), text_color: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {hasChanges("announcement_bar") && (
              <button onClick={() => handleSave("announcement_bar", getEdit("announcement_bar"))} disabled={saving === "announcement_bar"} className="px-4 py-2 bg-purple-primary text-white rounded-lg text-sm hover:bg-purple-deep disabled:opacity-50 flex items-center gap-1">
                <Save size={16} /> {saving === "announcement_bar" ? "..." : "Save Changes"}
              </button>
            )}

            {/* Preview */}
            <div className="mt-4 p-4 rounded-lg flex items-center justify-center text-sm" style={{
              backgroundColor: getEdit("announcement_bar", {}).bg_color || "#3B0764",
              color: getEdit("announcement_bar", {}).text_color || "#FFFFFF",
            }}>
              {getEdit("announcement_bar", {}).text || "Preview: Announcement text appears here"}
            </div>
          </div>
        )}

        {/* Trust Badges */}
        {activeTab === "trust" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Trust Badges</h2>
            <p className="text-sm text-gray-500">Displayed on the homepage below the hero section</p>

            {(() => {
              const badges = getEdit("trust_badges", [])
              return badges.map((badge: any, i: number) => (
                <div key={i} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <input type="text" value={badge.title} onChange={(e) => {
                      const updated = [...badges]
                      updated[i] = { ...updated[i], title: e.target.value }
                      setEdit("trust_badges", updated)
                    }} className="px-2 py-1.5 border border-gray-300 rounded text-sm" placeholder="Title" />
                    <input type="text" value={badge.desc} onChange={(e) => {
                      const updated = [...badges]
                      updated[i] = { ...updated[i], desc: e.target.value }
                      setEdit("trust_badges", updated)
                    }} className="px-2 py-1.5 border border-gray-300 rounded text-sm" placeholder="Description" />
                    <input type="text" value={badge.icon} onChange={(e) => {
                      const updated = [...badges]
                      updated[i] = { ...updated[i], icon: e.target.value }
                      setEdit("trust_badges", updated)
                    }} className="px-2 py-1.5 border border-gray-300 rounded text-sm" placeholder="Icon name" />
                  </div>
                  <button onClick={() => {
                    const updated = badges.filter((_: any, j: number) => j !== i)
                    setEdit("trust_badges", updated)
                  }} className="p-1.5 text-gray-400 hover:text-red-500">
                    <X size={16} />
                  </button>
                </div>
              ))
            })()}

            <button onClick={() => {
              const current = getEdit("trust_badges", [])
              setEdit("trust_badges", [...current, { icon: "star", title: "", desc: "" }])
            }} className="text-sm text-purple-primary hover:text-purple-deep font-medium">
              + Add Badge
            </button>

            {hasChanges("trust_badges") && (
              <button onClick={() => handleSave("trust_badges", getEdit("trust_badges"))} disabled={saving === "trust_badges"} className="px-4 py-2 bg-purple-primary text-white rounded-lg text-sm hover:bg-purple-deep disabled:opacity-50 flex items-center gap-1">
                <Save size={16} /> {saving === "trust_badges" ? "..." : "Save Changes"}
              </button>
            )}
          </div>
        )}

        {/* SEO */}
        {activeTab === "seo" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">SEO Defaults</h2>
            <p className="text-sm text-gray-500">Default metadata for search engines and social sharing</p>

            {["og_title", "og_description", "og_image", "twitter_handle"].map((key) => {
              const label = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={getEdit("seo_defaults", {})[key] || ""}
                      onChange={(e) => setEdit("seo_defaults", { ...getEdit("seo_defaults", {}), [key]: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary"
                    />
                  </div>
                </div>
              )
            })}

            {hasChanges("seo_defaults") && (
              <button onClick={() => handleSave("seo_defaults", getEdit("seo_defaults"))} disabled={saving === "seo_defaults"} className="px-4 py-2 bg-purple-primary text-white rounded-lg text-sm hover:bg-purple-deep disabled:opacity-50 flex items-center gap-1">
                <Save size={16} /> {saving === "seo_defaults" ? "..." : "Save Changes"}
              </button>
            )}
          </div>
        )}

        {/* Contact */}
        {activeTab === "contact" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
            {["email", "phone_primary", "phone_secondary", "address"].map((key) => {
              const label = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <div className="flex gap-2">
                    <input
                      type={key === "email" ? "email" : "text"}
                      value={getEdit("contact_info", {})[key] || ""}
                      onChange={(e) => setEdit("contact_info", { ...getEdit("contact_info", {}), [key]: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary"
                    />
                  </div>
                </div>
              )
            })}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Social Links (JSON)</label>
              <textarea
                value={JSON.stringify(getEdit("social_links", {}), null, 2)}
                onChange={(e) => {
                  try { setEdit("social_links", JSON.parse(e.target.value)) }
                  catch { /* invalid JSON */ }
                }}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-primary"
              />
            </div>

            {hasChanges("contact_info") && (
              <button onClick={() => handleSave("contact_info", getEdit("contact_info"))} disabled={saving === "contact_info"} className="px-4 py-2 bg-purple-primary text-white rounded-lg text-sm hover:bg-purple-deep disabled:opacity-50 flex items-center gap-1">
                <Save size={16} /> {saving === "contact_info" ? "..." : "Save Changes"}
              </button>
            )}
            {hasChanges("social_links") && (
              <button onClick={() => handleSave("social_links", getEdit("social_links"))} disabled={saving === "social_links"} className="px-4 py-2 bg-purple-primary text-white rounded-lg text-sm hover:bg-purple-deep disabled:opacity-50 flex items-center gap-1">
                <Save size={16} /> {saving === "social_links" ? "..." : "Save Changes"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
