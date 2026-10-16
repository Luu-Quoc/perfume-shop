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
    let cancelled = false;

    async function fetchOrderDetail() {
      setLoading(true);
      setError("");

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

      // Bước 1: Lấy thông tin đơn hàng
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
        if (!cancelled) {
          setError("Không thể tải thông tin đơn hàng.");
          setLoading(false);
        }
        return;
      }

      if (!orderData) {
        if (!cancelled) {
          setError(
            "Không tìm thấy đơn hàng hoặc bạn không có quyền xem đơn này.",
          );
          setLoading(false);
        }
        return;
      }

      // Bước 2: Lấy sản phẩm thuộc đơn hàng
      const { data: itemData, error: itemError } = await supabase
        .from("order_items")
        .select("id, order_id, product_id, quantity, price")
        .eq("order_id", id);

      // Log để kiểm tra trong F12 > Console
      console.log("ORDER ITEMS:", itemData);
      console.log("ORDER ITEMS ERROR:", itemError);

      if (itemError) {
        console.error("Lỗi lấy order_items:", itemError);
        if (!cancelled) {
          setError("Không thể tải danh sách sản phẩm của đơn hàng.");
          setLoading(false);
        }
        return;
      }

      const orderItems = itemData ?? [];

      // Bước 3: Lấy thông tin chi tiết từ bảng products
      const productIds = [
        ...new Set(orderItems.map((item) => Number(item.product_id))),
      ];

      let productMap = new Map<
        number,
        {
          name: string;
          image_url: string | null;
          brand: string | null;
          volume: string | null;
        }
      >();

      if (productIds.length > 0) {
        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("id, name, image_url, brand, volume")
          .in("id", productIds);

        console.log("ORDER PRODUCTS:", productData);
        console.log("ORDER PRODUCTS ERROR:", productError);

        if (productError) {
          console.error("Lỗi lấy products:", productError);
          if (!cancelled) {
            setError("Không thể tải thông tin sản phẩm.");
            setLoading(false);
          }
          return;
        }

        productMap = new Map(
          (productData ?? []).map((product) => [
            Number(product.id),
            {
              name: product.name,
              image_url: product.image_url,
              brand: product.brand,
              volume: product.volume == null ? null : `${product.volume} ml`,
            },
          ]),
        );
      }

      // Bước 4: Ghép sản phẩm với từng dòng đơn hàng
      const formattedItems: OrderItem[] = orderItems.map((item) => ({
        id: Number(item.id),
        order_id: Number(item.order_id),
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
        price: Number(item.price),
        products: productMap.get(Number(item.product_id)) ?? null,
      }));

      console.log("SẢN PHẨM HIỂN THỊ:", formattedItems);

      if (!cancelled) {
        setOrder(orderData as Order);
        setItems(formattedItems);
        setLoading(false);
      }
    }

    fetchOrderDetail();

    return () => {
      cancelled = true;
    };
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

      {/* Thông tin giao hàng */}
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

      {/* Sản phẩm đã đặt */}
      <section className="mb-6 rounded-xl border bg-white p-5">
        <h2 className="mb-4 text-lg font-bold">Sản phẩm đã đặt</h2>

        {items.length === 0 ? (
          <p className="text-gray-500">Đơn hàng này chưa có sản phẩm.</p>
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
                    alt={item.products.name}
                    className="h-24 w-24 rounded-lg border bg-white object-contain p-1"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-gray-100 text-center text-xs text-gray-500">
                    Chưa có ảnh
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
                    Đơn giá: {item.price.toLocaleString("vi-VN")} ₫
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Số lượng: {item.quantity}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500">Thành tiền</p>
                  <p className="font-bold text-emerald-900">
                    {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Thanh toán */}
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
