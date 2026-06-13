"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { createBrowserClient } from "@/lib/supabase";
import type { Product } from "@/lib/types";

export default function WishlistPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }
      supabase
        .from("wishlist_items")
        .select("product_id")
        .eq("customer_id", user.id)
        .then(async ({ data: wishlist }) => {
          if (!wishlist || wishlist.length === 0) {
            setLoading(false);
            return;
          }
          const ids = wishlist.map((w) => w.product_id);
          const { data: products } = await supabase
            .from("products")
            .select("*")
            .in("id", ids);
          setProducts((products as Product[]) || []);
          setLoading(false);
        });
    });
  }, [router]);

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
        <h1 className="font-serif text-3xl font-bold mb-8">My Wishlist</h1>
        {products.length === 0 ? (
          <div className="bg-lavender-bg rounded-xl p-8 text-center">
            <p className="text-gray-600 mb-4">Your wishlist is empty.</p>
            <Link href="/shop" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
