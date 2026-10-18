"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { registerUser } from "@/src/lib/auth";
import SocialLoginButtons from "@/src/components/SocialLoginButtons";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu cần ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        fullName,
        username,
        phone,
        email,
        password,
      });

      router.push("/login");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Đăng ký thất bại. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20";

  return (
    <main className="min-h-[70vh] bg-[#f8f7f3] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
          QUOC PERFUME
        </p>

        <h1 className="mb-2 text-center font-serif-luxury text-3xl font-bold text-emerald-950">
          Đăng ký
        </h1>

        <p className="mb-7 text-center text-sm text-gray-500">
          Tạo tài khoản để bắt đầu hành trình khám phá hương thơm.
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
              htmlFor="fullName"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Họ và tên
            </label>
            <input
              id="fullName"
              autoComplete="name"
              placeholder="Nhập họ và tên"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="username"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Tên tài khoản
            </label>
            <input
              id="username"
              autoComplete="username"
              placeholder="Tạo tên tài khoản"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Số điện thoại
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Nhập số điện thoại"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="example@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
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
                autoComplete="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="Tạo mật khẩu (ít nhất 6 ký tự)"
                minLength={6}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 !border-0 !bg-transparent !p-1 !text-gray-500 !shadow-none hover:!bg-transparent hover:!text-emerald-950"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Nhập lại mật khẩu
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                autoComplete="new-password"
                type={showConfirm ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 !border-0 !bg-transparent !p-1 !text-gray-500 !shadow-none hover:!bg-transparent hover:!text-emerald-950"
              >
                {showConfirm ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="!flex !w-full !items-center !justify-center !gap-2 !rounded-lg !border !border-emerald-900 !bg-emerald-900 !px-4 !py-3 !font-semibold !text-white !shadow-sm transition hover:!border-emerald-800 hover:!bg-emerald-800 disabled:!cursor-not-allowed disabled:!opacity-60"
          >
            <UserPlus size={18} />
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>

        <div className="my-5">
          <SocialLoginButtons />
        </div>

        <p className="text-center text-sm text-gray-500">
          Đã có tài khoản?{" "}
          <a
            href="/login"
            className="font-semibold text-amber-700 hover:underline"
          >
            Đăng nhập
          </a>
        </p>
      </div>
    </main>
  );
}
