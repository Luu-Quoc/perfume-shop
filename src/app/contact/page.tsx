"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Cảm ơn bạn đã gửi liên hệ!");
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#faf9f6] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        {/* Header Form */}
        <div className="text-center mb-6">
          <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-xs text-gray-500">
            Nếu bạn có thắc mắc về sản phẩm hoặc dịch vụ tư vấn mùi hương, hãy
            để lại thông tin bên dưới.
          </p>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              required
              placeholder="Nhập tên của bạn"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-amber-600 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="nguyenvana@gmail.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-amber-600 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
              Nội dung
            </label>
            <textarea
              rows={4}
              required
              placeholder="Bạn cần hỗ trợ gì..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-amber-600 focus:bg-white transition resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold uppercase tracking-wider py-3 rounded-md transition duration-200 shadow-sm"
          >
            Gửi liên hệ
          </button>
        </form>
      </div>
    </div>
  );
}
