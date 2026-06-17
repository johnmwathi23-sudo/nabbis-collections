"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getDashboardStats, getRecentOrders, getRevenueChartData } from "@/lib/admin/queries"
import type { DashboardStats } from "@/lib/types"
import {
  ShoppingCart,
  TrendingUp,
  Package,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
} from "lucide-react"

function StatCard({
  title,
  value,
  icon,
  color,
  href,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  href?: string
}) {
  const content = (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }
  return content
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
    paid: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  )
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [revenueData, setRevenueData] = useState<{ date: string; revenue: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, ordersData, revenue] = await Promise.all([
          getDashboardStats(),
          getRecentOrders(10),
          getRevenueChartData(30),
        ])
        setStats(statsData)
        setRecentOrders(ordersData)
        setRevenueData(revenue)
      } catch (err) {
        console.error("Failed to load dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={<ShoppingCart size={20} className="text-white" />}
          color="bg-purple-primary"
          href="/admin/orders"
        />
        <StatCard
          title="Revenue"
          value={`KES ${(stats?.totalRevenue || 0).toLocaleString()}`}
          icon={<TrendingUp size={20} className="text-white" />}
          color="bg-gold"
        />
        <StatCard
          title="Products"
          value={`${stats?.activeProducts || 0}/${stats?.totalProducts || 0}`}
          icon={<Package size={20} className="text-white" />}
          color="bg-blue-600"
          href="/admin/products"
        />
        <StatCard
          title="Customers"
          value={stats?.totalCustomers || 0}
          icon={<Users size={20} className="text-white" />}
          color="bg-green-600"
          href="/admin/customers"
        />
      </div>

      {/* Order Status Breakdown */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <Clock size={20} className="text-yellow-500" />
            <div>
              <p className="text-lg font-bold text-gray-900">{stats.pendingOrders}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <AlertCircle size={20} className="text-blue-500" />
            <div>
              <p className="text-lg font-bold text-gray-900">{stats.processingOrders}</p>
              <p className="text-xs text-gray-500">Processing</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-green-500" />
            <div>
              <p className="text-lg font-bold text-gray-900">{stats.completedOrders}</p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <XCircle size={20} className="text-red-500" />
            <div>
              <p className="text-lg font-bold text-gray-900">{stats.cancelledOrders}</p>
              <p className="text-xs text-gray-500">Cancelled</p>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Chart (simple bar) */}
      {revenueData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue (Last 30 Days)</h2>
          <div className="flex items-end gap-1 h-32">
            {revenueData.map((day) => {
              const max = Math.max(...revenueData.map((d) => d.revenue))
              const height = max > 0 ? (day.revenue / max) * 100 : 0
              return (
                <div
                  key={day.date}
                  className="flex-1 bg-purple-primary/20 hover:bg-purple-primary/40 rounded-t transition-colors relative group"
                  style={{ height: `${Math.max(height, 2)}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                    KES {day.revenue.toLocaleString()}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-purple-primary hover:text-purple-deep font-medium">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-medium">Order</th>
                <th className="text-left px-4 py-3 font-medium">Customer</th>
                <th className="text-left px-4 py-3 font-medium">Total</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Payment</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-sm font-medium text-purple-primary hover:text-purple-deep">
                      #{order.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {order.profiles?.first_name
                      ? `${order.profiles.first_name} ${order.profiles.last_name || ""}`
                      : order.profiles?.email || "Guest"}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    KES {Number(order.total).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.payment_status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500 text-sm">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
