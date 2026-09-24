"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

import { useCart } from "@/src/context/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();

  // ==============================
  // TÍNH TỔNG TIỀN
  // ==============================
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  // ==============================
  // GIỎ HÀNG TRỐNG
  // ==============================
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300" />

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              Giỏ hàng đang trống
            </h1>

            <p className="mt-2 text-gray-500">
              Bạn chưa có sản phẩm nào trong giỏ hàng.
            </p>

            <Link
              href="/products"
              className="inline-block mt-6 px-6 py-3 rounded-xl bg-emerald-800 text-white font-medium hover:bg-emerald-900 transition"
            >
              Xem sản phẩm
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* ==============================
            TITLE
        ============================== */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng</h1>

            <p className="mt-1 text-gray-500">{items.length} sản phẩm</p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Xóa toàn bộ
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ==============================
              DANH SÁCH SẢN PHẨM
          ============================== */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const product = item.product;

              const subtotal = product.price * item.quantity;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-100 p-4"
                >
                  <div className="flex gap-4">
                    {/* ẢNH */}
                    <div className="w-28 h-28 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                      <img
                        src={
                          product.image_url || "https://via.placeholder.com/200"
                        }
                        alt={product.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>

                    {/* THÔNG TIN */}
                    <div className="flex-1">
                      <div className="flex justify-between gap-4">
                        <div>
                          {product.brand && (
                            <p className="text-xs text-gray-400 uppercase">
                              {product.brand}
                            </p>
                          )}

                          <Link
                            href={`/products/${product.id}`}
                            className="font-semibold text-gray-900 hover:text-emerald-800"
                          >
                            {product.name}
                          </Link>
                        </div>

                        {/* XÓA */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="text-gray-400 hover:text-red-500"
                          aria-label="Xóa sản phẩm"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* GIÁ */}
                      <p className="mt-2 text-sm text-gray-500">
                        {product.price.toLocaleString("vi-VN")} đ / sản phẩm
                      </p>

                      {/* BOTTOM */}
                      <div className="mt-4 flex items-center justify-between">
                        {/* SỐ LƯỢNG */}
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(product.id, item.quantity - 1)
                            }
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>

                          <span className="w-10 text-center text-sm font-medium">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(product.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= product.stock}
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* TẠM TÍNH */}
                        <p className="font-bold text-emerald-800">
                          {subtotal.toLocaleString("vi-VN")} đ
                        </p>
                      </div>

                      {/* CẢNH BÁO STOCK */}
                      {item.quantity >= product.stock && (
                        <p className="mt-2 text-xs text-orange-500">
                          Đã đạt số lượng tồn kho tối đa
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ==============================
              TỔNG ĐƠN HÀNG
          ============================== */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900">
                Tóm tắt đơn hàng
              </h2>

              {/* TẠM TÍNH */}
              <div className="mt-5 flex justify-between text-sm">
                <span className="text-gray-500">Tạm tính</span>

                <span className="font-medium">
                  {total.toLocaleString("vi-VN")} đ
                </span>
              </div>

              {/* PHÍ SHIP */}
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-gray-500">Phí vận chuyển</span>

                <span className="font-medium">Tính khi đặt hàng</span>
              </div>

              <div className="border-t border-gray-100 my-5" />

              {/* TOTAL */}
              <div className="flex justify-between items-center">
                <span className="font-semibold">Tổng cộng</span>

                <span className="text-xl font-bold text-emerald-800">
                  {total.toLocaleString("vi-VN")} đ
                </span>
              </div>

              {/* CHECKOUT */}
              <Link
                href="/checkout"
                className="mt-6 block w-full py-3 rounded-xl bg-emerald-800 text-white text-center font-medium hover:bg-emerald-900 transition"
              >
                Tiến hành đặt hàng
              </Link>

              <Link
                href="/products"
                className="block mt-3 text-center text-sm text-gray-500 hover:text-emerald-800"
              >
                ← Tiếp tục mua hàng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
