"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/src/lib/supabase";

type Order = {
  id: number;
  user_id: string;
  total_price: number | string;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
};

export default function OrderPaymentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const orderId = params.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrder = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace(
          `/login?redirect=${encodeURIComponent(
            `/checkout/payment/${orderId}`,
          )}`,
        );
        return;
      }

      // Chỉ lấy đơn hàng thuộc tài khoản đang đăng nhập.
      const { data, error: orderError } = await supabase
        .from("orders")
        .select(
          "id, user_id, total_price, status, payment_method, payment_status, created_at",
        )
        .eq("id", orderId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (orderError) {
        console.error("Lỗi lấy đơn hàng:", orderError);
        setError("Không thể tải đơn hàng. Vui lòng thử lại.");
        return;
      }

      if (!data) {
        setError(
          "Không tìm thấy đơn hàng hoặc bạn không có quyền xem đơn này.",
        );
        return;
      }

      setOrder(data as Order);
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi tải thông tin đơn hàng.");
    } finally {
      setLoading(false);
    }
  }, [orderId, router]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold">Không tải được đơn hàng</h1>
          <p className="mt-3 text-gray-600">
            {error || "Đơn hàng không tồn tại."}
          </p>

          <button
            type="button"
            onClick={loadOrder}
            className="mt-5 rounded-xl bg-emerald-800 px-5 py-3 font-semibold text-white"
          >
            Thử tải lại
          </button>

          <div>
            <Link
              href="/products"
              className="mt-4 inline-block text-emerald-800 underline"
            >
              Quay lại sản phẩm
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const amount = Number(order.total_price);
  const isPaid = order.payment_status === "paid";
  const isBankTransfer = order.payment_method === "bank_transfer";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-xl">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-800">
            {isPaid ? "✓" : "₫"}
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            {isPaid ? "Đơn hàng đã thanh toán" : "Thanh toán đơn hàng"}
          </h1>

          <p className="mt-2 text-gray-600">
            Mã đơn hàng: <strong>#{order.id}</strong>
          </p>

          <div className="mt-6 rounded-xl border bg-gray-50 p-4 text-left">
            <p className="text-sm text-gray-500">Số tiền đơn hàng</p>
            <p className="mt-1 text-2xl font-bold text-emerald-800">
              {Number.isFinite(amount)
                ? `${amount.toLocaleString("vi-VN")} ₫`
                : "Không xác định"}
            </p>

            <p className="mt-4 text-sm text-gray-500">Phương thức thanh toán</p>
            <p className="mt-1 font-semibold">
              {isBankTransfer
                ? "Chuyển khoản Vietcombank"
                : order.payment_method}
            </p>

            <p className="mt-4 text-sm text-gray-500">Trạng thái thanh toán</p>
            <p className="mt-1 font-semibold">
              {isPaid ? "Đã thanh toán" : order.payment_status}
            </p>
          </div>

          {!isPaid && isBankTransfer && (
            <>
              <div className="mt-6 rounded-xl border p-4">
                <p className="mb-3 font-semibold">Quét mã QR Vietcombank</p>

                <img
                  src="/image/luuvanquocvcb.jpg"
                  alt="Mã QR chuyển khoản Vietcombank"
                  className="mx-auto w-64 max-w-full rounded-lg border bg-white p-2"
                />

                <p className="mt-4 text-sm text-gray-500">
                  Nội dung chuyển khoản
                </p>

                <p className="mt-1 break-all font-bold">
                  QUOCPERFUME {order.id}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(`QUOCPERFUME ${order.id}`)
                      .then(() => alert("Đã sao chép nội dung chuyển khoản."))
                      .catch(() =>
                        alert(
                          "Không thể sao chép. Vui lòng nhập nội dung thủ công.",
                        ),
                      );
                  }}
                  className="mt-3 rounded-lg border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-100"
                >
                  Sao chép nội dung
                </button>
              </div>

              <p className="mt-5 rounded-xl bg-amber-50 p-4 text-left text-sm text-amber-800">
                Đơn hàng đang chờ xác nhận thanh toán. Vui lòng chuyển đúng số
                tiền và nội dung. Website chỉ xác nhận thanh toán sau khi khoản
                tiền được kiểm tra.
              </p>

              <button
                type="button"
                onClick={loadOrder}
                className="mt-4 w-full rounded-xl border px-5 py-3 font-semibold hover:bg-gray-50"
              >
                Kiểm tra lại trạng thái đơn hàng
              </button>
            </>
          )}

          {isPaid && (
            <p className="mt-5 rounded-xl bg-emerald-50 p-4 text-emerald-800">
              Đơn hàng đã được ghi nhận là đã thanh toán.
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/products"
              className="rounded-xl bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-900"
            >
              Tiếp tục mua sắm
            </Link>

            <Link
              href="/"
              className="rounded-xl border px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
