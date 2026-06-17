"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to send message");
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <main>
        <div className="bg-gradient-to-b from-lavender-bg to-white py-16 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">Contact Us</h1>
          <p className="text-gray-600 mt-2">We&apos;d love to hear from you</p>
        </div>
        <div className="container-nabbis py-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-2xl font-bold mb-6">Get in Touch</h2>
              {sent ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  Thank you! Your message has been sent. We&apos;ll get back to you soon.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
                  <input type="text" placeholder="Full Name *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-nabbis w-full" />
                  <input type="email" placeholder="Email *" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-nabbis w-full" />
                  <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-nabbis w-full" />
                  <textarea rows={5} placeholder="Message *" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-nabbis w-full resize-none" />
                  <button type="submit" className="btn-primary w-full">Send Message</button>
                </form>
              )}
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-lavender-bg rounded-lg flex items-center justify-center shrink-0 text-lg">📞</div>
                  <div>
                    <h3 className="font-semibold text-sm">Phone</h3>
                    <p className="text-sm text-gray-600">+254 758 516135 / +254 720 144325</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-lavender-bg rounded-lg flex items-center justify-center shrink-0 text-lg">💬</div>
                  <div>
                    <h3 className="font-semibold text-sm">WhatsApp</h3>
                    <a href="https://chat.whatsapp.com/L2ZQwAUbsL16HLuIEeNGCK" target="_blank" rel="noopener noreferrer" className="text-sm text-purple-primary hover:underline">Join WhatsApp Channel</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-lavender-bg rounded-lg flex items-center justify-center shrink-0 text-lg">📧</div>
                  <div>
                    <h3 className="font-semibold text-sm">Email</h3>
                    <a href="mailto:info@nabbiscollections.co.ke" className="text-sm text-purple-primary hover:underline">info@nabbiscollections.co.ke</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-lavender-bg rounded-lg flex items-center justify-center shrink-0 text-lg">📍</div>
                  <div>
                    <h3 className="font-semibold text-sm">Address</h3>
                    <p className="text-sm text-gray-600">Nairobi, Kenya</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="font-semibold mb-3">Business Hours</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
