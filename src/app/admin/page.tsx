"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ShoppingBag, Users, RefreshCw } from "lucide-react";
import { supabase } from "@/src/lib/supabase";

type DashboardStats = {
  products: number;
  orders: number;
  users: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    orders: 0,
    users: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      // Đếm tổng số sản phẩm, đơn hàng và tài khoản
      const [productsResult, ordersResult, usersResult] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),

        supabase.from("orders").select("*", { count: "exact", head: true }),

        supabase.from("profiles").select("*", { count: "exact", head: true }),
      ]);

      // Kiểm tra lỗi truy vấn
      if (productsResult.error) {
        throw new Error(`Lỗi products: ${productsResult.error.message}`);
      }

      if (ordersResult.error) {
        throw new Error(`Lỗi orders: ${ordersResult.error.message}`);
      }

      if (usersResult.error) {
        throw new Error(`Lỗi profiles: ${usersResult.error.message}`);
      }

      // Cập nhật thống kê
      setStats({
        products: productsResult.count ?? 0,
        orders: ordersResult.count ?? 0,
        users: usersResult.count ?? 0,
      });
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Không tải được thống kê từ Supabase.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const cards = [
    {
      title: "Tổng sản phẩm",
      value: stats.products,
      icon: Package,
      href: "/admin/products",
    },
    {
      title: "Tổng đơn hàng",
      value: stats.orders,
      icon: ShoppingBag,
      href: "/admin/orders",
    },
    {
      title: "Tài khoản",
      value: stats.users,
      icon: Users,
      href: "/admin/users",
    },
  ];

  return (
    <main className="min-h-screen bg-stone-50 p-5 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Tiêu đề Dashboard */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-emerald-800">QUOC PERFUME / ADMIN</p>

            <h1 className="mt-2 text-3xl font-bold text-stone-900">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-stone-500">
              Tổng quan hoạt động cửa hàng.
            </p>
          </div>

          <button
            onClick={loadDashboard}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-emerald-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Làm mới
          </button>
        </div>

        {/* Hiển thị lỗi nếu truy vấn thất bại */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Các thẻ thống kê */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                href={card.href}
                className="rounded-xl border border-stone-200 bg-white p-5 transition hover:border-emerald-700 hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-stone-500">{card.title}</p>

                  <Icon size={22} className="text-emerald-800" />
                </div>

                <p className="mt-5 text-3xl font-bold text-stone-900">
                  {loading ? "..." : card.value.toLocaleString("vi-VN")}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Các chức năng quản lý */}
        <section className="mt-8 rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-stone-900">
            Quản lý cửa hàng
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            Chọn chức năng để tiếp tục quản trị.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/admin/products"
              className="rounded-lg bg-emerald-900 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-800"
            >
              Quản lý sản phẩm
            </Link>

            <Link
              href="/admin/orders"
              className="rounded-lg border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              Quản lý đơn hàng
            </Link>

            <Link
              href="/admin/users"
              className="rounded-lg border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              Quản lý người dùng
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
