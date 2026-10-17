"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useCart } from "@/src/context/CartContext";
import { supabase } from "@/src/lib/supabase";

type Province = { code: number; name: string };
type Ward = { code: number; name: string };
type ProvinceDetail = Province & { wards?: Ward[] };
type PaymentMethod = "cod" | "bank_transfer";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [provinceCode, setProvinceCode] = useState("");
  const [wardCode, setWardCode] = useState("");

  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [loading, setLoading] = useState(false);

  const selectedProvince = provinces.find(
    (p) => String(p.code) === provinceCode,
  );
  const selectedWard = wards.find((w) => String(w.code) === wardCode);

  const total = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  useEffect(() => {
    async function loadProvinces() {
      try {
        const response = await fetch(
          "https://provinces.open-api.vn/api/v2/?depth=1",
        );

        if (!response.ok) throw new Error("Không tải được tỉnh/thành.");

        const data: Province[] = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error(error);
        setAddressError("Không tải được danh sách tỉnh/thành.");
      }
    }

    loadProvinces();
  }, []);

  useEffect(() => {
    if (!provinceCode) {
      setWards([]);
      setWardCode("");
      return;
    }

    let cancelled = false;

    async function loadWards() {
      setAddressLoading(true);
      setAddressError("");
      setWards([]);
      setWardCode("");

      try {
        const response = await fetch(
          `https://provinces.open-api.vn/api/v2/p/${provinceCode}?depth=2`,
        );

        if (!response.ok) throw new Error("Không tải được phường/xã.");

        const data: ProvinceDetail = await response.json();

        if (!cancelled) setWards(data.wards ?? []);
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setAddressError("Không tải được phường/xã. Vui lòng thử lại.");
        }
      } finally {
        if (!cancelled) setAddressLoading(false);
      }
    }

    loadWards();

    return () => {
      cancelled = true;
    };
  }, [provinceCode]);

  const fullAddress = [
    streetAddress.trim(),
    selectedWard?.name,
    selectedProvince?.name,
  ]
    .filter(Boolean)
    .join(", ");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    if (!name.trim() || !phone.trim() || !streetAddress.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin giao hàng.");
      return;
    }

    if (!selectedProvince || !selectedWard) {
      alert("Vui lòng chọn tỉnh/thành và phường/xã.");
      return;
    }

    if (items.length === 0) {
      alert("Giỏ hàng đang trống.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("Vui lòng đăng nhập trước khi đặt hàng.");
        router.push("/login");
        return;
      }

      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));

      const { data, error } = await supabase.rpc("create_order", {
        p_user_id: user.id,
        p_shipping_name: name.trim(),
        p_shipping_phone: phone.trim(),
        p_shipping_address: fullAddress,
        p_payment_method: paymentMethod,
        p_items: orderItems,
      });

      if (error) {
        console.error("Lỗi tạo đơn hàng:", error);
        alert(error.message || "Không thể tạo đơn hàng.");
        return;
      }

      if (data == null) {
        alert("Không nhận được mã đơn hàng.");
        return;
      }

      if (paymentMethod === "bank_transfer") {
        // Đơn đã được lưu trong Supabase.
        // Xóa giỏ hàng rồi chuyển sang trang thanh toán riêng.
        clearCart();
        router.push(`/checkout/payment/${data}`);
        return;
      }

      // COD.
      clearCart();
      router.push(`/checkout/success?order=${data}`);
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi đặt hàng.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center">
          <h1 className="text-2xl font-bold">Giỏ hàng đang trống</h1>
          <p className="mt-2 text-gray-600">
            Nếu bạn đã tạo đơn chuyển khoản, hãy mở lại trang thanh toán của đơn
            hàng đó.
          </p>
          <Link
            href="/products"
            className="mt-5 inline-block rounded-xl bg-emerald-800 px-6 py-3 text-white"
          >
            Quay lại sản phẩm
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="mb-6 text-3xl font-bold">Thanh toán</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl bg-white p-6 lg:col-span-2"
          >
            <section>
              <h2 className="mb-5 text-xl font-bold">Thông tin giao hàng</h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block text-sm font-medium"
                  >
                    Họ và tên
                  </label>
                  <input
                    id="name"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1 block text-sm font-medium"
                  >
                    Số điện thoại
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0901234567"
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </div>

                <div>
                  <label
                    htmlFor="province"
                    className="mb-1 block text-sm font-medium"
                  >
                    Tỉnh / thành phố
                  </label>
                  <select
                    id="province"
                    required
                    value={provinceCode}
                    onChange={(e) => setProvinceCode(e.target.value)}
                    className="w-full rounded-xl border bg-white px-4 py-3"
                  >
                    <option value="">-- Chọn tỉnh/thành --</option>
                    {provinces.map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="ward"
                    className="mb-1 block text-sm font-medium"
                  >
                    Phường / xã
                  </label>
                  <select
                    id="ward"
                    required
                    value={wardCode}
                    disabled={
                      !provinceCode || addressLoading || wards.length === 0
                    }
                    onChange={(e) => setWardCode(e.target.value)}
                    className="w-full rounded-xl border bg-white px-4 py-3 disabled:bg-gray-100"
                  >
                    <option value="">
                      {addressLoading ? "Đang tải..." : "-- Chọn phường/xã --"}
                    </option>
                    {wards.map((w) => (
                      <option key={w.code} value={w.code}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                {addressError && (
                  <p className="text-sm text-red-600">{addressError}</p>
                )}

                <div>
                  <label
                    htmlFor="streetAddress"
                    className="mb-1 block text-sm font-medium"
                  >
                    Số nhà, tên đường
                  </label>
                  <textarea
                    id="streetAddress"
                    required
                    rows={3}
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="Ví dụ: 123 Nguyễn Văn A"
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </div>

                {streetAddress.trim() && selectedWard && selectedProvince && (
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                    <p className="mt-1 font-medium">{fullAddress}</p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold">Phương thức thanh toán</h2>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-semibold">
                      Thanh toán khi nhận hàng (COD)
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Trả tiền khi nhận sản phẩm.
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={() => setPaymentMethod("bank_transfer")}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-semibold">Chuyển khoản Vietcombank</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Tạo đơn rồi mở trang QR thanh toán.
                    </p>
                  </div>
                </label>
              </div>
            </section>

            <button
              type="submit"
              disabled={loading || addressLoading}
              className="w-full rounded-xl bg-emerald-800 px-5 py-4 font-semibold text-white disabled:opacity-60"
            >
              {loading
                ? "Đang xử lý..."
                : paymentMethod === "cod"
                  ? "Đặt hàng"
                  : "Tạo đơn và xem mã QR"}
            </button>
          </form>

          <aside className="h-fit rounded-2xl bg-white p-6">
            <h2 className="mb-5 text-xl font-bold">Đơn hàng của bạn</h2>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between gap-4"
                >
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 font-medium">
                    {(
                      Number(item.product.price) * item.quantity
                    ).toLocaleString("vi-VN")}{" "}
                    ₫
                  </p>
                </div>
              ))}
            </div>

            <div className="my-5 border-t" />

            <div className="flex justify-between gap-4 text-lg font-bold">
              <span>Tổng tiền</span>
              <span className="text-emerald-800">
                {total.toLocaleString("vi-VN")} ₫
              </span>
            </div>

            <p className="mt-3 text-sm text-gray-500">
              Phí vận chuyển, nếu có, chưa được tính.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
