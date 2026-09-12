"use client";

import { signInWithProvider } from "@/src/lib/auth";

// Sau này thêm Facebook: chỉ cần thêm 1 object vào mảng này,
// không cần sửa gì thêm ở phần JSX bên dưới.
const providers = [
  {
    id: "google" as const,
    label: "Đăng nhập với Google",
    icon: (
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path
          fill="#FFC107"
          d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.7-.4-4.5z"
        />
        <path
          fill="#FF3D00"
          d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.5 0 10.4-1.9 14-5.1l-6.5-5.4C29.5 35.4 26.9 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C9.6 39.6 16.2 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.4C41.4 35.6 44 30.2 44 24c0-1.4-.1-2.7-.4-3.5z"
        />
      </svg>
    ),
  },
  // Ví dụ khi thêm Facebook sau này, chỉ cần bỏ comment và điền icon:
  // {
  //   id: "facebook" as const,
  //   label: "Đăng nhập với Facebook",
  //   icon: <svg>...</svg>,
  // },
];

export default function SocialLoginButtons() {
  async function handleClick(providerId: "google" | "facebook") {
    try {
      await signInWithProvider(providerId);
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 uppercase tracking-wide">
          hoặc
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {providers.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => handleClick(p.id)}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {p.icon}
          {p.label}
        </button>
      ))}
    </div>
  );
}
