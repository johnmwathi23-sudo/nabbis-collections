"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createBrowserClient } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createBrowserClient();
    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          phone: form.phone,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/auth/login?registered=true");
    router.refresh();
  };

  return (
    <>
      <Header />
      <main className="container-nabbis py-12 min-h-[70vh]">
        <div className="max-w-md mx-auto">
          <h1 className="font-serif text-3xl font-bold text-center mb-8">Create Account</h1>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="input-nabbis" />
              <input required placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="input-nabbis" />
            </div>
            <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-nabbis w-full" />
            <input required type="tel" placeholder="Phone (e.g. 0712345678)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-nabbis w-full" />
            <input required type="password" placeholder="Password (min 6 characters)" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-nabbis w-full" />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-purple-primary hover:underline">Sign In</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
