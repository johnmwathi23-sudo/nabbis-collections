"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getAdminOrder } from "@/lib/admin/queries"
import { updateOrderStatus } from "@/lib/admin/actions"
import { getAdminClient } from "@/lib/supabase/admin-client"
import { ArrowLeft, Package, MapPin, CreditCard, Clock } from "lucide-react"

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const data = await getAdminOrder(id)
      if (!data) { router.push("/admin/orders"); return }
      setOrder(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id, router])

  const handleStatusChange = async (newStatus: string) => {
    try {
      const supabase = getAdminClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      await updateOrderStatus(id, newStatus, user.id)
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

  if (!order) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.slice(0, 8)}</h1>
          <p className="text-sm text-gray-500 mt-1">{new Date(order.created_at).toLocaleString()}</p>
        </div>
      </div>

      {/* Status Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Update Status:</span>
          {["pending", "processing", "completed", "cancelled", "refunded"].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                order.status === status
                  ? "bg-purple-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package size={20} className="text-purple-primary" />
            Items
          </h2>
          <div className="space-y-3">
            {(order.order_items || []).map((item: any) => (
              <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-14 h-14 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product_image ? (
                    <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                  <p className="text-xs text-gray-500">SKU: {item.product_sku || "—"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">KES {Number(item.unit_price).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">× {item.quantity}</p>
                </div>
                <div className="text-right min-w-[80px]">
                  <p className="text-sm font-medium text-gray-900">KES {Number(item.subtotal).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium">KES {Number(order.subtotal).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="font-medium">KES {Number(order.shipping_total).toLocaleString()}</span></div>
            {Number(order.discount_total) > 0 && (
              <div className="flex justify-between"><span className="text-gray-500">Discount</span><span className="font-medium text-green-600">-KES {Number(order.discount_total).toLocaleString()}</span></div>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span><span>KES {Number(order.total).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Customer</h2>
            {order.profiles ? (
              <div className="text-sm space-y-1">
                <p className="font-medium text-gray-900">
                  {order.profiles.first_name} {order.profiles.last_name}
                </p>
                <p className="text-gray-500">{order.profiles.email}</p>
                <p className="text-gray-500">{order.profiles.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Guest</p>
            )}
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin size={16} className="text-purple-primary" />
              Shipping Address
            </h2>
            {order.shipping_address && (
              <div className="text-sm text-gray-600 space-y-0.5">
                <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                <p>{order.shipping_address.address_line1}</p>
                {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                <p>{order.shipping_address.city}, {order.shipping_address.county}</p>
                <p>{order.shipping_address.phone}</p>
              </div>
            )}
            {order.delivery_eta && (
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                <Clock size={14} />
                ETA: {order.delivery_eta}
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard size={16} className="text-purple-primary" />
              Payment
            </h2>
            <div className="text-sm space-y-2">
              <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="font-medium">{order.payment_method || "—"}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Status</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  order.payment_status === "paid" ? "bg-green-100 text-green-700" :
                  order.payment_status === "failed" ? "bg-red-100 text-red-700" :
                  "bg-yellow-100 text-yellow-700"
                }`}>{order.payment_status}</span>
              </div>
              {order.mpesa_receipt && (
                <div className="flex justify-between"><span className="text-gray-500">Receipt</span><span className="font-mono text-xs">{order.mpesa_receipt}</span></div>
              )}
            </div>
          </div>

          {order.notes && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Notes</h2>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
