"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <>
      <Header />
      <main className="container-nabbis py-12 min-h-[60vh]">
        <h1 className="font-serif text-3xl font-bold mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="bg-lavender-bg rounded-xl p-8 md:p-12 text-center">
            <div className="text-5xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven&apos;t added anything yet.</p>
            <Link href="/shop" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-4">
              {items.map((item) => {
                const price = item.product.on_sale && item.product.sale_price ? item.product.sale_price : item.product.price;
                const img = item.product.images?.[0];
                return (
                  <div key={item.product.id} className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden relative shrink-0">
                      {img?.url ? (
                        <Image src={img.url} alt={img.alt || item.product.name} fill className="object-cover" sizes="80px" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-300 text-xs">No img</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.product.slug}`} className="font-medium text-sm hover:text-purple-primary line-clamp-1">
                        {item.product.name}
                      </Link>
                      <p className="text-purple-primary font-bold text-sm mt-1">KSh {Number(price).toLocaleString()}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 text-sm"
                          >−</button>
                          <span className="px-3 py-1 text-sm font-medium border-x border-gray-300">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 text-sm"
                          >+</button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >Remove</button>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-sm">KSh {Number(price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:w-80 shrink-0">
              <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
                <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
                <div className="space-y-2 text-sm border-b border-gray-200 pb-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">KSh {Number(subtotal).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                </div>
                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>Total</span>
                  <span>KSh {Number(subtotal).toLocaleString()}</span>
                </div>
                <Link
                  href="/checkout"
                  className="btn-primary w-full text-center block"
                >
                  Proceed to Checkout
                </Link>
                <Link href="/shop" className="block text-center text-sm text-purple-primary hover:underline mt-4">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
