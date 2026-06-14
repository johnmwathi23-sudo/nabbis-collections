"use client"

import { useEffect, useState } from "react"
import { getAdminCustomers } from "@/lib/admin/queries"
import { updateUserRole } from "@/lib/admin/actions"
import { getAdminClient } from "@/lib/supabase/admin-client"
import { Search, Shield, ShieldCheck } from "lucide-react"

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [page, setPage] = useState(1)
  const perPage = 25

  const load = async () => {
    setLoading(true)
    try {
      const result = await getAdminCustomers({ page, per_page: perPage, search, role: roleFilter || undefined })
      setCustomers(result.customers)
      setTotal(result.total)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [page, search, roleFilter])

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Change this user's role to ${newRole}?`)) return
    try {
      const supabase = getAdminClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")
      await updateUserRole(userId, newRole, user.id)
      await load()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-sm text-gray-500 mt-1">{total} customers total</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search customers..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary" />
        </div>
        <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary">
          <option value="">All Roles</option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Phone</th>
                <th className="text-center px-4 py-3 font-medium">Role</th>
                <th className="text-right px-4 py-3 font-medium">Orders</th>
                <th className="text-right px-4 py-3 font-medium">Points</th>
                <th className="text-left px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {customer.first_name ? `${customer.first_name} ${customer.last_name || ""}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{customer.email || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{customer.phone || "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <select
                      value={customer.role}
                      onChange={(e) => handleRoleChange(customer.id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${
                        customer.role === "super_admin" ? "bg-purple-100 text-purple-700" :
                        customer.role === "admin" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-500">{customer.orders?.[0]?.count || 0}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-500">{customer.loyalty_points || 0}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(customer.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {customers.length === 0 && !loading && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500 text-sm">No customers found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">Previous</button>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
