"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { loginWithUsername } from "@/src/lib/auth";
import SocialLoginButtons from "@/src/components/SocialLoginButtons";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginWithUsername(username, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto px-4 py-20">
      <h1 className="font-serif-luxury text-3xl font-bold text-brand-emerald mb-6 text-center">
        Đăng nhập
      </h1>

      {error && (
        <p className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Tài khoản"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/40 outline-none"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/40 outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-emerald text-white py-2.5 rounded-lg font-medium hover:bg-brand-emerald-dark transition-colors disabled:opacity-60"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
      <SocialLoginButtons />

      <p className="text-center text-sm text-gray-500 mt-6">
        Chưa có tài khoản?{" "}
        <a
          href="/register"
          className="text-brand-gold font-medium hover:underline"
        >
          Đăng ký ngay
        </a>
      </p>
    </main>
  );
}
