"use client";

import { useCart } from "@/src/context/CartContext";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { createOrder } from "@/src/lib/orders";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  async function handleConfirm() {
    if (!user) return;
    await createOrder(user.id, items, totalPrice);
    clearCart();
    router.push("/account/orders");
  }

  return (
    <ProtectedRoute>
      <main className="p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Xác nhận đơn hàng</h1>
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex justify-between border-b py-2"
          >
            <span>
              {item.product.name} x{item.quantity}
            </span>
            <span>
              {(item.product.price * item.quantity).toLocaleString()}đ
            </span>
          </div>
        ))}
        <p className="text-xl font-bold mt-4">
          Tổng: {totalPrice.toLocaleString()}đ
        </p>
        <button
          onClick={handleConfirm}
          className="bg-black text-white px-4 py-2 rounded mt-4 w-full"
        >
          Xác nhận đặt hàng
        </button>
      </main>
    </ProtectedRoute>
  );
}
