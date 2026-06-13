"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const price = product.on_sale && product.sale_price ? product.sale_price : product.price;

  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="flex items-center border border-gray-300 rounded-lg">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Decrease quantity"
        >−</button>
        <span className="px-4 py-2 text-sm font-medium border-x border-gray-300">{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Increase quantity"
        >+</button>
      </div>
      <button
        onClick={handleAdd}
        className={`btn-primary flex-1 md:flex-none transition-all ${added ? 'bg-green-600' : ''}`}
      >
        {added ? "✓ Added!" : `Add to Cart — KSh ${Number(price * quantity).toLocaleString()}`}
      </button>
    </div>
  );
}
