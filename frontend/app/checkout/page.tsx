"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";
import type { DeliveryZone } from "@/lib/types";

const KENYAN_COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Ruiru", "Kiambu",
  "Limuru", "Kikuyu", "Nyeri", "Nanyuki", "Embu", "Meru", "Machakos", "Kitale",
  "Kakamega", "Bungoma", "Busia", "Siaya", "Narok", "Naivasha", "Gilgil", "Nyahururu",
  "Kericho", "Kisii", "Migori", "Homa Bay", "Kilifi", "Malindi", "Lamu", "Garissa",
  "Isiolo", "Marsabit", "Lodwar", "Mandera", "Wajir", "Tana River", "Taita Taveta",
  "Kwale", "Samburu", "Turkana", "West Pokot", "Baringo", "Elgeyo Marakwet", "Kitui",
  "Makueni", "Tharaka Nithi", "Vihiga", "Trans Nzoia", "Uasin Gishu", "Nandi",
  "Laikipia", "Muranga", "Kirinyaga", "Nyandarua",
];

export default function CheckoutPage() {
  const { items, subtotal, sessionId, clearCart } = useCart();
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [selectedCounty, setSelectedCounty] = useState("");
  const [shipping, setShipping] = useState(0);
  const [deliveryEta, setDeliveryEta] = useState("");
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "paying" | "success" | "error">("form");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/delivery-zones")
      .then((r) => r.json())
      .then(setZones)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const zone = zones.find((z) =>
      z.counties.some((c) => c.toLowerCase() === selectedCounty.toLowerCase())
    );
    if (zone) {
      const freeShipping = zone.free_shipping_threshold && subtotal >= zone.free_shipping_threshold;
      setShipping(freeShipping ? 0 : zone.price);
      setDeliveryEta(zone.estimated_days || "");
    } else {
      setShipping(0);
      setDeliveryEta("");
    }
  }, [selectedCounty, zones, subtotal]);

  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const orderRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            product_id: i.product.id,
            product_name: i.product.name,
            product_image: i.product.images?.[0]?.url || null,
            product_sku: i.product.sku || null,
            unit_price: i.product.on_sale && i.product.sale_price ? i.product.sale_price : i.product.price,
            quantity: i.quantity,
            subtotal: (i.product.on_sale && i.product.sale_price ? i.product.sale_price : i.product.price) * i.quantity,
          })),
          subtotal,
          shipping_total: shipping,
          total,
          payment_method: paymentMethod,
          session_id: sessionId,
          shipping_address: {
            first_name: form.firstName,
            last_name: form.lastName,
            email: form.email,
            phone: form.phone,
            address_line1: form.address,
            city: form.city,
            county: selectedCounty,
          },
          billing_address: {
            first_name: form.firstName,
            last_name: form.lastName,
            email: form.email,
            phone: form.phone,
            address_line1: form.address,
            city: form.city,
            county: selectedCounty,
          },
          delivery_eta: deliveryEta,
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.error || "Failed to create order");
      }

      const order = await orderRes.json();

      if (paymentMethod === "mpesa") {
        setStep("paying");
        const mpesaRes = await fetch("/api/mpesa/stkpush", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.id,
            amount: total,
            phone: form.phone,
          }),
        });

        if (!mpesaRes.ok) {
          throw new Error("M-Pesa payment failed to initiate");
        }

        const mpesaData = await mpesaRes.json();

        setStep("success");
        clearCart();
      } else {
        setStep("success");
        clearCart();
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== "success") {
    return (
      <>
        <Header />
        <main className="container-nabbis py-12 min-h-[60vh]">
          <h1 className="font-serif text-3xl font-bold mb-8">Checkout</h1>
          <div className="bg-lavender-bg rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-xl font-semibold mb-2">Add items to your cart first</h2>
            <p className="text-gray-600 mb-6">You need products in your cart before checking out.</p>
            <Link href="/shop" className="btn-primary">Browse Products</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (step === "success") {
    return (
      <>
        <Header />
        <main className="container-nabbis py-12 min-h-[60vh] text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="font-serif text-3xl font-bold mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-2">
              {paymentMethod === "mpesa"
                ? "Check your phone to complete M-Pesa payment. You'll receive a confirmation once payment is confirmed."
                : "Your order has been placed. We'll contact you shortly."}
            </p>
            <p className="text-sm text-gray-500 mb-8">Delivery ETA: {deliveryEta || "To be confirmed"}</p>
            <Link href="/shop" className="btn-primary">Continue Shopping</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container-nabbis py-12 min-h-[60vh]">
        <h1 className="font-serif text-3xl font-bold mb-8">Checkout</h1>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{errorMsg}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-4">Contact Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="input-nabbis" />
                <input required placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="input-nabbis" />
                <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-nabbis col-span-2" />
                <input required type="tel" placeholder="Phone (e.g. 0712345678)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-nabbis col-span-2" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-4">Delivery Address</h2>
              <div className="space-y-4">
                <input required placeholder="Street / Building / House number" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-nabbis w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="City / Town" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-nabbis" />
                  <select required value={selectedCounty} onChange={(e) => setSelectedCounty(e.target.value)} className="input-nabbis">
                    <option value="">Select County</option>
                    {KENYAN_COUNTIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <textarea placeholder="Order notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-nabbis w-full h-20" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-primary">
                  <input type="radio" name="payment" value="mpesa" checked={paymentMethod === "mpesa"} onChange={() => setPaymentMethod("mpesa")} className="accent-purple-primary" />
                  <div>
                    <span className="font-medium text-sm">M-Pesa (STK Push)</span>
                    <p className="text-xs text-gray-500">Pay via M-Pesa on your phone</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-primary">
                  <input type="radio" name="payment" value="bank" checked={paymentMethod === "bank"} onChange={() => setPaymentMethod("bank")} className="accent-purple-primary" />
                  <div>
                    <span className="font-medium text-sm">Bank Transfer</span>
                    <p className="text-xs text-gray-500">Pay via bank transfer, we'll confirm manually</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-primary">
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="accent-purple-primary" />
                  <div>
                    <span className="font-medium text-sm">Cash on Delivery</span>
                    <p className="text-xs text-gray-500">Pay when you receive your order</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:w-96 shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24 space-y-4">
              <h2 className="font-semibold text-lg">Order Summary</h2>
              {items.map((item) => {
                const price = item.product.on_sale && item.product.sale_price ? item.product.sale_price : item.product.price;
                return (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate max-w-[200px]">{item.product.name} × {item.quantity}</span>
                    <span className="font-medium">KSh {Number(price * item.quantity).toLocaleString()}</span>
                  </div>
                );
              })}
              <hr className="border-gray-200" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>KSh {Number(subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>{shipping === 0 ? "Free" : `KSh ${Number(shipping).toLocaleString()}`}</span>
              </div>
              {deliveryEta && (
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Delivery ETA</span>
                  <span>{deliveryEta}</span>
                </div>
              )}
              <hr className="border-gray-200" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>KSh {Number(total).toLocaleString()}</span>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Processing..." : paymentMethod === "mpesa" ? `Pay KSh ${Number(total).toLocaleString()} via M-Pesa` : "Place Order"}
              </button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
