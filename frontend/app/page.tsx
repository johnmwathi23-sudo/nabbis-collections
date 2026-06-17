import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import NewsletterForm from "@/components/NewsletterForm";
import {
  getFeaturedProducts,
  getNewArrivals,
  getOnSaleProducts,
  getCategories,
} from "@/lib/woocommerce";
import { createServerClient } from "@/lib/supabase";

async function getHeroSlides() {
  try {
    const supabase = createServerClient();
    const now = new Date().toISOString();
    const { data } = await supabase
      .from("hero_slides")
      .select("*")
      .eq("is_active", true)
      .or(`scheduled_from.is.null,scheduled_from.lte.${now}`)
      .or(`scheduled_to.is.null,scheduled_to.gte.${now}`)
      .order("sort_order", { ascending: true });

    return (data as any[]) || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featured, newArrivals, saleProducts, categories, heroSlides] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getOnSaleProducts(),
    getCategories(),
    getHeroSlides(),
  ]);

  const defaultHero = {
    title: "Premium Fashion & Lifestyle<br />for Kenya",
    subtitle: "Discover curated collections of fashion, bags, and home essentials delivered to your doorstep.",
    cta_text: "Shop Now",
    cta_link: "/shop",
    desktop_image_url: null,
    bg_color: "#3B0764",
    overlay_opacity: 0.4,
  };

  const hero = heroSlides.length > 0 ? heroSlides[0] : defaultHero;

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden" style={{ backgroundColor: hero.bg_color || "#3B0764" }}>
          {hero.desktop_image_url && (
            <img src={hero.desktop_image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
          )}
          <div
            className="absolute inset-0 z-10"
            style={{
              background: hero.desktop_image_url
                ? `linear-gradient(to bottom right, rgba(59,7,100,${hero.overlay_opacity + 0.4}), rgba(91,33,182,${hero.overlay_opacity + 0.2}))`
                : "linear-gradient(to bottom right, rgba(59,7,100,0.9), rgba(91,33,182,0.7), rgba(124,58,237,0.5))"
            }}
          />
          <div className="container-nabbis relative z-20 py-20">
            <h1
              className="font-serif text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 max-w-2xl"
              style={{ color: hero.text_color || "#FFFFFF" }}
              dangerouslySetInnerHTML={{ __html: hero.title }}
            />
            {hero.subtitle && (
              <p
                className="text-lg md:text-xl mb-8 max-w-xl"
                style={{ color: hero.text_color ? `${hero.text_color}cc` : "rgba(255,255,255,0.8)" }}
              >
                {hero.subtitle}
              </p>
            )}
            <div className="flex gap-4 flex-wrap">
              <Link href={hero.cta_link || "/shop"} className="btn-gold text-base px-8 py-4">
                {hero.cta_text || "Shop Now"}
              </Link>
              <Link href="/shop?orderby=date" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all">
                New Arrivals
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="bg-lavender-bg py-8">
          <div className="container-nabbis grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: "🚚", title: "Free Delivery", desc: "Orders above KES 5,000" },
              { icon: "🔒", title: "Secure Payment", desc: "M-Pesa & Card payments" },
              { icon: "↩️", title: "Easy Returns", desc: "7-day return policy" },
              { icon: "⭐", title: "Premium Quality", desc: "Curated collections" },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center gap-2">
                <span className="text-2xl">{item.icon}</span>
                <h4 className="font-semibold text-sm">{item.title}</h4>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="section-padding">
          <div className="container-nabbis">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle mt-2 mb-10">Find exactly what you need</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(0, 8).map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="section-padding bg-gray-50">
          <div className="container-nabbis">
            <h2 className="section-title">New Arrivals</h2>
            <p className="section-subtitle mt-2 mb-10">Be the first to wear the latest trends</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/shop?orderby=date" className="btn-primary">
                View All New Arrivals
              </Link>
            </div>
          </div>
        </section>

        {/* Best Sellers */}
        <section className="section-padding">
          <div className="container-nabbis">
            <h2 className="section-title">Best Sellers</h2>
            <p className="section-subtitle mt-2 mb-10">Our most popular products</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featured.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/shop" className="btn-primary">
                View All Products
              </Link>
            </div>
          </div>
        </section>

        {/* Flash Sale */}
        {saleProducts.length > 0 && (
          <section className="section-padding">
            <div className="container-nabbis">
              <div className="bg-gradient-to-r from-gold to-gold-light rounded-2xl p-10 md:p-16 text-center text-white">
                <p className="text-sm uppercase tracking-widest mb-2">Limited Time Offer</p>
                <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Flash Sale</h2>
                <p className="text-lg md:text-xl mb-6">Up to 50% off selected items. Don&apos;t miss out!</p>
                <Link href="/shop?on_sale=true" className="btn-white text-base px-8 py-4">
                  Shop the Sale
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Testimonials */}
        <section className="section-padding bg-lavender-bg">
          <div className="container-nabbis">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle mt-2 mb-10">Join thousands of happy customers across Kenya</p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { text: "Excellent quality shoes! Fast delivery in Nairobi. Will definitely shop again.", author: "Grace M.", location: "Nairobi", rating: 5 },
                { text: "M-Pesa payment was seamless. The handbag I ordered exceeded my expectations!", author: "Sarah K.", location: "Mombasa", rating: 5 },
                { text: "Great variety of household items. The kitchen accessories are top quality!", author: "James O.", location: "Kisumu", rating: 5 },
              ].map((t, i) => (
                <div key={i} className="bg-white rounded-xl p-6 relative">
                  <span className="font-serif text-4xl text-lavender absolute top-4 left-4 opacity-50">&ldquo;</span>
                  <div className="text-gold text-sm mb-3">
                    {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                  </div>
                  <p className="text-gray-700 italic mb-4 text-sm leading-relaxed">{t.text}</p>
                  <p className="font-semibold text-sm">{t.author}</p>
                  <p className="text-xs text-gray-400">{t.location}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-purple-deep py-16 text-center text-white">
          <div className="container-nabbis max-w-lg">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lavender mb-8">Get 10% off your first order and be the first to know about new arrivals.</p>
            <NewsletterForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
