"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, ShoppingCart, Zap } from "lucide-react";

import type { Product } from "@/src/lib/types";
import { useCart } from "@/src/context/CartContext";
import { useAuth } from "@/src/context/AuthContext";
import { addToWishlist } from "@/src/lib/wishlist";

export default function ProductDetailClient({ product }: { product: Product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  const isOutOfStock = product.stock <= 0;

  // THÊM VÀO GIỎ
  function handleAddToCart() {
    if (isOutOfStock) {
      alert("Sản phẩm đã hết hàng");
      return;
    }

    addToCart(product);
  }

  // MUA NGAY
  function handleBuyNow() {
    if (isOutOfStock) {
      alert("Sản phẩm đã hết hàng");
      return;
    }

    addToCart(product);
    router.push("/checkout");
  }

  // YÊU THÍCH
  async function handleWishlist() {
    if (!user) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào yêu thích");
      return;
    }

    try {
      await addToWishlist(user.id, product.id);
      alert("Đã thêm vào danh sách yêu thích");
    } catch (error) {
      console.error(error);
      alert("Không thể thêm vào danh sách yêu thích");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* QUAY LẠI */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại sản phẩm
        </Link>

        {/* CHI TIẾT SẢN PHẨM */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* HÌNH ẢNH */}
            <div className="bg-gray-50 min-h-[450px] flex items-center justify-center p-8">
              <img
                src={product.image_url || "https://via.placeholder.com/500"}
                alt={product.name}
                className="w-full max-w-md h-[450px] object-contain"
              />
            </div>

            {/* THÔNG TIN SẢN PHẨM */}
            <div className="p-6 md:p-10">
              {product.brand && (
                <p className="text-sm uppercase tracking-wider text-gray-400 mb-2">
                  {product.brand}
                </p>
              )}

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {product.name}
              </h1>

              <p className="mt-5 text-2xl font-bold text-emerald-800">
                {product.price.toLocaleString("vi-VN")} đ
              </p>

              {/* TỒN KHO */}
              <div className="mt-4">
                {isOutOfStock ? (
                  <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-medium">
                    Hết hàng
                  </span>
                ) : product.stock <= 5 ? (
                  <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-medium">
                    Chỉ còn {product.stock} sản phẩm
                  </span>
                ) : (
                  <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm font-medium">
                    Còn hàng ({product.stock})
                  </span>
                )}
              </div>

              {/* MÔ TẢ */}
              {product.description && (
                <div className="mt-6">
                  <h2 className="font-semibold text-gray-900">Mô tả</h2>

                  <p className="mt-2 text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* THÔNG TIN CHI TIẾT */}
              <div className="mt-6 border-t pt-5 space-y-3">
                {product.volume && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Dung tích</span>
                    <span className="font-medium text-gray-900">
                      {product.volume} ml
                    </span>
                  </div>
                )}

                {product.gender && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Đối tượng</span>
                    <span className="font-medium text-gray-900">
                      {product.gender}
                    </span>
                  </div>
                )}

                {product.category && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Danh mục</span>
                    <span className="font-medium text-gray-900">
                      {product.category}
                    </span>
                  </div>
                )}

                {product.occasion && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Dịp sử dụng</span>
                    <span className="font-medium text-gray-900">
                      {product.occasion}
                    </span>
                  </div>
                )}

                {product.scent_notes && (
                  <div className="pt-2">
                    <p className="text-sm text-gray-500">Hương thơm</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {product.scent_notes}
                    </p>
                  </div>
                )}
              </div>

              {/* CÁC NÚT MUA HÀNG */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* MUA NGAY */}
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className={`flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-medium transition ${
                    isOutOfStock
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  <Zap className="w-5 h-5" />
                  {isOutOfStock ? "Hết hàng" : "Mua ngay"}
                </button>

                {/* THÊM VÀO GIỎ */}
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-medium transition ${
                    isOutOfStock
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-emerald-800 text-white hover:bg-emerald-900"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
                </button>

                {/* YÊU THÍCH */}
                <button
                  type="button"
                  onClick={handleWishlist}
                  className="sm:col-span-2 flex items-center justify-center gap-2 py-3 px-5 rounded-xl border border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-500 transition"
                >
                  <Heart className="w-5 h-5" />
                  Yêu thích
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
