"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import SocialLoginButtons from "@/src/components/SocialLoginButtons";
import { supabase } from "@/src/lib/supabase";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Đăng nhập thất bại.");
      }

      if (!result.session?.access_token || !result.session?.refresh_token) {
        throw new Error("Phiên đăng nhập không hợp lệ.");
      }

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: result.session.access_token,
        refresh_token: result.session.refresh_token,
      });

      if (sessionError) {
        throw new Error(sessionError.message);
      }

      router.replace("/");
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi đăng nhập.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[70vh] bg-[#f8f7f3] px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
          QUOC PERFUME
        </p>

        <h1 className="mb-2 text-center font-serif-luxury text-3xl font-bold text-emerald-950">
          Đăng nhập
        </h1>

        <p className="mb-7 text-center text-sm text-gray-500">
          Đăng nhập để tiếp tục mua sắm.
        </p>

        {error && (
          <p
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Tên tài khoản
            </label>

            <input
              id="username"
              name="username"
              autoComplete="username"
              placeholder="Nhập tên tài khoản"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                autoComplete="current-password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20"
              />

              <button
                type="button"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 !border-0 !bg-transparent !p-1 !text-gray-500 shadow-none hover:!bg-transparent hover:!text-emerald-950"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="!flex !w-full !items-center !justify-center !gap-2 !rounded-lg !border !border-emerald-900 !bg-emerald-900 !px-4 !py-3 !font-semibold !text-white !shadow-sm transition hover:!border-emerald-800 hover:!bg-emerald-800 disabled:!cursor-not-allowed disabled:!opacity-60"
          >
            <LogIn size={18} />
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="my-5">
          <SocialLoginButtons />
        </div>

        <p className="text-center text-sm text-gray-500">
          Chưa có tài khoản?{" "}
          <a
            href="/register"
            className="font-semibold text-amber-700 hover:underline"
          >
            Đăng ký ngay
          </a>
        </p>
      </div>
    </main>
  );
}
