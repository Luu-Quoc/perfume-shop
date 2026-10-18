"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  ShieldCheck,
  Package,
  Heart,
  LogOut,
  LoaderCircle,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import ProtectedRoute from "@/src/components/ProtectedRoute";

export default function AccountPage() {
  const { user, profile, signOut, loading } = useAuth();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (!confirmed) return;

    setSigningOut(true);

    try {
      await signOut();
      router.replace("/login");
      router.refresh();
    } catch {
      window.alert("Đăng xuất chưa thành công. Vui lòng thử lại.");
    } finally {
      setSigningOut(false);
    }
  }

  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("vi-VN")
    : "Chưa có thông tin";

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#f8f7f3] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              QUOC PERFUME
            </p>
            <h1 className="font-serif-luxury text-3xl font-bold text-emerald-950 sm:text-4xl">
              Tài khoản của tôi
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Quản lý thông tin và trải nghiệm mua sắm của bạn.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-950 text-amber-300">
                  <UserRound size={36} />
                </div>

                <h2 className="mt-4 text-lg font-semibold text-gray-900">
                  {profile?.full_name || "Khách hàng"}
                </h2>

                <p className="mt-1 break-all text-sm text-gray-500">
                  {user?.email || ""}
                </p>

                <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                  <ShieldCheck size={14} />
                  {profile?.role === "admin" ? "Quản trị viên" : "Khách hàng"}
                </span>
              </div>

              <div className="my-6 border-t border-gray-100" />

              <nav className="space-y-2">
                <button
                  type="button"
                  onClick={() => router.push("/orders")}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  <span className="flex items-center gap-3">
                    <Package size={18} className="text-emerald-900" />
                    Đơn hàng của tôi
                  </span>
                  <ChevronRight size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/wishlist")}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  <span className="flex items-center gap-3">
                    <Heart size={18} className="text-emerald-900" />
                    Sản phẩm yêu thích
                  </span>
                  <ChevronRight size={17} />
                </button>
              </nav>

              <div className="my-5 border-t border-gray-100" />

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {signingOut ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <LogOut size={18} />
                )}
                {signingOut ? "Đang đăng xuất..." : "Đăng xuất"}
              </button>
            </aside>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
              <h2 className="text-xl font-semibold text-emerald-950">
                Thông tin cá nhân
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Thông tin hiện được lấy từ tài khoản của bạn.
              </p>

              {loading ? (
                <div className="flex items-center gap-2 py-10 text-sm text-gray-500">
                  <LoaderCircle size={18} className="animate-spin" />
                  Đang tải thông tin...
                </div>
              ) : (
                <div className="mt-6 divide-y divide-gray-100">
                  <InfoRow
                    icon={<UserRound size={19} />}
                    label="Họ và tên"
                    value={profile?.full_name || "Chưa cập nhật"}
                  />
                  <InfoRow
                    icon={<UserRound size={19} />}
                    label="Tên tài khoản"
                    value={profile?.username || "Chưa cập nhật"}
                  />
                  <InfoRow
                    icon={<Mail size={19} />}
                    label="Email"
                    value={user?.email || "Chưa có thông tin"}
                  />
                  <InfoRow
                    icon={<Phone size={19} />}
                    label="Số điện thoại"
                    value={profile?.phone || "Chưa cập nhật"}
                  />
                  <InfoRow
                    icon={<CalendarDays size={19} />}
                    label="Ngày tạo tài khoản"
                    value={joinedDate}
                  />
                </div>
              )}

              <div className="mt-6 rounded-xl bg-[#f8f7f3] p-4">
                <p className="text-sm font-medium text-emerald-950">
                  Chào mừng bạn đến với QUOC PERFUME
                </p>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Khám phá những mùi hương phù hợp với phong cách của bạn và
                  theo dõi đơn hàng ngay trong tài khoản.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-4">
      <div className="mt-0.5 text-amber-700">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}
