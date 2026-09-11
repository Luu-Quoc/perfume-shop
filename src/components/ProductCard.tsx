"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/src/lib/types";
import { useAuth } from "@/src/context/AuthContext";
import { addToWishlist } from "@/src/lib/wishlist";
import { Heart } from "lucide-react";

export default function ProductCard({
  product,
  featured = false,
}: {
  product: Product;
  featured?: boolean;
}) {
  const { user } = useAuth();

  async function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) return;
    await addToWishlist(user.id, product.id);
  }

  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <div
        className={`relative h-full flex flex-col bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 group-hover:-translate-y-1 ${
          featured ? "bg-amber-50/30" : ""
        }`}
      >
        {/* Nút yêu thích */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition"
          aria-label="Yêu thích"
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Khung ảnh nước hoa vuông cố định chống tràn */}
        <div className="w-full aspect-square bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center mb-3">
          <img
            src={product.image_url || "https://via.placeholder.com/300"}
            alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Thông tin sản phẩm */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3
              className={`font-medium text-gray-900 group-hover:text-emerald-800 transition-colors line-clamp-2 min-h-[36px] ${
                featured ? "text-lg" : "text-xs md:text-sm"
              }`}
            >
              {product.name}
            </h3>
            {product.scent_notes && (
              <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                {product.scent_notes}
              </p>
            )}
          </div>

          <p className="mt-3 font-bold text-emerald-800 text-xs md:text-sm">
            {product.price
              ? `${product.price.toLocaleString("vi-VN")} đ`
              : "Liên hệ"}
          </p>
        </div>
      </div>
    </Link>
  );
}
