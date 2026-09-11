"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getAllProducts } from "@/src/lib/products";
import { Product } from "@/src/lib/types";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getAllProducts();
        if (data) setProducts(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div style={{ width: "100%", backgroundColor: "#ffffff" }}>
      {/* Banner Quảng Cáo */}
      <section
        style={{ maxWidth: "1200px", margin: "24px auto", padding: "0 16px" }}
      >
        <div
          style={{
            width: "100%",
            height: "360px",
            borderRadius: "12px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1600"
            alt="Perfume Banner"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </section>

      {/* Danh sách sản phẩm từ DB */}
      <section
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 16px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            borderBottom: "2px solid #f3f4f6",
            paddingBottom: "12px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#111827",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Sản phẩm nổi bật
          </h2>
          <Link
            href="/products"
            style={{
              fontSize: "13px",
              color: "#b45309",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Xem tất cả &rarr;
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {products.length > 0 ? (
            products.slice(0, 8).map((product) => (
              <div
                key={product.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "12px",
                  textAlign: "center",
                  backgroundColor: "#fff",
                }}
              >
                <Link
                  href={`/products/${product.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <img
                    src={product.image_url || "https://via.placeholder.com/200"}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "contain",
                      marginBottom: "12px",
                    }}
                  />
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#1f2937",
                      height: "36px",
                      overflow: "hidden",
                      margin: "6px 0",
                    }}
                  >
                    {product.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#b45309",
                      margin: "4px 0",
                    }}
                  >
                    {product.price?.toLocaleString("vi-VN")} đ
                  </p>
                </Link>
              </div>
            ))
          ) : (
            <p style={{ fontSize: "14px", color: "#6b7280" }}>
              Đang tải danh sách nước hoa...
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
