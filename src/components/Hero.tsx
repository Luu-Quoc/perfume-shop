import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-cream">
      <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="animate-fade-in-up">
          <span className="text-xs font-semibold tracking-[0.3em] text-brand-gold uppercase block mb-3">
            Magic Of Your Emotions
          </span>
          <h1 className="font-serif-luxury text-4xl md:text-6xl font-bold leading-tight text-brand-emerald">
            Tìm mùi hương
            <br />
            kể câu chuyện của bạn
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-600 max-w-md">
            Hơn 50 dòng nước hoa được tuyển chọn, cùng gợi ý bằng AI dựa trên
            đúng sở thích và dịp bạn cần dùng.
          </p>
          <Link
            href="/products"
            className="btn-glow inline-block mt-8 bg-brand-emerald text-white font-medium px-7 py-3 rounded-full hover:bg-brand-emerald-dark transition-colors"
          >
            Khám phá bộ sưu tập
          </Link>
        </div>

        <div
          className="relative h-72 md:h-96 animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-emerald to-brand-emerald-dark rounded-[40%_60%_55%_45%/45%_55%_40%_60%] opacity-95" />
          <div className="absolute inset-8 border border-brand-gold/40 rounded-[45%_55%_40%_60%/55%_45%_60%_40%]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif-luxury text-white text-2xl tracking-widest">
              ✦ PERFUME ✦
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
