"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { createBrowserClient } from "@/lib/supabase";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    const checkAdmin = async () => {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (profile && (profile.role === "admin" || profile.role === "super_admin")) {
        setIsAdmin(true);
      }
    };
    checkAdmin();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="bg-purple-deep text-white text-center text-xs font-medium py-1.5 px-4">
        Free delivery for orders above KES 5,000 | Same day delivery in Nairobi
      </div>
      <div className="container-nabbis flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-serif text-xl font-bold text-purple-deep">
            NABBIS
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-purple-primary transition-colors">
              Home
            </Link>
            <Link href="/shop" className="text-sm font-medium text-gray-700 hover:text-purple-primary transition-colors">
              Shop
            </Link>
            <Link href="/shop?orderby=date" className="text-sm font-medium text-gray-700 hover:text-purple-primary transition-colors">
              New Arrivals
            </Link>
            <Link href="/shop?on_sale=true" className="text-sm font-medium text-gold hover:text-gold transition-colors">
              Sale
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-purple-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-purple-primary transition-colors">
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative text-gray-700 hover:text-purple-primary transition-colors" aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
          {isAdmin && (
            <Link href="/admin" className="text-sm font-medium text-purple-primary hover:text-purple-deep transition-colors hidden md:block">
              Admin
            </Link>
          )}
          <Link href="/account" className="text-gray-700 hover:text-purple-primary transition-colors hidden md:block" aria-label="Account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </Link>
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3">
          <Link href="/" className="block text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/shop" className="block text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link href="/shop?orderby=date" className="block text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>New Arrivals</Link>
          <Link href="/shop?on_sale=true" className="block text-sm font-medium text-gold" onClick={() => setMenuOpen(false)}>Sale</Link>
          <Link href="/about" className="block text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/contact" className="block text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Contact</Link>
          {isAdmin && (
            <Link href="/admin" className="block text-sm font-medium text-purple-primary" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
          )}
          <Link href="/account" className="block text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Account</Link>
        </div>
      )}
    </header>
  );
}
