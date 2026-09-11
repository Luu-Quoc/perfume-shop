"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, User, ChevronDown } from "lucide-react";
import { useCart } from "@/src/context/CartContext";
import { useAuth } from "@/src/context/AuthContext";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMegaOpen, setIsMegaOpen] = useState(false);

  const cartContext = useCart() as any;
  const cartData = cartContext?.cartItems || cartContext?.cart || [];
  const authContext = useAuth?.() as any;
  const user = authContext?.user || null;

  const totalCartCount = Array.isArray(cartData)
    ? cartData.reduce(
        (total: number, item: { quantity: number }) =>
          total + (item.quantity || 0),
        0,
      )
    : 0;

  const brands = [
    "AFNAN",
    "AMOUAGE",
    "ARMAF",
    "BURBERRY",
    "BVLGARI",
    "CHANEL",
    "CREED",
    "DIOR",
    "DIPTYQUE",
    "GUCCI",
    "JO MALONE",
    "KILIAN",
    "LE LABO",
    "LOUIS VUITTON",
    "TOM FORD",
  ];

  return (
    <header
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #eaeeed",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Top Header - Nền trắng chữ đen */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        {/* Tìm kiếm */}
        <div style={{ flex: 1, maxWidth: "320px", position: "relative" }}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 36px 8px 12px",
              fontSize: "13px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <Search
            style={{
              width: "16px",
              height: "16px",
              position: "absolute",
              right: "10px",
              top: "10px",
              color: "#6b7280",
            }}
          />
        </div>

        {/* Logo */}
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "#111827",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              letterSpacing: "2px",
              margin: 0,
              textTransform: "uppercase",
              fontFamily: "serif",
            }}
          >
            Quoc Perfume
          </h1>
          <p
            style={{
              fontSize: "10px",
              letterSpacing: "1px",
              color: "#6b7280",
              textTransform: "uppercase",
              margin: "2px 0 0 0",
            }}
          >
            Magic Of Your Emotions
          </p>
        </Link>

        {/* User & Cart */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link
            href={user ? "/account" : "/login"}
            style={{
              textDecoration: "none",
              color: "#374151",
              fontSize: "13px",
              textAlign: "right",
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: "11px",
                color: "#6b7280",
              }}
            >
              Xin chào,
            </span>
            <span style={{ fontWeight: 600 }}>
              {user ? "Tài khoản" : "Đăng nhập hoặc Đăng ký"}
            </span>
          </Link>

          <Link href="/wishlist" style={{ color: "#374151" }}>
            <Heart style={{ width: "20px", height: "20px" }} />
          </Link>

          <Link
            href="/cart"
            style={{
              color: "#374151",
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ShoppingBag style={{ width: "20px", height: "20px" }} />
            {totalCartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-8px",
                  backgroundColor: "#dc2626",
                  color: "#ffffff",
                  fontSize: "10px",
                  fontWeight: "bold",
                  borderRadius: "50%",
                  width: "16px",
                  height: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {totalCartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Navigation Bar & Mega Dropdown */}
      <nav
        style={{
          borderTop: "1px solid #f3f4f6",
          backgroundColor: "#fafafa",
          padding: "10px 0",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <ul
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "32px",
              listStyle: "none",
              margin: 0,
              padding: 0,
              fontSize: "12px",
              fontWeight: "bold",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            <li>
              <Link
                href="/"
                style={{ textDecoration: "none", color: "#1f2937" }}
              >
                TRANG CHỦ
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                style={{ textDecoration: "none", color: "#1f2937" }}
              >
                GIỚI THIỆU
              </Link>
            </li>

            {/* Menu Thương Hiệu với Dropdown Hover */}
            <li
              style={{
                position: "relative",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 0",
              }}
              onMouseEnter={() => setIsMegaOpen(true)}
              onMouseLeave={() => setIsMegaOpen(false)}
            >
              <Link
                href="/products"
                style={{ textDecoration: "none", color: "#1f2937" }}
              >
                THƯƠNG HIỆU
              </Link>
              <ChevronDown style={{ width: "12px", height: "12px" }} />

              {/* Mega Dropdown */}
              {isMegaOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "600px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    borderRadius: "0 0 8px 8px",
                    padding: "20px",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "12px",
                    zIndex: 100,
                    fontWeight: "normal",
                    textTransform: "none",
                  }}
                >
                  {brands.map((brand, idx) => (
                    <Link
                      key={idx}
                      href={`/products?brand=${brand}`}
                      style={{
                        textDecoration: "none",
                        color: "#374151",
                        fontSize: "12px",
                      }}
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            <li>
              <Link
                href="/products"
                style={{ textDecoration: "none", color: "#1f2937" }}
              >
                NƯỚC HOA
              </Link>
            </li>
            <li>
              <Link
                href="/recommend"
                style={{ textDecoration: "none", color: "#1f2937" }}
              >
                TƯ VẤN AI
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                style={{ textDecoration: "none", color: "#1f2937" }}
              >
                LIÊN HỆ
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
