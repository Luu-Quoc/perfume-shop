"use client";

export default function SearchFilter({
  search,
  setSearch,
  occasion,
  setOccasion,
}: {
  search: string;
  setSearch: (v: string) => void;
  occasion: string;
  setOccasion: (v: string) => void;
}) {
  return (
    <div className="flex gap-3 mb-6">
      <input
        placeholder="Tìm theo tên..."
        className="border p-2 rounded flex-1"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        className="border p-2 rounded"
        value={occasion}
        onChange={(e) => setOccasion(e.target.value)}
      >
        <option value="">Tất cả dịp dùng</option>
        <option value="đi làm">Đi làm</option>
        <option value="dạ tiệc">Dạ tiệc</option>
        <option value="hẹn hò">Hẹn hò</option>
      </select>
    </div>
  );
}
