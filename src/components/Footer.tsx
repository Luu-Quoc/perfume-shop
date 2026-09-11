"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0b3c32] text-white text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hàng 1: Điều hướng */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-emerald-800/60">
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-3 text-emerald-100">
              Về Quoc Perfume
            </h3>
            <ul className="space-y-2 text-emerald-100/80">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-3 text-emerald-100">
              HƯỚNG DẪN
            </h3>
            <ul className="space-y-2 text-emerald-100/80">
              <li>
                <a href="#" className="hover:text-white transition">
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Hướng dẫn thanh toán
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Hướng dẫn kiểm hàng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-3 text-emerald-100">
              CHÍNH SÁCH
            </h3>
            <ul className="space-y-2 text-emerald-100/80">
              <li>
                <a href="#" className="hover:text-white transition">
                  Chính sách mua hàng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Chính sách bảo mật thông tin
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Chính sách giao hàng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Chính sách đổi trả - bảo hành
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Chính sách bảo mật thanh toán
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-3 text-emerald-100">
              HỖ TRỢ
            </h3>
            <ul className="space-y-2 text-emerald-100/80">
              <li>
                <Link href="/products" className="hover:text-white transition">
                  Tìm kiếm
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Đăng ký
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Cộng tác viên
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Hàng 2: Thanh toán, Mạng xã hội & Thông tin liên hệ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 items-start">
          {/* Cột 1: Phương thức thanh toán (Ô cố định 56x36px) */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider mb-3 text-emerald-100">
              PHƯƠNG THỨC THANH TOÁN
            </h3>
            <div className="flex flex-wrap gap-2 max-w-[280px]">
              {[
                { src: "/images/payments/visa.png", alt: "Visa" },
                { src: "/images/payments/mastercard.png", alt: "Mastercard" },
                { src: "/images/payments/jcb.png", alt: "JCB" },
                { src: "/images/payments/napas.jpg", alt: "Napas" },
                { src: "/images/payments/cash.png", alt: "Tiền mặt" },
                {
                  src: "/images/payments/banking.png",
                  alt: "Internet Banking",
                },
                { src: "/images/payments/vnpay.png", alt: "VNPAY" },
                { src: "/images/payments/momo.png", alt: "MoMo" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="w-[56px] h-[36px] bg-white rounded-md p-1.5 flex items-center justify-center shadow-sm overflow-hidden hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Cột 2: Mạng xã hội & Badge chứng nhận */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider mb-3 text-emerald-100">
              KẾT NỐI VỚI CHÚNG TÔI
            </h3>

            {/* Icon Mạng Xã Hội tròn đều 36x36px */}
            <div className="flex items-center space-x-3 mb-4">
              {[
                { src: "/images/socials/fb.png", alt: "Facebook" },
                { src: "/images/socials/ins.png", alt: "Instagram" },
                { src: "/images/socials/youtube.png", alt: "Youtube" },
                { src: "/images/socials/map.png", alt: "Google Maps" },
              ].map((soc, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-9 h-9 rounded-full overflow-hidden block hover:scale-110 transition-transform duration-200 shadow-sm"
                >
                  <img
                    src={soc.src}
                    alt={soc.alt}
                    className="w-full h-full object-cover"
                  />
                </a>
              ))}
            </div>

            {/* Badge DMCA & Bộ Công Thương */}
            <div className="space-y-2.5">
              <div className="inline-block bg-white/10 p-1 rounded backdrop-blur-sm border border-emerald-700/50">
                <img
                  src="/images/badges/dcma.png"
                  alt="DMCA Protected"
                  className="h-6 w-auto object-contain"
                />
              </div>
              <div>
                <img
                  src="/images/badges/bct.png"
                  alt="Đã thông báo Bộ Công Thương"
                  className="h-10 w-auto object-contain drop-shadow"
                />
              </div>
            </div>
          </div>

          {/* Cột 3: Thông tin liên hệ */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider mb-3 text-emerald-100">
              THÔNG TIN LIÊN HỆ
            </h3>
            <div className="space-y-1.5 text-emerald-100/80 leading-relaxed">
              <p className="font-semibold text-white">
                Hộ Kinh Doanh Quoc Perfume
              </p>
              <p>Địa chỉ: Gò Vấp , TP. Hồ Chí Minh, Việt Nam</p>
              <p>Điện thoại: 00375 034 145</p>
              <p>Email: luuvanquoc9999@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#072721] py-3 text-center text-[11px] text-emerald-200/60 border-t border-emerald-950">
        Quoc Perfume | Magic Of Your Emotions
      </div>
    </footer>
  );
}
