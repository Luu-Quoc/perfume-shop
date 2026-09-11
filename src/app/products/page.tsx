"use client";

import React, { useState, useEffect } from "react";
import { getAllProducts } from "@/src/lib/products";
import { Product } from "@/src/lib/types";
import ProductGrid from "@/src/components/ProductGrid";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // States bộ lọc
  const [searchBrand, setSearchBrand] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data || []);
        setFilteredProducts(data || []);
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Xử lý lọc & sắp xếp sản phẩm
  useEffect(() => {
    let result = [...products];

    // Lọc theo thương hiệu
    if (searchBrand.trim() !== "") {
      const keyword = searchBrand.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(keyword) ||
          p.description?.toLowerCase().includes(keyword),
      );
    }

    // Sắp xếp
    if (sortBy === "price-asc") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    setFilteredProducts(result);
  }, [searchBrand, sortBy, products]);

  return (
    <div className="bg-white min-h-screen py-6 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb đường dẫn */}
        <div className="text-xs text-gray-500 mb-6">
          <span>Trang chủ</span> <span className="mx-1">&gt;</span>{" "}
          <span className="text-gray-900 font-medium">
            Nước hoa Nam chính hãng
          </span>
        </div>

        {/* Khung Bố Cục 2 Cột */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* CỘT BÊN TRÁI: BỘ LỌC */}
          <aside className="md:col-span-1 space-y-6">
            <div>
              <h2 className="text-sm font-bold uppercase text-gray-900">
                BỘ LỌC
              </h2>
              <p className="text-[11px] text-gray-500 mb-4">
                Giúp lọc nhanh sản phẩm bạn tìm kiếm
              </p>

              {/* Lọc Thương hiệu */}
              <div className="border-t border-gray-100 pt-4 mb-6">
                <h3 className="text-xs font-bold text-gray-800 mb-2">
                  Thương hiệu
                </h3>
                <div className="flex items-center mb-3">
                  <input
                    type="text"
                    placeholder="Tìm Thương hiệu"
                    value={searchBrand}
                    onChange={(e) => setSearchBrand(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-200 rounded-l focus:outline-none focus:border-emerald-800"
                  />
                  <button className="bg-[#0b3c32] text-white p-2 text-xs rounded-r">
                    🔍
                  </button>
                </div>

                <div className="space-y-2 text-xs text-gray-600 max-h-40 overflow-y-auto pr-2">
                  {[
                    "Lattafa",
                    "Guerlain",
                    "Xerjoff",
                    "Butterfly Thai Perfume",
                    "Dior",
                    "Chanel",
                  ].map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center space-x-2 cursor-pointer hover:text-emerald-800"
                    >
                      <input
                        type="radio"
                        name="brandFilter"
                        onChange={() => setSearchBrand(brand)}
                        checked={
                          searchBrand.toLowerCase() === brand.toLowerCase()
                        }
                        className="accent-[#0b3c32]"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Lọc Giá sản phẩm */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-xs font-bold text-gray-800 mb-2">
                  Giá sản phẩm
                </h3>
                <div className="space-y-2 text-xs text-gray-600">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="accent-[#0b3c32]" />
                    <span>Giá dưới 100.000đ</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="accent-[#0b3c32]" />
                    <span>100.000đ - 700.000đ</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="accent-[#0b3c32]" />
                    <span>700.000đ - 3.000.000đ</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* CỘT BÊN PHẢI: DANH SÁCH SẢN PHẨM */}
          <main className="md:col-span-3">
            {/* Tiêu đề & Thanh Xếp theo */}
            <div className="border-b border-gray-100 pb-3 mb-6">
              <h1 className="text-xl font-bold text-gray-900 mb-3">
                Nước hoa Nam chính hãng
              </h1>

              <div className="flex flex-wrap items-center justify-between text-xs text-gray-600 gap-4">
                <div className="flex items-center space-x-4">
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

                <div className="text-gray-400">
                  Xem: <span className="font-bold text-gray-800">▧ Lưới</span>
                </div>
              </div>
            </div>

            {/* Hiển thị Sản phẩm */}
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
