"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAdminClient } from "@/lib/supabase/admin-client"
import { getAdminCategories } from "@/lib/admin/queries"
import { slugify, validateProduct } from "@/lib/admin/validation"
import { ArrowLeft, Save, Eye, EyeOff, Plus, X, Upload } from "lucide-react"

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    price: 0,
    sale_price: null as number | null,
    sku: "",
    stock_quantity: 0,
    stock_status: "instock" as const,
    category_id: "",
    featured: false,
    is_active: true,
    images: [] as { url: string; alt: string }[],
    attributes: {} as Record<string, string[]>,
  })

  useEffect(() => {
    getAdminCategories().then(setCategories).catch(console.error)
  }, [])

  const handleNameChange = (name: string) => {
    setForm((f) => ({
      ...f,
      name,
      slug: f.slug === slugify(f.name) || !f.slug ? slugify(name) : f.slug,
    }))
  }

  const handleChange = (field: string, value: any) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: "" }))
  }

  const handleImageAdd = () => {
    const url = prompt("Enter image URL:")
    if (url) {
      setForm((f) => ({ ...f, images: [...f.images, { url, alt: form.name || "" }] }))
    }
  }

  const handleImageRemove = (index: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }))
  }

  const handleSave = async () => {
    const validationErrors = validateProduct(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSaving(true)
    try {
      const supabaseAny = getAdminClient() as any
      const { data: { user } } = await supabaseAny.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { data: product, error } = await supabaseAny
        .from("products")
        .insert({
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
        })
        .select()
        .single()

      if (error) throw new Error(error.message)

      router.push("/admin/products")
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Product</h1>
            <p className="text-sm text-gray-500 mt-1">Add a new product to your store</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-purple-primary text-white rounded-lg hover:bg-purple-deep transition-colors text-sm font-medium disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary ${errors.name ? "border-red-300" : "border-gray-300"}`}
                placeholder="e.g. Premium Leather Handbag"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary ${errors.slug ? "border-red-300" : "border-gray-300"}`}
                placeholder="premium-leather-handbag"
              />
              {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary"
                placeholder="Full product description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
              <textarea
                value={form.short_description}
                onChange={(e) => handleChange("short_description", e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary"
                placeholder="Brief description for product cards..."
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Pricing & Inventory</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES) *</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => handleChange("price", Number(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary ${errors.price ? "border-red-300" : "border-gray-300"}`}
                  min="0"
                />
                {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (KES)</label>
                <input
                  type="number"
                  value={form.sale_price || ""}
                  onChange={(e) => handleChange("sale_price", e.target.value ? Number(e.target.value) : null)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary ${errors.sale_price ? "border-red-300" : "border-gray-300"}`}
                  min="0"
                />
                {errors.sale_price && <p className="text-xs text-red-500 mt-1">{errors.sale_price}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => handleChange("sku", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary"
                  placeholder="NAB-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                <input
                  type="number"
                  value={form.stock_quantity}
                  onChange={(e) => handleChange("stock_quantity", Number(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary ${errors.stock_quantity ? "border-red-300" : "border-gray-300"}`}
                  min="0"
                />
                {errors.stock_quantity && <p className="text-xs text-red-500 mt-1">{errors.stock_quantity}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
              <select
                value={form.stock_status}
                onChange={(e) => handleChange("stock_status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary"
              >
                <option value="instock">In Stock</option>
                <option value="outofstock">Out of Stock</option>
                <option value="onbackorder">On Backorder</option>
              </select>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Images</h2>
            <div className="grid grid-cols-4 gap-3">
              {form.images.map((img, i) => (
                <div key={i} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleImageRemove(i)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                  <input
                    type="text"
                    value={img.alt}
                    onChange={(e) => {
                      const updated = [...form.images]
                      updated[i] = { ...updated[i], alt: e.target.value }
                      handleChange("images", updated)
                    }}
                    className="absolute bottom-0 left-0 right-0 px-2 py-1 text-xs bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    placeholder="Alt text"
                  />
                </div>
              ))}
              <button
                onClick={handleImageAdd}
                className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-primary hover:border-purple-primary transition-colors"
              >
                <Plus size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Publish</h2>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Status</span>
              <button
                onClick={() => handleChange("is_active", !form.is_active)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.is_active ? "bg-green-500" : "bg-gray-300"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.is_active ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Featured</span>
              <button
                onClick={() => handleChange("featured", !form.featured)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.featured ? "bg-yellow-500" : "bg-gray-300"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.featured ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Category</h2>
            <select
              value={form.category_id}
              onChange={(e) => handleChange("category_id", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
