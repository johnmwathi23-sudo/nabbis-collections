import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Nabbis Collections — premium fashion and lifestyle brand in Kenya.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <div className="bg-gradient-to-b from-lavender-bg to-white py-16 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">About Us</h1>
        </div>
        <div className="container-nabbis py-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Nabbis Collections was founded with a simple mission: to bring premium fashion, lifestyle, and household products to every corner of Kenya.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We carefully curate every product in our collection to ensure quality, style, and value. From the latest fashion trends to essential home accessories, we&apos;re your trusted partner for modern living.
              </p>
              <p className="text-gray-600 leading-relaxed">
                With our seamless M-Pesa payment system and nationwide delivery network, we make premium shopping accessible to everyone, everywhere in Kenya.
              </p>
            </div>
            <div className="aspect-[4/3] bg-lavender-bg rounded-xl flex items-center justify-center text-6xl">
              🏪
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center p-6">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="font-semibold text-lg mb-2">Our Mission</h3>
              <p className="text-sm text-gray-600">To provide every Kenyan with access to premium fashion and lifestyle products at affordable prices.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl mb-4">👁️</div>
              <h3 className="font-semibold text-lg mb-2">Our Vision</h3>
              <p className="text-sm text-gray-600">To become East Africa&apos;s most trusted online destination for fashion, lifestyle, and household essentials.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl mb-4">💜</div>
              <h3 className="font-semibold text-lg mb-2">Our Values</h3>
              <p className="text-sm text-gray-600">Quality, trust, convenience, and customer satisfaction in everything we do.</p>
            </div>
          </div>

          <div className="mt-16 bg-lavender-bg rounded-2xl p-8 md:p-12">
            <h2 className="font-serif text-2xl font-bold text-center mb-8">Why Choose Nabbis?</h2>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              {[
                { icon: "✅", title: "Premium Quality", desc: "Curated products" },
                { icon: "🚚", title: "Nationwide Delivery", desc: "All 47 counties" },
                { icon: "💳", title: "M-Pesa Payments", desc: "Secure & instant" },
                { icon: "↩️", title: "Easy Returns", desc: "7-day guarantee" },
              ].map((item) => (
                <div key={item.title}>
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
