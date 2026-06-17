"use client"

import { useEffect, useState } from "react"
import { getAdminCategories } from "@/lib/admin/queries"
import { createCategory, updateCategory, deleteCategory, reorderCategories } from "@/lib/admin/actions"
import { getAdminClient } from "@/lib/supabase/admin-client"
import { slugify } from "@/lib/admin/validation"
import { Plus, Edit, Trash2, GripVertical, Save, X, Eye, EyeOff } from "lucide-react"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newForm, setNewForm] = useState({ name: "", slug: "", description: "", sort_order: 0, is_active: true })
  const [editForm, setEditForm] = useState<any>(null)
  const [showNew, setShowNew] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const cats = await getAdminCategories()
      setCategories(cats)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleNewName = (name: string) => {
    setNewForm((f) => ({
      ...f,
      name,
      slug: f.slug === slugify(f.name) || !f.slug ? slugify(name) : f.slug,
    }))
  }

  const handleCreate = async () => {
    if (!newForm.name.trim()) return
    try {
      const supabase = getAdminClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      await createCategory({
        name: newForm.name,
        slug: newForm.slug || slugify(newForm.name),
        description: newForm.description || null,
        sort_order: categories.length,
        is_active: true,
      }, user.id)

      setShowNew(false)
      setNewForm({ name: "", slug: "", description: "", sort_order: 0, is_active: true })
      await load()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const startEdit = (cat: any) => {
    setEditingId(cat.id)
    setEditForm({ ...cat })
  }

  const handleEditSave = async () => {
    if (!editForm) return
    try {
      const supabase = getAdminClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      await updateCategory(editingId!, {
        name: editForm.name,
        slug: editForm.slug,
        description: editForm.description || null,
        is_active: editForm.is_active,
      }, user.id)

      setEditingId(null)
      setEditForm(null)
      await load()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Products in this category will be uncategorized.")) return
    try {
      const supabase = getAdminClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      await deleteCategory(id, user.id)
      await load()
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">{categories.length} categories</p>
        </div>
        <button
          onClick={() => setShowNew(!showNew)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-primary text-white rounded-lg hover:bg-purple-deep transition-colors text-sm font-medium"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {showNew && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input type="text" value={newForm.name} onChange={(e) => handleNewName(e.target.value)} placeholder="Category name" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary" />
            <input type="text" value={newForm.slug} onChange={(e) => setNewForm((f) => ({ ...f, slug: e.target.value }))} placeholder="slug" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary" />
            <input type="text" value={newForm.description} onChange={(e) => setNewForm((f) => ({ ...f, description: e.target.value }))} placeholder="Description (optional)" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} className="px-4 py-2 bg-purple-primary text-white rounded-lg text-sm hover:bg-purple-deep">Create</button>
            <button onClick={() => setShowNew(false)} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <th className="w-10 px-4 py-3"></th>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Slug</th>
              <th className="text-left px-4 py-3 font-medium">Products</th>
              <th className="text-center px-4 py-3 font-medium">Active</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                {editingId === cat.id ? (
                  <>
                    <td className="px-4 py-3">
                      <GripVertical size={16} className="text-gray-300 cursor-grab" />
                    </td>
                    <td className="px-4 py-3">
                      <input type="text" value={editForm?.name || ""} onChange={(e) => setEditForm((f: any) => ({ ...f, name: e.target.value }))} className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
                    </td>
                    <td className="px-4 py-3">
                      <input type="text" value={editForm?.slug || ""} onChange={(e) => setEditForm((f: any) => ({ ...f, slug: e.target.value }))} className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{cat.products?.[0]?.count || 0}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => setEditForm((f: any) => ({ ...f, is_active: !f.is_active }))} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${editForm?.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {editForm?.is_active ? "Active" : "Draft"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={handleEditSave} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Save"><Save size={16} /></button>
                        <button onClick={() => { setEditingId(null); setEditForm(null) }} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg" title="Cancel"><X size={16} /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3">
                      <GripVertical size={16} className="text-gray-300 cursor-grab" />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{cat.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{cat.slug}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{cat.products?.[0]?.count || 0}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cat.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {cat.is_active ? "Active" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => startEdit(cat)} className="p-2 text-gray-400 hover:text-purple-primary hover:bg-purple-50 rounded-lg"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(cat.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-500 text-sm">No categories yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
