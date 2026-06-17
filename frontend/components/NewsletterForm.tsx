"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="bg-green-500/20 text-white px-4 py-3 rounded-lg text-sm">
        Thank you for subscribing!
      </div>
    );
  }

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Enter your email address"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-4 py-3 rounded-lg text-gray-900 text-sm"
      />
      <button type="submit" className="bg-gold text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-amber-600 transition-colors">
        Subscribe
      </button>
      {status === "error" && <p className="text-red-300 text-xs mt-1">Failed to subscribe. Try again.</p>}
    </form>
  );
}
