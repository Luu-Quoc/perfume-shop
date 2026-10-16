"use client";

import React, { useState, useEffect } from "react";
import { getProducts } from "@/src/lib/products";
import type { Product } from "@/src/lib/types";
import ProductGrid from "@/src/components/ProductGrid";

const PRICE_RANGES = [
  { id: "under100", label: "Giá dưới 100.000đ", min: 0, max: 100000 },
  { id: "100to700", label: "100.000đ - 700.000đ", min: 100000, max: 700000 },
  {
    id: "700to3000",
    label: "700.000đ - 3.000.000đ",
    min: 700000,
    max: 3000000,
  },
  { id: "over3000", label: "Trên 3.000.000đ", min: 3000000, max: Infinity },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchBrand, setSearchBrand] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data || []);
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Tự lấy danh sách thương hiệu từ các sản phẩm trong Supabase
  const brands = Array.from(
    new Set(
      products
        .map((p) => p.brand?.trim())
        .filter((brand): brand is string => Boolean(brand)),
    ),
  ).sort((a, b) => a.localeCompare(b, "vi"));

  // Danh sách thương hiệu sau khi tìm kiếm trong ô tìm thương hiệu
  const visibleBrands = brands.filter((brand) =>
    brand.toLowerCase().includes(searchBrand.trim().toLowerCase()),
  );

  // Chọn hoặc bỏ chọn một thương hiệu
  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((item) => item !== brand)
        : [...prev, brand],
    );
  };

  // Chọn hoặc bỏ chọn tất cả thương hiệu
  const toggleAllBrands = () => {
    const allVisibleSelected =
      visibleBrands.length > 0 &&
      visibleBrands.every((brand) => selectedBrands.includes(brand));

    if (allVisibleSelected) {
      setSelectedBrands((prev) =>
        prev.filter((brand) => !visibleBrands.includes(brand)),
      );
    } else {
      setSelectedBrands((prev) =>
        Array.from(new Set([...prev, ...visibleBrands])),
      );
    }
  };

  // Chọn hoặc bỏ chọn một khoảng giá
  const togglePrice = (priceId: string) => {
    setSelectedPrices((prev) =>
      prev.includes(priceId)
        ? prev.filter((id) => id !== priceId)
        : [...prev, priceId],
    );
  };

  // Chọn hoặc bỏ chọn tất cả mức giá
  const toggleAllPrices = () => {
    setSelectedPrices((prev) =>
      prev.length === PRICE_RANGES.length ? [] : PRICE_RANGES.map((p) => p.id),
    );
  };

  // Lọc và sắp xếp sản phẩm
  const filteredProducts = products
    .filter((p) => {
      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.includes(p.brand?.trim() || "");

      const price = Number(p.price) || 0;
      const matchesPrice =
        selectedPrices.length === 0 ||
        selectedPrices.some((id) => {
          const range = PRICE_RANGES.find((item) => item.id === id);
          if (!range) return false;

          // Các khoảng giá không bị tính trùng ở điểm giao nhau
          if (range.id === "under100") return price < 100000;
          if (range.id === "100to700") return price >= 100000 && price < 700000;
          if (range.id === "700to3000")
            return price >= 700000 && price <= 3000000;
          return price > 3000000;
        });

      return matchesBrand && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
      if (sortBy === "price-desc") return Number(b.price) - Number(a.price);

      return (
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime()
      );
    });

  const allVisibleBrandsSelected =
    visibleBrands.length > 0 &&
    visibleBrands.every((brand) => selectedBrands.includes(brand));

  const allPricesSelected = selectedPrices.length === PRICE_RANGES.length;

  return (
    <div className="bg-white min-h-screen py-6 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-xs text-gray-500 mb-6">
          <span>Trang chủ</span> <span className="mx-1">&gt;</span>
          <span className="text-gray-900 font-medium">Nước hoa chính hãng</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* BỘ LỌC */}
          <aside className="md:col-span-1 space-y-6">
            <div>
              <h2 className="text-sm font-bold uppercase text-gray-900">
                BỘ LỌC
              </h2>
              <p className="text-[11px] text-gray-500 mb-4">
                Giúp lọc nhanh sản phẩm bạn tìm kiếm
              </p>

              {/* Lọc thương hiệu */}
              <div className="border-t border-gray-100 pt-4 mb-6">
                <h3 className="text-xs font-bold text-gray-800 mb-2">
                  Thương hiệu
                </h3>

                <input
                  type="text"
                  placeholder="Tìm thương hiệu"
                  value={searchBrand}
                  onChange={(e) => setSearchBrand(e.target.value)}
                  className="w-full text-xs p-2 border border-gray-200 rounded focus:outline-none focus:border-emerald-800 mb-3"
                />

                <div className="space-y-2 text-xs text-gray-600 max-h-48 overflow-y-auto pr-2">
                  <label className="flex items-center space-x-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={allVisibleBrandsSelected}
                      onChange={toggleAllBrands}
                      disabled={visibleBrands.length === 0}
                      className="accent-[#0b3c32]"
                    />
                    <span>Tất cả thương hiệu</span>
                  </label>

                  {visibleBrands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center space-x-2 cursor-pointer hover:text-emerald-800"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="accent-[#0b3c32]"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}

                  {visibleBrands.length === 0 && (
                    <p className="text-gray-400">Không tìm thấy thương hiệu.</p>
                  )}
                </div>
              </div>

              {/* Lọc giá */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-xs font-bold text-gray-800 mb-2">
                  Giá sản phẩm
                </h3>

                <div className="space-y-2 text-xs text-gray-600">
                  <label className="flex items-center space-x-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={allPricesSelected}
                      onChange={toggleAllPrices}
                      className="accent-[#0b3c32]"
                    />
                    <span>Tất cả mức giá</span>
                  </label>

                  {PRICE_RANGES.map((range) => (
                    <label
                      key={range.id}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPrices.includes(range.id)}
                        onChange={() => togglePrice(range.id)}
                        className="accent-[#0b3c32]"
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* DANH SÁCH SẢN PHẨM */}
          <main className="md:col-span-3">
            <div className="border-b border-gray-100 pb-3 mb-6">
              <h1 className="text-xl font-bold text-gray-900 mb-3">
                Nước hoa chính hãng
              </h1>

              <div className="flex flex-wrap items-center justify-between text-xs text-gray-600 gap-4">
                <div className="flex items-center space-x-4 flex-wrap gap-y-2">
                  <span className="font-semibold text-gray-800">Xếp theo:</span>

                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortBy === "newest"}
                      onChange={() => setSortBy("newest")}
                      className="accent-[#0b3c32]"
                    />
                    <span>Hàng mới</span>
                  </label>

                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortBy === "price-asc"}
                      onChange={() => setSortBy("price-asc")}
                      className="accent-[#0b3c32]"
                    />
                    <span>Giá thấp đến cao</span>
                  </label>

                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortBy === "price-desc"}
                      onChange={() => setSortBy("price-desc")}
                      className="accent-[#0b3c32]"
                    />
                    <span>Giá cao xuống thấp</span>
                  </label>
                </div>

                <span className="text-gray-500">
                  Tìm thấy:{" "}
                  <strong className="text-gray-800">
                    {filteredProducts.length}
                  </strong>{" "}
                  sản phẩm
                </span>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20 text-xs text-gray-500">
                Đang tải danh sách nước hoa...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-xs text-gray-500">
                Không tìm thấy sản phẩm phù hợp.
              </div>
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
