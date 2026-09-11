"use client";

import { useCart } from "@/src/context/CartContext";
import { Product } from "@/src/lib/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  return (
    <button
      onClick={() => addToCart(product)}
      className="bg-black text-white px-4 py-2 rounded mt-4"
    >
      Thêm vào giỏ
    </button>
  );
}
