"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  shipping_name: string | null;
  shipping_phone: string | null;
  shipping_address: string | null;
};

type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  products: {
    name: string;
    image_url: string | null;
    brand: string | null;
    volume: string | null;
  } | null;
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = String(params.id);
  const { user } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrderDetail() {
      if (!user) {
        setLoading(false);
        return;
      }

      const id = Number(orderId);

      if (!Number.isInteger(id) || id <= 0) {
        setError("Mã đơn hàng không hợp lệ.");
        setLoading(false);
        return;
      }

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select(
          "id, user_id, total_price, status, created_at, payment_method, payment_status, shipping_name, shipping_phone, shipping_address",
        )
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (orderError) {
        console.error("Lỗi tải đơn hàng:", orderError);
        setError("Không thể tải thông tin đơn hàng.");
        setLoading(false);
        return;
      }

      if (!orderData) {
        setError(
          "Không tìm thấy đơn hàng hoặc bạn không có quyền xem đơn này.",
        );
        setLoading(false);
        return;
      }

      const { data: itemData, error: itemError } = await supabase
        .from("order_items")
        .select(
          "id, order_id, product_id, quantity, price, products(name, image_url, brand, volume)",
        )
        .eq("order_id", id);

      if (itemError) {
        console.error("Lỗi tải sản phẩm trong đơn hàng:", itemError);
        setError("Không thể tải danh sách sản phẩm của đơn hàng.");
        setLoading(false);
        return;
      }

      setOrder(orderData as Order);
      setItems((itemData ?? []) as unknown as OrderItem[]);
      setLoading(false);
    }

    fetchOrderDetail();
  }, [user, orderId]);

  if (loading) {
    return (
      <main className="p-8 text-center">Đang tải chi tiết đơn hàng...</main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">Chi tiết đơn hàng</h1>
        <p className="mb-4">Bạn cần đăng nhập để xem đơn hàng.</p>
        <Link
          href="/login"
          className="inline-block rounded-lg bg-emerald-900 px-5 py-3 text-white"
        >
          Đăng nhập
        </Link>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="mb-4 text-2xl font-bold">Chi tiết đơn hàng</h1>
        <p className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
          {error || "Không tìm thấy đơn hàng."}
        </p>
        <Link href="/orders" className="font-semibold text-emerald-900">
          ← Quay lại lịch sử đơn hàng
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10">
      <Link
        href="/orders"
        className="mb-6 inline-block font-medium text-emerald-900 hover:underline"
      >
        ← Quay lại lịch sử đơn hàng
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Chi tiết đơn hàng</h1>
          <p className="mt-2 text-gray-500">Mã đơn hàng: #{order.id}</p>
          <p className="mt-1 text-sm text-gray-500">
            Ngày đặt: {new Date(order.created_at).toLocaleString("vi-VN")}
          </p>
        </div>

        <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">
          {order.status}
        </span>
      </div>

      <section className="mb-6 rounded-xl border bg-white p-5">
        <h2 className="mb-4 text-lg font-bold">Thông tin giao hàng</h2>
        <p className="mb-2">
          <strong>Người nhận:</strong>{" "}
          {order.shipping_name || "Chưa có thông tin"}
        </p>
        <p className="mb-2">
          <strong>Số điện thoại:</strong>{" "}
          {order.shipping_phone || "Chưa có thông tin"}
        </p>
        <p>
          <strong>Địa chỉ:</strong>{" "}
          {order.shipping_address || "Chưa có thông tin"}
        </p>
      </section>

      <section className="mb-6 rounded-xl border bg-white p-5">
        <h2 className="mb-4 text-lg font-bold">Sản phẩm đã đặt</h2>

        {items.length === 0 ? (
          <p className="text-gray-500">
            Đơn hàng chưa có sản phẩm hoặc không tải được sản phẩm.
          </p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0"
              >
                {item.products?.image_url ? (
                  <img
                    src={item.products.image_url}
                    alt={item.products.name || "Nước hoa"}
                    className="h-20 w-20 rounded-lg border object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-500">
                    Không có ảnh
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">
                    {item.products?.name || `Sản phẩm #${item.product_id}`}
                  </h3>
                  {item.products?.brand && (
                    <p className="mt-1 text-sm text-gray-500">
                      Thương hiệu: {item.products.brand}
                    </p>
                  )}
                  {item.products?.volume && (
                    <p className="mt-1 text-sm text-gray-500">
                      Dung tích: {item.products.volume}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-600">
                    Số lượng: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold text-emerald-900">
                  {(Number(item.price) * item.quantity).toLocaleString("vi-VN")}{" "}
                  ₫
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border bg-white p-5">
        <h2 className="mb-4 text-lg font-bold">Thanh toán</h2>

        <div className="flex justify-between gap-4">
          <span className="text-gray-600">Phương thức</span>
          <span className="font-medium">
            {(order.payment_method || "").toUpperCase()}
          </span>
        </div>

        <div className="mt-3 flex justify-between gap-4">
          <span className="text-gray-600">Trạng thái thanh toán</span>
          <span className="font-medium">{order.payment_status}</span>
        </div>

        <div className="mt-5 flex justify-between gap-4 border-t pt-4">
          <span className="font-bold">Tổng tiền đơn hàng</span>
          <span className="text-xl font-bold text-emerald-900">
            {Number(order.total_price).toLocaleString("vi-VN")} ₫
          </span>
        </div>
      </section>
    </main>
  );
}
