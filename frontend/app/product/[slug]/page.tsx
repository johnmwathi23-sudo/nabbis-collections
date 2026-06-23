import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "@/components/AddToCartButton";
import { getProduct, getRelatedProducts } from "@/lib/woocommerce";
import { getCategoryById } from "@/lib/db/categories";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.short_description?.replace(/<[^>]*>/g, "").slice(0, 160),
    openGraph: {
      images: product.images?.[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return (
      <>
        <Header />
        <main className="container-nabbis py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/shop" className="btn-primary">Back to Shop</Link>
        </main>
        <Footer />
      </>
    );
  }

  const [related, category] = await Promise.all([
    getRelatedProducts(product.id),
    product.category_id ? getCategoryById(product.category_id) : null,
  ]);

  const img = product.images?.[0];

  return (
    <>
      <Header />
      <main>
        <div className="container-nabbis py-8">
          <div className="text-sm text-gray-500 mb-6">
            <Link href="/" className="text-purple-primary hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="text-purple-primary hover:underline">Shop</Link>
            {category && (
              <>
                <span className="mx-2">/</span>
                <Link href={`/shop?category=${category.slug}`} className="text-purple-primary hover:underline">{category.name}</Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden relative border border-gray-200">
                {img?.url ? (
                  <Image src={img.url} alt={img.alt || product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                  </div>
                )}
                {product.on_sale && (
                  <span className="absolute top-4 left-4 bg-gold text-white text-sm font-bold px-3 py-1.5 rounded-md">Sale</span>
                )}
              </div>
            </div>

            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              {product.average_rating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-gold text-sm">
                    {"★".repeat(Math.round(product.average_rating))}
                    {"☆".repeat(5 - Math.round(product.average_rating))}
                  </span>
                  <span className="text-sm text-gray-500">({product.review_count} reviews)</span>
                </div>
              )}

              <div className="mb-6">
                {product.on_sale && product.sale_price ? (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-purple-primary">KSh {Number(product.sale_price).toLocaleString()}</span>
                    <span className="text-lg text-gray-400 line-through">KSh {Number(product.price).toLocaleString()}</span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-purple-primary">KSh {Number(product.price).toLocaleString()}</span>
                )}
              </div>

              {product.short_description && (
                <div className="text-gray-600 mb-6 text-sm leading-relaxed">{product.short_description}</div>
              )}

              <AddToCartButton product={product} />

              <div className="border-t border-gray-200 pt-6 space-y-3 text-sm text-gray-600">
                <p><strong>SKU:</strong> {product.sku || product.id.slice(0, 8)}</p>
                {category && <p><strong>Category:</strong> {category.name}</p>}
                <p><strong>Stock:</strong> {product.stock_status === "instock" ? "In Stock" : "Out of Stock"}</p>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="font-serif text-2xl font-bold mb-4">Description</h2>
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description || '' }} />
          </div>

          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="font-serif text-2xl font-bold mb-6">Related Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
