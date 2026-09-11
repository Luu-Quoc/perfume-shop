"use client";

import { useState } from "react";

export default function RecommendPage() {
  const [scentType, setScentType] = useState("");
  const [occasion, setOccasion] = useState("");
  const [budget, setBudget] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    const res = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scentType, occasion, budget }),
    });
    setResult(await res.json());
    setLoading(false);
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tìm nước hoa phù hợp với bạn</h1>
      <input
        placeholder="Loại hương thích"
        className="border p-2 w-full mb-2 rounded"
        value={scentType}
        onChange={(e) => setScentType(e.target.value)}
      />
      <input
        placeholder="Dịp dùng"
        className="border p-2 w-full mb-2 rounded"
        value={occasion}
        onChange={(e) => setOccasion(e.target.value)}
      />
      <input
        placeholder="Ngân sách"
        className="border p-2 w-full mb-4 rounded"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Đang tìm..." : "Gợi ý cho tôi"}
      </button>
      {result?.recommendations && (
        <ul className="mt-6 space-y-3">
          {result.recommendations.map((r: any) => (
            <li key={r.id} className="border p-3 rounded">
              <strong>Sản phẩm ID {r.id}</strong>
              <p className="text-sm text-gray-600">{r.reason}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
