import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0];
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="aspect-square bg-gray-50 overflow-hidden relative">
        {img?.url ? (
          <Image
            src={img.url}
            alt={img.alt || product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-400"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
            </svg>
          </div>
        )}
        {product.on_sale && (
          <span className="absolute top-2 left-2 bg-gold text-white text-xs font-bold px-2 py-1 rounded-md">
            Sale
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          {product.on_sale ? (
            <>
              <span className="text-purple-primary font-bold text-lg">
                KSh {Number(product.sale_price).toLocaleString()}
              </span>
              <span className="text-gray-400 line-through text-sm">
                KSh {Number(product.price).toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-purple-primary font-bold text-lg">
              KSh {Number(product.price).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
