"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase"
import type { Profile } from "@/lib/types"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Image,
  Settings,
  Menu,
  X,
  ChevronRight,
  LogOut,
  ChevronDown,
  Palette,
} from "lucide-react"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  children?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
  {
    label: "Products",
    href: "/admin/products",
    icon: <Package size={20} />,
    children: [
      { label: "All Products", href: "/admin/products" },
      { label: "Add New", href: "/admin/products/new" },
    ],
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: <Palette size={20} />,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: <ShoppingCart size={20} />,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: <Users size={20} />,
  },
  {
    label: "Hero Slides",
    href: "/admin/hero",
    icon: <Image size={20} />,
  },
  {
    label: "Site Content",
    href: "/admin/site",
    icon: <Settings size={20} />,
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(["Products"]))
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login?redirect=/admin")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
        router.push("/")
        return
      }

      setProfile(profile as Profile)
      setLoading(false)
    }

    checkAuth()
  }, [router])

  const handleSignOut = async () => {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const toggleSubmenu = (label: string) => {
    const next = new Set(expandedMenus)
    if (next.has(label)) next.delete(label)
    else next.add(label)
    setExpandedMenus(next)
  }

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link href="/admin" className="font-serif text-lg font-bold text-purple-deep">
            Nabbis Admin
          </Link>
          <button
            className="lg:hidden text-gray-500 hover:text-gray-900"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map((item) => {
            const active = isActive(item.href)
            const hasChildren = !!item.children

            return (
              <div key={item.href}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.label)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-purple-primary/10 text-purple-primary"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {item.icon}
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          expandedMenus.has(item.label) ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedMenus.has(item.label) && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.children.map((child) => {
                          const childActive = pathname === child.href
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                childActive
                                  ? "bg-purple-primary/10 text-purple-primary font-medium"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              {child.label}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-purple-primary/10 text-purple-primary"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16 flex items-center px-4 lg:px-6">
          <button
            className="lg:hidden mr-4 text-gray-500 hover:text-gray-900"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {profile?.first_name} {profile?.last_name}
              </p>
              <p className="text-xs text-gray-500 capitalize">{profile?.role?.replace("_", " ")}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
