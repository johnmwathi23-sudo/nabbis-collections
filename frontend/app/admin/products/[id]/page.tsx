"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getAdminProduct } from "@/lib/admin/queries"
import { updateProduct, deleteProduct } from "@/lib/admin/actions"
import { slugify, validateProduct } from "@/lib/admin/validation"
import { getAdminClient } from "@/lib/supabase/admin-client"
import { getAdminCategories } from "@/lib/admin/queries"
import { ArrowLeft, Save, Trash2, Eye } from "lucide-react"
import Link from "next/link"

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [product, cats] = await Promise.all([
          getAdminProduct(id),
          getAdminCategories(),
        ])
        if (!product) {
          router.push("/admin/products")
          return
        }
        setForm(product)
        setCategories(cats)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, router])

  const handleNameChange = (name: string) => {
    setForm((f: any) => ({
      ...f,
      name,
      slug: f.slug === slugify(f.name) || !f.slug ? slugify(name) : f.slug,
    }))
  }

  const handleChange = (field: string, value: any) => {
    setForm((f: any) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: "" }))
  }

  const handleSave = async () => {
    if (!form) return
    const validationErrors = validateProduct(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSaving(true)
    try {
      const supabase = getAdminClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase
        .from("products")
        .update({
          name: form.name,
          slug: form.slug,
          description: form.description || null,
          short_description: form.short_description || null,
          price: form.price,
          sale_price: form.sale_price || null,
          sku: form.sku || null,
          stock_quantity: form.stock_quantity,
          stock_status: form.stock_status,
          category_id: form.category_id || null,
          featured: form.featured,
          is_active: form.is_active,
          images: form.images,
          attributes: form.attributes,
        } as any)
        .eq("id", id)
        .select()
        .single()

      if (error) throw new Error(error.message)

      router.refresh()
      router.push("/admin/products")
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return
    try {
      const supabase = getAdminClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      await deleteProduct(id, user.id)
      router.push("/admin/products")
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

  if (!form) return null

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-sm text-gray-500 mt-1">{form.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/product/${form.slug}`}
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 border border-gray-300 rounded-lg hover:bg-blue-50"
          >
            <Eye size={16} />
            Preview
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50"
          >
            <Trash2 size={16} />
            Delete
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-purple-primary text-white rounded-lg hover:bg-purple-deep transition-colors text-sm font-medium disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input type="text" value={form.name} onChange={(e) => handleNameChange(e.target.value)} className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary ${errors.name ? "border-red-300" : "border-gray-300"}`} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => handleChange("slug", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description || ""} onChange={(e) => handleChange("description", e.target.value)} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
              <textarea value={form.short_description || ""} onChange={(e) => handleChange("short_description", e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Pricing & Inventory</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES) *</label>
                <input type="number" value={form.price} onChange={(e) => handleChange("price", Number(e.target.value))} className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary ${errors.price ? "border-red-300" : "border-gray-300"}`} min="0" />
                {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (KES)</label>
                <input type="number" value={form.sale_price || ""} onChange={(e) => handleChange("sale_price", e.target.value ? Number(e.target.value) : null)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary" min="0" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input type="text" value={form.sku || ""} onChange={(e) => handleChange("sku", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                <input type="number" value={form.stock_quantity} onChange={(e) => handleChange("stock_quantity", Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary" min="0" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
              <select value={form.stock_status} onChange={(e) => handleChange("stock_status", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary">
                <option value="instock">In Stock</option>
                <option value="outofstock">Out of Stock</option>
                <option value="onbackorder">On Backorder</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Publish</h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Status</span>
              <button onClick={() => handleChange("is_active", !form.is_active)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.is_active ? "bg-green-500" : "bg-gray-300"}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.is_active ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Featured</span>
              <button onClick={() => handleChange("featured", !form.featured)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.featured ? "bg-yellow-500" : "bg-gray-300"}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.featured ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Category</h2>
            <select value={form.category_id || ""} onChange={(e) => handleChange("category_id", e.target.value || null)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary">
              <option value="">Select category</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Images</h2>
            <div className="grid grid-cols-2 gap-2">
              {(form.images || []).map((img: any, i: number) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
