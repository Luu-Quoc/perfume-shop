"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/src/lib/types";
import { useAuth } from "@/src/context/AuthContext";
import { useCart } from "@/src/context/CartContext";
import { addToWishlist } from "@/src/lib/wishlist";
import { Heart, ShoppingCart } from "lucide-react";

export default function ProductCard({
  product,
  featured = false,
}: {
  product: Product;
  featured?: boolean;
}) {
  const { user } = useAuth();
  const { addToCart } = useCart();

  // ==============================
  // XỬ LÝ YÊU THÍCH
  // ==============================
  async function handleWishlist(e: React.MouseEvent) {
    // Không cho click vào nút làm Link chuyển trang
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào yêu thích");
      return;
    }

    try {
      await addToWishlist(user.id, product.id);
      alert("Đã thêm vào danh sách yêu thích");
    } catch (error) {
      console.error("Lỗi thêm wishlist:", error);
      alert("Không thể thêm vào danh sách yêu thích");
    }
  }

  // ==============================
  // XỬ LÝ THÊM GIỎ HÀNG
  // ==============================
  function handleAddToCart(e: React.MouseEvent) {
    // Không cho click vào nút làm Link chuyển trang
    e.preventDefault();
    e.stopPropagation();

    // Kiểm tra hết hàng
    if (product.stock <= 0) {
      alert("Sản phẩm đã hết hàng");
      return;
    }

    // Gọi CartContext
    addToCart(product);
  }

  // Kiểm tra sản phẩm còn hàng
  const isOutOfStock = product.stock <= 0;

  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <div
        className={`relative h-full flex flex-col bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 group-hover:-translate-y-1 ${
          featured ? "bg-amber-50/30" : ""
        }`}
      >
        {/* ==============================
            NÚT YÊU THÍCH
        ============================== */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition"
          aria-label="Yêu thích"
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* ==============================
            HÌNH ẢNH
        ============================== */}
        <div className="w-full aspect-square bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center mb-3">
          <img
            src={product.image_url || "https://via.placeholder.com/300"}
            alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* ==============================
            THÔNG TIN SẢN PHẨM
        ============================== */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Brand */}
            {product.brand && (
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
                {product.brand}
              </p>
            )}

            {/* Tên sản phẩm */}
            <h3
              className={`font-medium text-gray-900 group-hover:text-emerald-800 transition-colors line-clamp-2 min-h-[36px] ${
                featured ? "text-lg" : "text-xs md:text-sm"
              }`}
            >
              {product.name}
            </h3>

            {/* Scent notes */}
            {product.scent_notes && (
              <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                {product.scent_notes}
              </p>
            )}
          </div>

          {/* ==============================
              GIÁ
          ============================== */}
          <p className="mt-3 font-bold text-emerald-800 text-xs md:text-sm">
            {product.price
              ? `${product.price.toLocaleString("vi-VN")} đ`
              : "Liên hệ"}
          </p>

          {/* ==============================
              TỒN KHO
          ============================== */}
          <div className="mt-2">
            {isOutOfStock ? (
              <p className="text-xs font-medium text-red-500">Hết hàng</p>
            ) : product.stock <= 5 ? (
              <p className="text-xs font-medium text-orange-500">
                Chỉ còn {product.stock} sản phẩm
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                Còn {product.stock} sản phẩm
              </p>
            )}
          </div>

          {/* ==============================
              NÚT THÊM VÀO GIỎ
          ============================== */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs md:text-sm font-medium transition ${
              isOutOfStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-emerald-800 text-white hover:bg-emerald-900"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />

            {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
          </button>
        </div>
      </div>
    </Link>
  );
}
