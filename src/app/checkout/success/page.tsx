"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />

        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          Đặt hàng thành công!
        </h1>

        <p className="mt-2 text-gray-500">
          Cảm ơn bạn đã mua hàng tại cửa hàng nước hoa.
        </p>

        <div className="mt-6 space-y-3">
          <Link
            href="/products"
            className="block w-full py-3 rounded-xl bg-emerald-800 text-white font-medium hover:bg-emerald-900"
          >
            Tiếp tục mua hàng
          </Link>

          <Link
            href="/"
            className="block w-full py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </main>
  );
}
