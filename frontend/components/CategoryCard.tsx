import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/lib/types";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/shop?category=${category.id}`}
      className="group relative rounded-xl overflow-hidden aspect-[4/3] block"
    >
      {category.image_url ? (
        <Image
          src={category.image_url}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full bg-lavender-bg flex items-center justify-center">
          <span className="text-4xl">📦</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4">
        <h3 className="font-serif text-lg font-bold text-white">{category.name}</h3>
      </div>
    </Link>
  );
}
