"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const phone = "00375 034 145";
  const email = "luuvanquoc9999@gmail.com";
  const address = "Gò Vấp, TP. Hồ Chí Minh, Việt Nam";

  // Google Maps tìm kiếm theo địa chỉ, không phải link đến một địa điểm đã xác minh.
  const mapsUrl =
    "https://www.google.com/maps/place/440+%C4%90.+Th%E1%BB%91ng+Nh%E1%BA%A5t,+An+H%E1%BB%99i+%C4%90%C3%B4ng,+H%E1%BB%93+Ch%C3%AD+Minh,+Vi%E1%BB%87t+Nam/@10.8452172,106.6622958,17z/data=!3m1!4b1!4m6!3m5!1s0x317529aff9559289:0x59749af3881bdfa5!8m2!3d10.8452172!4d106.6648707!16s%2Fg%2F11k4jl98d8?entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D";
  // Chưa có URL mạng xã hội thật nên không gắn link giả.
  const socialLinks = [
    {
      name: "Facebook",
      image: "/images/socials/fb.png",
      url: "https://www.facebook.com/luu.van.quoc.447209/?locale=vi_VN",
    },
    {
      name: "Instagram",
      image: "/images/socials/ins.png",
      url: "https://www.instagram.com/qluu_._/",
    },
    {
      name: "YouTube",
      image: "/images/socials/youtube.png",
      url: "https://www.youtube.com/@QuocLuu-bg1hp",
    },
    { name: "Google Maps", image: "/images/socials/map.png", url: mapsUrl },
  ];

  return (
    <footer className="bg-[#0b3c32] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Về Quoc Perfume */}
          <div>
            <h3 className="mb-4 text-lg font-bold uppercase">
              Về Quoc Perfume
            </h3>

            <ul className="space-y-2 text-sm text-gray-200">
              <li>
                <Link href="/" className="transition hover:text-white">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-white">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/products" className="transition hover:text-white">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-white">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Hướng dẫn */}
          <div>
            <h3 className="mb-4 text-lg font-bold uppercase">Hướng dẫn</h3>

            <ul className="space-y-2 text-sm text-gray-200">
              <li>
                <Link
                  href="/guide/purchase"
                  className="transition hover:text-white"
                >
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li>
                <Link
                  href="/guide/payment"
                  className="transition hover:text-white"
                >
                  Hướng dẫn thanh toán
                </Link>
              </li>
              <li>
                <Link
                  href="/guide/inspection"
                  className="transition hover:text-white"
                >
                  Hướng dẫn kiểm hàng
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition hover:text-white">
                  Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Chính sách */}
          <div>
            <h3 className="mb-4 text-lg font-bold uppercase">Chính sách</h3>

            <ul className="space-y-2 text-sm text-gray-200">
              <li>
                <Link
                  href="/policies/purchase"
                  className="transition hover:text-white"
                >
                  Chính sách mua hàng
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/privacy"
                  className="transition hover:text-white"
                >
                  Chính sách bảo mật thông tin
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/shipping"
                  className="transition hover:text-white"
                >
                  Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/returns"
                  className="transition hover:text-white"
                >
                  Chính sách đổi trả - bảo hành
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/payment-security"
                  className="transition hover:text-white"
                >
                  Bảo mật thanh toán
                </Link>
              </li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h3 className="mb-4 text-lg font-bold uppercase">Hỗ trợ</h3>

            <ul className="space-y-2 text-sm text-gray-200">
              <li>
                <Link href="/products" className="transition hover:text-white">
                  Tìm kiếm sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-white">
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link href="/register" className="transition hover:text-white">
                  Đăng ký
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="transition hover:text-white"
                >
                  Liên hệ cộng tác viên
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Thông tin liên hệ */}
        <div className="mt-10 border-t border-white/20 pt-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-lg font-bold">
                HỘ KINH DOANH QUOC PERFUME
              </h3>

              <ul className="space-y-3 text-sm text-gray-200">
                <li>
                  <span className="font-semibold text-white">Địa chỉ: </span>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-white hover:underline"
                  >
                    {address}
                  </a>
                </li>

                <li>
                  <span className="font-semibold text-white">Điện thoại: </span>
                  <a
                    href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                    className="transition hover:text-white hover:underline"
                  >
                    {phone}
                  </a>
                </li>

                <li>
                  <span className="font-semibold text-white">Email: </span>
                  <a
                    href={`mailto:${email}`}
                    className="transition hover:text-white hover:underline"
                  >
                    {email}
                  </a>
                </li>
              </ul>
            </div>

            {/* Mạng xã hội */}
            <div>
              <h3 className="mb-4 text-lg font-bold">KẾT NỐI VỚI CHÚNG TÔI</h3>

              <div className="flex flex-wrap items-center gap-4">
                {socialLinks.map((social) => (
                  <div key={social.name}>
                    {social.url ? (
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                        title={social.name}
                        className="inline-flex items-center justify-center transition hover:opacity-80"
                      >
                        <img
                          src={social.image}
                          alt={social.name}
                          className="h-8 w-8 object-contain"
                        />
                      </a>
                    ) : (
                      <span
                        aria-label={`${social.name} chưa được liên kết`}
                        title={`${social.name}: chưa cung cấp đường dẫn`}
                        className="inline-flex cursor-not-allowed items-center justify-center opacity-50"
                      >
                        <img
                          src={social.image}
                          alt={social.name}
                          className="h-8 w-8 object-contain"
                        />
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <p className="mt-3 text-xs text-gray-300">
                Các trang mạng xã hội sẽ được liên kết khi có URL chính thức.
              </p>
            </div>
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <div className="mt-8 border-t border-white/20 pt-6">
          <h3 className="mb-4 text-sm font-bold uppercase">
            Phương thức thanh toán
          </h3>

          <div className="flex flex-wrap items-center gap-3">
            {[
              "/images/payments/visa.png",
              "/images/payments/mastercard.png",
              "/images/payments/jcb.png",
              "/images/payments/napas.jpg",
              "/images/payments/cash.png",
              "/images/payments/banking.png",
              "/images/payments/vnpay.png",
              "/images/payments/momo.png",
            ].map((image) => (
              <div
                key={image}
                className="flex h-10 w-16 items-center justify-center rounded bg-white p-1"
              >
                <img
                  src={image}
                  alt="Phương thức thanh toán"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Badge xác thực */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-6">
          <div className="flex items-center gap-3">
            <img
              src="/images/badges/dcma.png"
              alt="DCMA"
              className="h-10 w-auto object-contain"
            />
            <img
              src="/images/badges/bct.png"
              alt="Đã thông báo Bộ Công Thương"
              className="h-10 w-auto object-contain"
            />
          </div>

          <p className="text-sm text-gray-300">
            Quoc Perfume | Magic Of Your Emotions
          </p>
        </div>
      </div>
    </footer>
  );
}
