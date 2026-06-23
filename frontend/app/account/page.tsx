"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createBrowserClient } from "@/lib/supabase";
import type { Profile } from "@/lib/types";

export default function AccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          setProfile(data as Profile);
          setLoading(false);
        });
    });
  }, [router]);

  const handleLogout = async () => {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="container-nabbis py-12 text-center min-h-[60vh]">
          <p className="text-gray-500">Loading...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container-nabbis py-12 min-h-[60vh]">
        <h1 className="font-serif text-3xl font-bold mb-8">My Account</h1>
        <div className="grid md:grid-cols-4 gap-8">
          <aside className="space-y-2">
            <Link href="/account" className="block px-4 py-2 bg-lavender-bg rounded-lg font-medium text-sm">Dashboard</Link>
            <Link href="/account/orders" className="block px-4 py-2 hover:bg-lavender-bg rounded-lg text-sm">Orders</Link>
            <Link href="/account/wishlist" className="block px-4 py-2 hover:bg-lavender-bg rounded-lg text-sm">Wishlist</Link>
            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-red-50 rounded-lg text-sm text-red-600">
              Sign Out
            </button>
          </aside>
          <div className="md:col-span-3">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">
                Welcome, {profile?.first_name || profile?.email || "Customer"}
              </h2>
              {profile && (
                <div className="space-y-3 text-sm">
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Phone:</strong> {profile.phone || "Not set"}</p>
                  <p><strong>Loyalty Points:</strong> {profile.loyalty_points}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
