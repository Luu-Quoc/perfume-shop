"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { getUserOrders } from "@/src/lib/orders";
import { Order } from "@/src/lib/types";
import ProtectedRoute from "@/src/components/ProtectedRoute";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;
    getUserOrders(user.id).then(setOrders);
  }, [user]);

  return (
    <ProtectedRoute>
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Lịch sử đơn hàng</h1>
        {orders.map((order) => (
          <div key={order.id} className="border p-4 rounded mb-2">
            <p>Mã đơn: #{order.id}</p>
            <p>Tổng: {order.total_price.toLocaleString()}đ</p>
            <p>Trạng thái: {order.status}</p>
          </div>
        ))}
      </main>
    </ProtectedRoute>
  );
}
