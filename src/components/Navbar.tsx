"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, ChevronDown, Menu, X } from "lucide-react";
import { useCart } from "@/src/context/CartContext";
import { useAuth } from "@/src/context/AuthContext";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartContext = useCart() as any;
  const cartData =
    cartContext?.items || cartContext?.cartItems || cartContext?.cart || [];

  const authContext = useAuth() as any;
  const user = authContext?.user || null;
  const profile = authContext?.profile || null;

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

  const navLinkClass =
    "shrink-0 whitespace-nowrap text-xs font-bold tracking-wider text-[#fdfbf7] hover:text-[#c5a25d] transition-colors";

  function searchProducts() {
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full max-w-full border-b-2 border-[#0b3c32] bg-white">
      {/* Header chính */}
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-[1fr_auto] items-center gap-x-3 gap-y-3 px-3 py-3 sm:px-4 lg:flex lg:justify-between lg:gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="col-start-1 row-start-1 justify-self-start text-center no-underline lg:order-2 lg:mx-auto lg:justify-self-auto"
        >
          <h1 className="m-0 whitespace-nowrap font-serif-luxury text-lg font-bold uppercase tracking-wider text-[#0b3c32] sm:text-xl lg:text-[22px] lg:tracking-[2px]">
            Quoc Perfume
          </h1>
          <p className="m-0 mt-0.5 text-[8px] font-semibold uppercase tracking-wider text-[#c5a25d] sm:text-[10px]">
            Magic Of Your Emotions
          </p>
        </Link>

        {/* Nút bên phải */}
        <div className="col-start-2 row-start-1 flex items-center justify-self-end gap-3 sm:gap-4 lg:order-3">
          <Link
            href={user ? "/account" : "/login"}
            aria-label={user ? "Tài khoản của tôi" : "Đăng nhập"}
            title={
              user
                ? profile?.full_name || user.email || "Tài khoản"
                : "Đăng nhập"
            }
            className="hidden max-w-40 truncate text-xs font-semibold text-[#374151] no-underline sm:block"
          >
            {user
              ? profile?.full_name || user.email || "Tài khoản"
              : "Đăng nhập"}
          </Link>

          {user && (
            <Link
              href="/orders"
              aria-label="Đơn hàng của tôi"
              title="Đơn hàng của tôi"
              className="hidden text-xs font-semibold text-[#0b3c32] no-underline xl:block"
            >
              Đơn hàng
            </Link>
          )}

          <Link
            href="/wishlist"
            aria-label="Danh sách yêu thích"
            title="Yêu thích"
            className="flex shrink-0 text-[#374151]"
          >
            <Heart size={19} />
          </Link>

          <Link
            href="/cart"
            aria-label="Giỏ hàng"
            title="Giỏ hàng"
            className="relative flex shrink-0 text-[#374151]"
          >
            <ShoppingBag size={19} />
            {totalCartCount > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                {totalCartCount}
              </span>
            )}
          </Link>

          {/* Nút menu chỉ hiện trên điện thoại */}
          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex shrink-0 items-center justify-center text-[#0b3c32] sm:hidden"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Tìm kiếm: xuống hàng trên điện thoại */}
        <div className="relative col-span-2 row-start-2 w-full min-w-0 lg:order-1 lg:col-span-1 lg:row-auto lg:max-w-[320px] lg:flex-1">
          <input
            type="search"
            placeholder="Tìm kiếm sản phẩm..."
            aria-label="Tìm kiếm sản phẩm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") searchProducts();
            }}
            className="w-full min-w-0 rounded-md border border-gray-300 px-3 py-2 pr-9 text-[13px] outline-none transition focus:border-[#c5a25d] focus:ring-1 focus:ring-[#c5a25d]/40"
          />
          <button
            type="button"
            onClick={searchProducts}
            aria-label="Tìm kiếm"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      {/* Menu điều hướng */}
      <nav className="relative border-t border-gray-100 bg-[#0b3c32]">
        <div className="mx-auto max-w-[1200px]">
          <ul className="flex items-center justify-start gap-6 overflow-x-auto overscroll-x-contain px-4 py-3 sm:justify-center sm:gap-7 lg:gap-8">
            <li className="shrink-0">
              <Link href="/" className={navLinkClass}>
                TRANG CHỦ
              </Link>
            </li>
            <li className="shrink-0">
              <Link href="/about" className={navLinkClass}>
                GIỚI THIỆU
              </Link>
            </li>

            <li
              className="relative flex shrink-0 items-center gap-1"
              onMouseEnter={() => setIsMegaOpen(true)}
              onMouseLeave={() => setIsMegaOpen(false)}
            >
              <Link href="/products" className={navLinkClass}>
                THƯƠNG HIỆU
              </Link>
              <button
                type="button"
                aria-label="Mở danh sách thương hiệu"
                aria-expanded={isMegaOpen}
                onClick={() => setIsMegaOpen(!isMegaOpen)}
                className="text-white"
              >
                <ChevronDown size={13} />
              </button>

              {isMegaOpen && (
                <div className="absolute left-1/2 top-full z-[60] grid w-[min(600px,90vw)] -translate-x-1/2 grid-cols-2 gap-3 rounded-b-lg border border-gray-200 bg-white p-4 font-normal normal-case shadow-lg sm:grid-cols-3 sm:p-5">
                  {brands.map((brand) => (
                    <Link
                      key={brand}
                      href={`/products?brand=${encodeURIComponent(brand)}`}
                      onClick={() => setIsMegaOpen(false)}
                      className="break-words text-xs text-gray-700 no-underline hover:text-[#c5a25d]"
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            <li className="shrink-0">
              <Link href="/products" className={navLinkClass}>
                NƯỚC HOA
              </Link>
            </li>
            <li className="shrink-0">
              <Link href="/recommend" className={navLinkClass}>
                TƯ VẤN AI
              </Link>
            </li>
            <li className="shrink-0">
              <Link href="/contact" className={navLinkClass}>
                LIÊN HỆ
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Menu phụ trên điện thoại */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 shadow-md sm:hidden">
          <div className="flex flex-col gap-4">
            <Link
              href={user ? "/account" : "/login"}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-[#0b3c32] no-underline"
            >
              {user
                ? profile?.full_name || user.email || "Tài khoản"
                : "Đăng nhập"}
            </Link>

            {user && (
              <Link
                href="/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm text-gray-700 no-underline"
              >
                Đơn hàng của tôi
              </Link>
            )}

            <Link
              href="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm text-gray-700 no-underline"
            >
              Danh sách yêu thích
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
