"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createBrowserClient } from "@/lib/supabase";
import type { Order } from "@/lib/types";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }
      supabase
        .from("orders")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          setOrders((data as Order[]) || []);
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
        <h1 className="font-serif text-3xl font-bold mb-8">My Orders</h1>
        {orders.length === 0 ? (
          <div className="bg-lavender-bg rounded-xl p-8 text-center">
            <p className="text-gray-600 mb-4">You haven&apos;t placed any orders yet.</p>
            <Link href="/shop" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString("en-KE", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </p>
                  <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                    order.status === "completed" ? "bg-green-100 text-green-700" :
                    order.status === "processing" || order.payment_status === "paid" ? "bg-blue-100 text-blue-700" :
                    order.status === "cancelled" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-bold">KSh {Number(order.total).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{order.payment_method}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
