"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    title: "Tìm mùi hương kể câu chuyện của bạn",
    subtitle:
      "Khám phá những dòng nước hoa tinh tế, lưu giữ dấu ấn riêng của bạn.",
    image:
      "https://zundtducakozwrdunafo.supabase.co/storage/v1/object/public/banner/banner1.jpg",
    label: "DISCOVER YOUR SIGNATURE SCENT",
  },
  {
    title: "Hương thơm tạo nên dấu ấn riêng",
    subtitle: "Lựa chọn hương thơm phù hợp với phong cách và cá tính của bạn.",
    image:
      "https://zundtducakozwrdunafo.supabase.co/storage/v1/object/public/banner/bn2.jpg",
    label: "YOUR SCENT, YOUR STORY",
  },
  {
    title: "Tỏa sáng trong từng khoảnh khắc",
    subtitle: "Tìm kiếm mùi hương hoàn hảo cho những dịp đặc biệt của bạn.",
    image:
      "https://zundtducakozwrdunafo.supabase.co/storage/v1/object/public/banner/bn3.jpg",
    label: "MAGIC OF YOUR EMOTIONS",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const previousSlide = () => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const banner = banners[current];

  return (
    <section className="relative overflow-hidden bg-brand-cream">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-10 sm:px-8 md:grid-cols-2 md:gap-12 md:px-12 md:py-16">
        <div key={current} className="animate-fade-in-up order-2 md:order-1">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
            {banner.label}
          </span>

          <h1 className="font-serif-luxury text-3xl font-bold leading-tight text-brand-emerald sm:text-4xl md:text-5xl lg:text-6xl">
            {banner.title}
          </h1>

          <p className="mt-4 max-w-md text-sm leading-7 text-gray-600 sm:text-base md:text-lg">
            {banner.subtitle}
          </p>

          <Link
            href="/products"
            className="btn-glow mt-7 inline-block rounded-full bg-brand-emerald px-7 py-3 font-medium text-white transition-colors hover:bg-brand-emerald-dark"
          >
            Khám phá bộ sưu tập
          </Link>
        </div>

        <div className="relative order-1 md:order-2">
          <div className="relative h-64 overflow-hidden rounded-2xl sm:h-80 md:h-[420px]">
            {banners.map((item, index) => (
              <div
                key={item.image}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  current === index
                    ? "opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.label}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}

            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

            <div className="absolute bottom-5 left-5 text-sm font-semibold tracking-[0.2em] text-white sm:bottom-7 sm:left-7">
              QUOC PERFUME
            </div>

            <button
              type="button"
              onClick={previousSlide}
              aria-label="Ảnh trước"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-brand-emerald shadow transition hover:bg-white"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Ảnh tiếp theo"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-brand-emerald shadow transition hover:bg-white"
            >
              <ChevronRight size={22} />
            </button>

            <div className="absolute bottom-5 right-5 flex items-center gap-2">
              {banners.map((item, index) => (
                <button
                  key={item.image}
                  type="button"
                  onClick={() => setCurrent(index)}
                  aria-label={`Chuyển đến banner ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    current === index
                      ? "w-7 bg-white"
                      : "w-2.5 bg-white/60 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
