import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProducts, getCategories } from "@/lib/woocommerce";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our curated collection of fashion, bags, and lifestyle products.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const [data, categories] = await Promise.all([
    getProducts({
      page: params.page ? Number(params.page) : 1,
      per_page: 24,
      category_slug: params.category as string,
      search: params.search as string,
      orderby: (params.orderby as string) || "created_at",
      order: (params.order as string) || "desc",
      on_sale: params.on_sale === "true" ? true : undefined,
    }),
    getCategories(),
  ]);

  const products = data.products;

  return (
    <>
      <Header />
      <main>
        <div className="bg-gradient-to-b from-lavender-bg to-white py-16 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900">Shop</h1>
          <p className="text-gray-600 mt-2">Discover our curated collection</p>
        </div>
        <div className="container-nabbis py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-64 shrink-0">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-700 mb-3">Categories</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/shop" className="text-sm text-gray-600 hover:text-purple-primary transition-colors">All</Link>
                    </li>
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <Link
                          href={`/shop?category=${cat.slug}`}
                          className="text-sm text-gray-600 hover:text-purple-primary transition-colors"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-700 mb-3">Sort</h3>
                  <ul className="space-y-2">
                    <li><Link href="/shop" className="text-sm text-gray-600 hover:text-purple-primary">Newest</Link></li>
                    <li><Link href="/shop?orderby=price&order=asc" className="text-sm text-gray-600 hover:text-purple-primary">Price: Low to High</Link></li>
                    <li><Link href="/shop?orderby=price&order=desc" className="text-sm text-gray-600 hover:text-purple-primary">Price: High to Low</Link></li>
                  </ul>
                </div>
              </div>
            </aside>
            <div className="flex-1">
              {products.length === 0 ? (
                <p className="text-gray-500 text-center py-12">No products found.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
