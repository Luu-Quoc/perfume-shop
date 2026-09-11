export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-16 pb-24 md:px-12">
      <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
        <div>
          <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight text-ink">
            Tìm mùi hương
            <br />
            kể câu chuyện của bạn
          </h1>
          <p className="mt-4 text-lg text-ink/70 max-w-md">
            Hơn 50 dòng nước hoa được tuyển chọn, cùng gợi ý bằng AI dựa trên
            đúng sở thích và dịp bạn cần dùng.
          </p>
          <a
            href="/products"
            className="inline-block mt-8 bg-tangerine text-white font-display font-medium px-6 py-3 rounded-full hover:bg-plum transition-colors"
          >
            Khám phá bộ sưu tập
          </a>
        </div>

        <div className="relative h-72 md:h-96">
          <div className="absolute inset-0 bg-plum rounded-blob opacity-90" />
          <div className="absolute inset-6 bg-lime rounded-blob opacity-60 mix-blend-multiply" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-white text-xl">
              ✦ nước hoa ✦
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
