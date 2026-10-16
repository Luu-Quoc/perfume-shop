"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/context/AuthContext";

type Order = {
  id: number;
  user_id: string;
  total_price: number;
  status: string;
  created_at: string;
  payment_method: string;
  payment_status: string;
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, user_id, total_price, status, created_at, payment_method, payment_status",
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Lỗi tải đơn hàng:", error);
        setError("Không thể tải lịch sử đơn hàng.");
      } else {
        setOrders(data ?? []);
      }

      setLoading(false);
    }

    fetchOrders();
  }, [user]);

  if (loading) {
    return <main className="p-8 text-center">Đang tải đơn hàng...</main>;
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">Lịch sử đơn hàng</h1>
        <p className="mb-4">Bạn cần đăng nhập để xem đơn hàng.</p>
        <Link
          href="/login"
          className="inline-block rounded-lg bg-emerald-800 px-5 py-3 text-white"
        >
          Đăng nhập
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold">Lịch sử đơn hàng</h1>
      <p className="mb-6 text-gray-500">
        Theo dõi các đơn hàng bạn đã đặt tại QUOC PERFUME.
      </p>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>
      )}

      {!error && orders.length === 0 && (
        <div className="rounded-xl border bg-white p-8 text-center">
          <p className="mb-4 text-gray-600">Bạn chưa có đơn hàng nào.</p>
          <Link
            href="/products"
            className="inline-block rounded-lg bg-emerald-800 px-5 py-3 text-white"
          >
            Khám phá nước hoa
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <article
            key={order.id}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Đơn hàng #{order.id}</h2>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-800">
                {order.status}
              </span>
            </div>

            <p className="mt-3 text-sm text-gray-500">
              Ngày đặt: {new Date(order.created_at).toLocaleString("vi-VN")}
            </p>

            <p className="mt-2">
              Tổng tiền:{" "}
              <strong className="text-emerald-800">
                {Number(order.total_price).toLocaleString("vi-VN")} ₫
              </strong>
            </p>

            <p className="mt-1 text-sm text-gray-600">
              Thanh toán: {order.payment_method.toUpperCase()} —{" "}
              {order.payment_status}
            </p>
            <Link
              href={`/orders/${order.id}`}
              className="mt-4 inline-block rounded-lg bg-emerald-900 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Xem chi tiết →
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
