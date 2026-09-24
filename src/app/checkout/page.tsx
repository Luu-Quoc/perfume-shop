"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useCart } from "@/src/context/CartContext";
import { supabase } from "@/src/lib/supabase";

export default function CheckoutPage() {
  const router = useRouter();

  const { items, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);

  // ==========================================
  // TÍNH TỔNG TIỀN
  // ==========================================

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  // ==========================================
  // GIỎ HÀNG TRỐNG
  // ==========================================

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-bold">Giỏ hàng đang trống</h1>

            <Link
              href="/products"
              className="inline-block mt-5 bg-emerald-800 text-white px-6 py-3 rounded-xl"
            >
              Quay lại sản phẩm
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // ĐẶT HÀNG
  // ==========================================

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      // ========================================
      // KIỂM TRA USER
      // ========================================

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Vui lòng đăng nhập trước khi đặt hàng");
        router.push("/login");
        return;
      }

      // ========================================
      // CHUYỂN CART → JSON
      // ========================================

      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));

      // ========================================
      // GỌI BACKEND FUNCTION
      // ========================================

      const { data, error } = await supabase.rpc("create_order", {
        p_user_id: user.id,

        p_shipping_name: name,

        p_shipping_phone: phone,

        p_shipping_address: address,

        p_payment_method: "cod",

        p_items: orderItems,
      });

      // ========================================
      // XỬ LÝ ERROR
      // ========================================

      if (error) {
        console.error(error);

        alert(error.message || "Không thể tạo đơn hàng");

        return;
      }

      // ========================================
      // ĐẶT HÀNG THÀNH CÔNG
      // ========================================

      const orderId = data;

      clearCart();

      router.push(`/checkout/success?order=${orderId}`);
    } catch (error) {
      console.error(error);

      alert("Có lỗi xảy ra khi đặt hàng");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ==================================
              FORM
          ================================== */}

          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100"
          >
            <h2 className="text-xl font-bold mb-5">Thông tin giao hàng</h2>

            {/* HỌ TÊN */}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Họ và tên
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-700"
                placeholder="Nguyễn Văn A"
              />
            </div>

            {/* SỐ ĐIỆN THOẠI */}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Số điện thoại
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-700"
                placeholder="0901234567"
              />
            </div>

            {/* ĐỊA CHỈ */}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Địa chỉ giao hàng
              </label>

              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-700"
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
              />
            </div>

            {/* THANH TOÁN */}

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Phương thức thanh toán
              </label>

              <div className="border border-emerald-700 bg-emerald-50 rounded-xl p-4">
                <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>

                <p className="text-sm text-gray-500 mt-1">
                  Thanh toán trực tiếp cho nhân viên giao hàng.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:bg-gray-400 text-white py-3 rounded-xl font-medium transition"
            >
              {loading ? "Đang xử lý..." : "Đặt hàng"}
            </button>
          </form>

          {/* ==================================
              TÓM TẮT
          ================================== */}

          <div className="bg-white rounded-2xl p-6 border border-gray-100 h-fit">
            <h2 className="text-xl font-bold">Đơn hàng</h2>

            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between gap-4 text-sm"
                >
                  <div>
                    <p className="font-medium">{item.product.name}</p>

                    <p className="text-gray-500">
                      {item.quantity} ×{" "}
                      {item.product.price.toLocaleString("vi-VN")} đ
                    </p>
                  </div>

                  <p className="font-medium">
                    {(item.product.price * item.quantity).toLocaleString(
                      "vi-VN",
                    )}{" "}
                    đ
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t my-5" />

            <div className="flex justify-between">
              <span className="font-semibold">Tổng cộng</span>

              <span className="font-bold text-emerald-800">
                {total.toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
