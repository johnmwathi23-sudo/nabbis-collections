"use client"

import { useEffect, useState } from "react"
import { getHeroSlides } from "@/lib/admin/queries"
import { createHeroSlide, updateHeroSlide, deleteHeroSlide, reorderHeroSlides } from "@/lib/admin/actions"
import { getAdminClient } from "@/lib/supabase/admin-client"
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff, X, Save, ChevronUp, ChevronDown, Clock } from "lucide-react"

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    cta_text: "",
    cta_link: "",
    desktop_image_url: "",
    mobile_image_url: "",
    overlay_opacity: 0.4,
    text_color: "#FFFFFF",
    bg_color: "#3B0764",
    is_active: true,
    sort_order: 0,
    scheduled_from: "",
    scheduled_to: "",
  })

  const load = async () => {
    setLoading(true)
    try {
      const data = await getHeroSlides()
      setSlides(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const resetForm = () => {
    setForm({
      title: "", subtitle: "", cta_text: "", cta_link: "",
      desktop_image_url: "", mobile_image_url: "",
      overlay_opacity: 0.4, text_color: "#FFFFFF", bg_color: "#3B0764",
      is_active: true, sort_order: slides.length,
      scheduled_from: "", scheduled_to: "",
    })
    setEditingId(null)
    setShowEditor(false)
  }

  const startEdit = (slide: any) => {
    setForm({
      title: slide.title,
      subtitle: slide.subtitle || "",
      cta_text: slide.cta_text || "",
      cta_link: slide.cta_link || "",
      desktop_image_url: slide.desktop_image_url || "",
      mobile_image_url: slide.mobile_image_url || "",
      overlay_opacity: slide.overlay_opacity,
      text_color: slide.text_color,
      bg_color: slide.bg_color,
      is_active: slide.is_active,
      sort_order: slide.sort_order,
      scheduled_from: slide.scheduled_from?.slice(0, 16) || "",
      scheduled_to: slide.scheduled_to?.slice(0, 16) || "",
    })
    setEditingId(slide.id)
    setShowEditor(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) { alert("Title is required"); return }
    try {
      const supabase = getAdminClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const data = {
        ...form,
        subtitle: form.subtitle || null,
        cta_text: form.cta_text || null,
        cta_link: form.cta_link || null,
        desktop_image_url: form.desktop_image_url || null,
        mobile_image_url: form.mobile_image_url || null,
        scheduled_from: form.scheduled_from ? new Date(form.scheduled_from).toISOString() : null,
        scheduled_to: form.scheduled_to ? new Date(form.scheduled_to).toISOString() : null,
      }

      if (editingId) {
        await updateHeroSlide(editingId, data, user.id)
      } else {
        await createHeroSlide({ ...data, sort_order: slides.length }, user.id)
      }

      resetForm()
      await load()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this hero slide?")) return
    try {
      const supabase = getAdminClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")
      await deleteHeroSlide(id, user.id)
      await load()
    } catch (err: any) { alert(err.message) }
  }

  const handleToggle = async (id: string, is_active: boolean) => {
    try {
      const supabase = getAdminClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")
      await updateHeroSlide(id, { is_active }, user.id)
      await load()
    } catch (err: any) { alert(err.message) }
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return
    try {
      const supabase = getAdminClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const items = [
        { id: slides[index].id, sort_order: index - 1 },
        { id: slides[index - 1].id, sort_order: index },
      ]
      await reorderHeroSlides(items, user.id)
      await load()
    } catch (err: any) { alert(err.message) }
  }

  const handleMoveDown = async (index: number) => {
    if (index === slides.length - 1) return
    try {
      const supabase = getAdminClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const items = [
        { id: slides[index].id, sort_order: index + 1 },
        { id: slides[index + 1].id, sort_order: index },
      ]
      await reorderHeroSlides(items, user.id)
      await load()
    } catch (err: any) { alert(err.message) }
  }

  const isScheduled = (slide: any) => {
    if (!slide.scheduled_from && !slide.scheduled_to) return false
    const now = new Date()
    const from = slide.scheduled_from ? new Date(slide.scheduled_from) : null
    const to = slide.scheduled_to ? new Date(slide.scheduled_to) : null
    if (from && from > now) return "upcoming"
    if (to && to < now) return "expired"
    return "active"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hero Slides</h1>
          <p className="text-sm text-gray-500 mt-1">Manage homepage hero banners</p>
        </div>
        {!showEditor && (
          <button onClick={() => setShowEditor(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-primary text-white rounded-lg hover:bg-purple-deep text-sm font-medium">
            <Plus size={18} /> Add Slide
          </button>
        )}
      </div>

      {/* Editor */}
      {showEditor && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{editingId ? "Edit Slide" : "New Slide"}</h2>
            <button onClick={resetForm} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary" placeholder="Summer Collection 2026" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input type="text" value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary" placeholder="Discover our latest arrivals" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
                  <input type="text" value={form.cta_text} onChange={(e) => setForm((f) => ({ ...f, cta_text: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary" placeholder="Shop Now" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
                  <input type="text" value={form.cta_link} onChange={(e) => setForm((f) => ({ ...f, cta_link: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary" placeholder="/shop" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desktop Image URL</label>
                <input type="text" value={form.desktop_image_url} onChange={(e) => setForm((f) => ({ ...f, desktop_image_url: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Image URL</label>
                <input type="text" value={form.mobile_image_url} onChange={(e) => setForm((f) => ({ ...f, mobile_image_url: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary" placeholder="https://..." />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Overlay Opacity ({form.overlay_opacity})</label>
                <input type="range" min="0" max="1" step="0.05" value={form.overlay_opacity} onChange={(e) => setForm((f) => ({ ...f, overlay_opacity: parseFloat(e.target.value) }))} className="w-full" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={form.text_color} onChange={(e) => setForm((f) => ({ ...f, text_color: e.target.value }))} className="w-10 h-10 rounded cursor-pointer" />
                    <span className="text-xs text-gray-500 font-mono">{form.text_color}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={form.bg_color} onChange={(e) => setForm((f) => ({ ...f, bg_color: e.target.value }))} className="w-10 h-10 rounded cursor-pointer" />
                    <span className="text-xs text-gray-500 font-mono">{form.bg_color}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Schedule From</label>
                  <input type="datetime-local" value={form.scheduled_from} onChange={(e) => setForm((f) => ({ ...f, scheduled_from: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Schedule To</label>
                  <input type="datetime-local" value={form.scheduled_to} onChange={(e) => setForm((f) => ({ ...f, scheduled_to: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.is_active ? "bg-green-500" : "bg-gray-300"}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.is_active ? "translate-x-6" : "translate-x-1"}`} />
                </button>
                <span className="text-sm text-gray-700">{form.is_active ? "Active" : "Inactive"}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={resetForm} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-purple-primary text-white rounded-lg text-sm hover:bg-purple-deep">
              <Save size={16} />
              {editingId ? "Update" : "Create"}
            </button>
          </div>
        </div>
      )}

      {/* Slides List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <th className="w-20 px-4 py-3 font-medium">Order</th>
              <th className="text-left px-4 py-3 font-medium">Slide</th>
              <th className="text-left px-4 py-3 font-medium">CTA</th>
              <th className="text-center px-4 py-3 font-medium">Status</th>
              <th className="text-center px-4 py-3 font-medium">Schedule</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {slides.map((slide, i) => {
              const schedule = isScheduled(slide)
              return (
                <tr key={slide.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleMoveUp(i)} disabled={i === 0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                        <ChevronUp size={14} />
                      </button>
                      <span className="text-xs text-gray-400 w-4 text-center">{i + 1}</span>
                      <button onClick={() => handleMoveDown(i)} disabled={i === slides.length - 1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {slide.desktop_image_url ? (
                          <img src={slide.desktop_image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: slide.bg_color }}>
                            <span className="text-white text-[8px] font-bold uppercase opacity-50">{slide.title.slice(0, 3)}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{slide.title}</p>
                        {slide.subtitle && <p className="text-xs text-gray-500 truncate max-w-[200px]">{slide.subtitle}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {slide.cta_text ? `${slide.cta_text} →` : "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => handleToggle(slide.id, !slide.is_active)} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      !slide.is_active ? "bg-gray-100 text-gray-500" :
                      schedule === "upcoming" ? "bg-blue-100 text-blue-700" :
                      schedule === "expired" ? "bg-red-100 text-red-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {!slide.is_active ? "Draft" :
                       schedule === "upcoming" ? "Scheduled" :
                       schedule === "expired" ? "Expired" :
                       "Active"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {slide.scheduled_from ? (
                      <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{new Date(slide.scheduled_from).toLocaleDateString()}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Always</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => startEdit(slide)} className="p-2 text-gray-400 hover:text-purple-primary hover:bg-purple-50 rounded-lg"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(slide.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {slides.length === 0 && !loading && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500 text-sm">No hero slides yet. Click "Add Slide" to create one.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
