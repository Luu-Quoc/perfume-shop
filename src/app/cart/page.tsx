"use client";

import { useCart } from "@/src/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { items, removeFromCart } = useCart();
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <main className="p-8">
        <p>Giỏ hàng đang trống.</p>
        <Link href="/products" className="underline">
          Xem sản phẩm
        </Link>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Giỏ hàng</h1>
      {items.map((item) => (
        <div
          key={item.product.id}
          className="flex justify-between items-center border-b py-3"
        >
          <div>
            <p className="font-semibold">{item.product.name}</p>
            <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
          </div>
          <div className="flex items-center gap-3">
            <span>
              {(item.product.price * item.quantity).toLocaleString()}đ
            </span>
            <button
              onClick={() => removeFromCart(item.product.id)}
              className="text-red-500 text-sm"
            >
              Xoá
            </button>
          </div>
        </div>
      ))}
      <p className="text-xl font-bold mt-4">
        Tổng: {totalPrice.toLocaleString()}đ
      </p>
      <Link
        href="/checkout"
        className="block text-center bg-black text-white px-4 py-2 rounded mt-4"
      >
        Tiến hành thanh toán
      </Link>
    </main>
  );
}
