import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  Award,
  ArrowRight,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans">
      {/* 1. Hero Banner - Đậm chất nghệ thuật */}
      <section className="relative bg-[#faf9f6] py-20 md:py-28 border-b border-gray-100 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <span className="text-xs font-semibold tracking-[0.3em] text-[#0b3c32] uppercase block mb-3">
            Hành Trình Của Mùi Hương
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6 tracking-wide uppercase">
            Quoc Perfume
          </h1>
          <div className="w-12 h-[2px] bg-[#0b3c32] mx-auto mb-6"></div>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto font-light">
            Mỗi giọt nước hoa không đơn thuần là sự pha trộn của các tầng hương,
            mà là một tác phẩm nghệ thuật đánh thức ký ức, định hình khí chất và
            tôn vinh vẻ đẹp độc bản của bạn.
          </p>
        </div>
      </section>

      {/* 2. Câu chuyện thương hiệu - Grid 2 cột lệch thanh lịch */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 relative">
            <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=1000"
                alt="Nghệ thuật nước hoa"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Khung trang trí nhỏ phía dưới */}
            <div className="hidden md:block absolute -bottom-6 -right-6 bg-[#0b3c32] text-white p-6 rounded-xl shadow-lg max-w-[200px]">
              <p className="text-2xl font-serif font-bold">100%</p>
              <p className="text-[11px] text-emerald-100 uppercase tracking-wider mt-1">
                Tinh dầu nhập khẩu chính hãng
              </p>
            </div>
          </div>

          <div className="md:col-span-7 space-y-6 md:pl-6">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#0b3c32] uppercase">
              Tầm Nhìn & Sứ Mệnh
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">
              Định Hình Khí Chất Qua Từng Nốt Hương
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              Được thành lập với niềm khao khát mang đến những trải nghiệm khứu
              giác đỉnh cao,{" "}
              <strong className="text-gray-900 font-semibold">
                The Q Dynasty
              </strong>{" "}
              tập trung tuyển chọn các dòng nước hoa niche và cao cấp hàng đầu
              thế giới.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              Chúng tôi tin rằng mùi hương chính là chiếc trang phục vô hình
              nhưng để lại ấn tượng sâu sắc nhất. Từ tầng hương đầu tươi mát đến
              nốt hương cuối ấm áp, mỗi sản phẩm đều kể lại một câu chuyện đầy
              cảm xúc.
            </p>

            {/* Chỉ số nổi bật */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100">
              <div>
                <p className="text-2xl font-serif font-bold text-[#0b3c32]">
                  500+
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Mùi hương tuyển chọn
                </p>
              </div>
              <div>
                <p className="text-2xl font-serif font-bold text-[#0b3c32]">
                  50+
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Thương hiệu quốc tế
                </p>
              </div>
              <div>
                <p className="text-2xl font-serif font-bold text-[#0b3c32]">
                  99%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Khách hàng hài lòng
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Cam kết thương hiệu */}
      <section className="bg-[#faf9f6] py-20 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 uppercase tracking-wide">
              Giá Trị Khác Biệt
            </h2>
            <p className="text-xs text-gray-500 mt-2 tracking-wider uppercase">
              Những tiêu chuẩn vàng tạo nên niềm tin
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-[#0b3c32] rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider">
                Chính Hãng 100%
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                Nguồn gốc rõ ràng, đầy đủ chứng nhận và cam kết hoàn tiền nếu
                phát hiện sai lệch.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-[#0b3c32] rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider">
                Lưu Hương Vượt Trội
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                Tuyển chọn dòng nước hoa có nồng độ tinh dầu EDP & Parfum đạt
                chuẩn giữ mùi lâu dài.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-[#0b3c32] rounded-full flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider">
                Tư Vấn AI Độc Quyền
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                Thuật toán thông minh giúp phân tích tính cách để gợi ý mùi
                hương hoàn hảo nhất.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-[#0b3c32] rounded-full flex items-center justify-center mx-auto">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider">
                Trải Nghiệm Tận Tâm
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                Đóng gói quà tặng cao cấp và chính sách chăm sóc khách hàng chu
                đáo từng đơn hàng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Banner Call To Action */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="bg-[#0b3c32] text-white rounded-3xl p-10 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-emerald-200 uppercase">
              Bắt Đầu Hành Trình
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold">
              Tìm Mùi Hương Định Hình Phong Cách Của Bạn
            </h2>
            <p className="text-xs md:text-sm text-emerald-100 font-light leading-relaxed">
              Hãy để The Q Dynasty đồng hành cùng bạn trên con đường khám phá vẻ
              đẹp độc bản.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                href="/products"
                className="bg-white text-[#0b3c32] text-xs font-bold px-8 py-3.5 rounded-full hover:bg-emerald-50 transition duration-300 flex items-center gap-2"
              >
                Khám Phá Bộ Sưu Tập <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/recommend"
                className="border border-emerald-400 text-white text-xs font-bold px-8 py-3.5 rounded-full hover:bg-white/10 transition duration-300"
              >
                Trải Nghiệm Tư Vấn AI
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
