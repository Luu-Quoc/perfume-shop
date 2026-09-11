# Lộ trình dự án: Web nước hoa tích hợp AI + DevOps

> Mục tiêu: xây portfolio thật để xin việc/thực tập, vừa học code vừa học vận hành hệ thống (không chỉ biết viết code mà hiểu nó chạy thế nào, deploy ở đâu, sập thì xử lý ra sao).

**Trạng thái hiện tại:** Đã setup xong Next.js + Tailwind + Supabase, kết nối được database, tạo bảng `products`. Bắt đầu từ đây.

---

## GIAI ĐOẠN 0 — Hoàn thiện app cốt lõi (App Development)

### 0.1. Hiển thị danh sách sản phẩm

- Sửa `app/page.tsx` (hoặc `src/app/page.tsx`) để hiển thị sản phẩm dạng lưới (grid), dùng Tailwind.
- Tạo component `ProductCard` tái sử dụng: nhận props `name, price, image_url, scent_notes`, hiển thị dạng card.
- **Tự hỏi trước khi code:** nếu bảng `products` có 500 sản phẩm, tải hết cùng lúc có ổn không? → dẫn tới khái niệm phân trang (pagination), có thể để sau nhưng nên biết vấn đề tồn tại.

### 0.2. Trang chi tiết sản phẩm

- Tạo route động: `app/products/[id]/page.tsx`.
- Query Supabase theo `id`, hiển thị đầy đủ thông tin: mô tả, note hương, giá, ảnh lớn.
- Xử lý trường hợp `id` không tồn tại (trả về trang 404 thay vì crash trắng trang).

### 0.3. Tìm kiếm & lọc sản phẩm

- Thêm ô tìm kiếm theo tên, và bộ lọc theo `occasion` (dịp dùng) hoặc khoảng giá.
- Dùng Supabase query với `.ilike()` cho tìm kiếm gần đúng, `.gte()/.lte()` cho lọc giá.

### 0.4. Giỏ hàng đơn giản

- Dùng React Context hoặc state đơn giản để lưu giỏ hàng (chưa cần lưu vào DB ở bản đầu).
- Trang giỏ hàng hiển thị danh sách sản phẩm đã chọn, tổng tiền.
- Nút "Đặt hàng" — có thể chỉ cần lưu đơn hàng vào bảng `orders` trong Supabase, chưa cần tích hợp thanh toán thật.

### 0.5. Tích hợp AI gợi ý sản phẩm (điểm nhấn chính)

- Tạo form hỏi sở thích: loại hương thích (hoa, gỗ, ngọt, cam chanh...), dịp dùng, ngân sách.
- Tạo `app/api/recommend/route.ts`:
  - Lấy toàn bộ (hoặc phần liên quan) catalog sản phẩm từ Supabase.
  - Ghép câu trả lời của user + catalog vào 1 prompt gửi cho Claude/OpenAI API.
  - Yêu cầu AI trả về JSON có cấu trúc (ví dụ: `{ recommendations: [{id, reason}] }`) để dễ hiển thị.
  - **Quan trọng:** API key AI phải nằm trong biến môi trường server-side (không có tiền tố `NEXT_PUBLIC_`), tuyệt đối không gọi AI trực tiếp từ frontend.
- Hiển thị kết quả gợi ý kèm lý do AI đưa ra trên UI.
- **Tự hỏi:** nếu AI trả về ID sản phẩm không tồn tại trong catalog (AI "bịa"), code xử lý thế nào để không crash?

### 0.6. Polish & Deploy demo đầu tiên

- Deploy lên Vercel (miễn phí, tích hợp sẵn với Next.js, chỉ cần connect GitHub repo).
- Thêm biến môi trường (Supabase URL/key, AI API key) vào phần Environment Variables của Vercel — **không commit các key này vào code**.
- Có 1 bản demo online chạy được — đây là mốc quan trọng để bắt đầu học DevOps ở phần sau (không có gì để "vận hành" nếu chưa có app chạy).

---

## GIAI ĐOẠN 1 — Linux & Bash Scripting

**Mục tiêu:** hiểu hệ điều hành server thật hoạt động ra sao, tự động hoá việc lặp lại bằng script.

- Học lệnh cơ bản: `ls, cd, cp, mv, rm, cat, grep, find, chmod, ps, top, df, du`.
- Học biến, điều kiện, vòng lặp trong Bash.
- **Áp dụng vào project:**
  - Viết script `backup-db.sh` gọi Supabase CLI hoặc `pg_dump` để backup dữ liệu định kỳ.
  - Viết script `setup.sh` tự động cài dependency + tạo `.env.local` mẫu khi clone project về máy mới.
- **Câu hỏi vận hành:** nếu script backup chạy lúc 3h sáng mà lỗi, làm sao biết? (gợi ý: ghi log ra file, hoặc gửi thông báo — đây là tiền đề cho phần Monitoring sau này).

---

## GIAI ĐOẠN 2 — Virtualization & Cloud

**Mục tiêu:** hiểu sự khác biệt giữa "chạy trên máy mình" và "chạy trên server thật", khái niệm VM.

- Học khái niệm: máy ảo (VM) là gì, khác gì với máy vật lý, cloud provider hoạt động ra sao (AWS/GCP/Azure — chọn 1, khuyến nghị AWS vì tài liệu nhiều).
- Tạo tài khoản free tier, thử tạo 1 VM (EC2 free tier), SSH vào, cài Node.js, thử chạy thử app Next.js thủ công trên đó.
- **Áp dụng vào project:** không nhất thiết phải chuyển hẳn app sang VM (Vercel vẫn tiện hơn cho production), nhưng nên tự tay trải nghiệm 1 lần để hiểu Vercel đang "che giấu" cho bạn những gì (server, network, scaling...).

---

## GIAI ĐOẠN 3 — Containerization (Docker)

**Mục tiêu:** đóng gói app để chạy giống hệt nhau ở mọi nơi.

- Học Docker cơ bản: image, container, Dockerfile, docker-compose.
- Viết `Dockerfile` cho Next.js app.
- Viết `docker-compose.yml` nếu muốn chạy thêm Postgres local để test (tách biệt với Supabase cloud).
- **Áp dụng vào project:** containerize app, chạy thử `docker build` + `docker run` local, so sánh trải nghiệm với `npm run dev`.
- **Câu hỏi vận hành:** nếu container bị crash, ai/cái gì tự khởi động lại nó? (dẫn tới khái niệm orchestration — Kubernetes, có thể học sơ qua bằng Minikube nếu muốn đào sâu, không bắt buộc).

---

## GIAI ĐOẠN 4 — Infrastructure as Code

**Mục tiêu:** tạo hạ tầng bằng code thay vì click tay trên console, để có thể tái tạo/version control hạ tầng.

- Học Terraform: provider, resource, state file.
- Viết Terraform script để tự động tạo 1 VM hoặc resource cloud tương tự bước Giai đoạn 2, thay vì tạo tay.
- (Tuỳ chọn) Học Ansible để tự động cấu hình server sau khi VM được tạo.
- **Câu hỏi vận hành:** nếu bạn xoá nhầm hạ tầng, việc có Terraform script giúp ích gì so với việc phải nhớ lại từng bước đã click tay?

---

## GIAI ĐOẠN 5 — CI/CD (GitHub Actions)

**Mục tiêu:** tự động build/test/deploy mỗi khi push code, giảm lỗi do làm tay.

- Học cấu trúc file `.github/workflows/*.yml`.
- Viết pipeline cơ bản: mỗi lần push code → tự động chạy `npm install`, `npm run build`, (nếu có test) `npm test`.
- Mở rộng: tự động deploy lên Vercel/VM khi build pass.
- **Áp dụng vào project:** pipeline chạy trên chính repo `perfume-shop`.
- **Câu hỏi vận hành:** nếu code có lỗi mà vẫn lỡ deploy lên production, pipeline có ngăn được không? Cần thêm bước gì để ngăn (test bắt buộc pass trước khi deploy)?

---

## GIAI ĐOẠN 6 — Quality & Security (SonarQube)

**Mục tiêu:** phát hiện lỗi code, lỗ hổng bảo mật sớm, trước khi lên production.

- Setup SonarQube (có thể chạy local qua Docker — áp dụng luôn kiến thức Giai đoạn 3).
- Tích hợp SonarQube scan vào pipeline CI/CD (Giai đoạn 5) — mỗi lần push, code được scan chất lượng.
- Học đọc báo cáo: code smell, bug, vulnerability, coverage.
- **Áp dụng vào project:** chạy scan lần đầu, xem project hiện có bao nhiêu "code smell", chọn sửa vài lỗi dễ nhất.

---

## GIAI ĐOẠN 7 — Advanced IaC & Pipeline Reusability

**Mục tiêu:** tối ưu lại những gì đã làm ở Giai đoạn 4 và 5 cho gọn, dễ tái sử dụng.

- Tách Terraform thành module tái sử dụng được.
- Tách GitHub Actions workflow thành các job/step dùng lại được (reusable workflows).
- Đây là bước "dọn dẹp" — không có tính năng mới, nhưng thể hiện tư duy kỹ sư trưởng thành (điểm cộng phỏng vấn).

---

## GIAI ĐOẠN 8 — Monitoring & Observability

**Mục tiêu:** biết app đang khoẻ hay yếu mà không cần đợi user báo lỗi.

- Học Prometheus (thu thập metrics) + Grafana (hiển thị dashboard).
- Thêm endpoint đơn giản để expose metrics cơ bản của app (uptime, số request, response time).
- Dựng dashboard Grafana hiển thị các chỉ số đó.
- (Tuỳ chọn nâng cao) Thêm cảnh báo (alerting) khi có bất thường.
- **Đây là phần ít bạn cùng trang lứa có** — điểm nhấn mạnh cho portfolio.

---

## GIAI ĐOẠN 9 — Chuẩn bị hồ sơ ứng tuyển

- Viết README chi tiết cho repo:
  - Kiến trúc hệ thống (sơ đồ).
  - Cách thiết kế prompt AI và tại sao chọn cách đó.
  - Sơ đồ pipeline CI/CD.
  - Screenshot dashboard Grafana.
- Quay video demo ngắn (2-3 phút): từ code push → pipeline chạy → deploy → xem monitoring.
- Chuẩn bị trả lời câu hỏi phỏng vấn dạng: "nếu server sập lúc 3h sáng, bạn debug thế nào với hệ thống này?"

---

## Nguyên tắc xuyên suốt khi làm

1. **Hiểu trước khi copy code** — mỗi bước, tự hỏi "nếu không làm bước này thì hậu quả gì".
2. **Làm xong Giai đoạn 0 mới sang DevOps** — không có app chạy thì DevOps không có gì để áp dụng.
3. **Mỗi giai đoạn DevOps nên có 1 mini-milestone rõ ràng** trước khi qua giai đoạn tiếp theo (không học lý thuyết suông).
4. **Linux/Bash và Git dùng song song xuyên suốt**, không phải học xong rồi bỏ qua một bên.
5. Khi gặp lỗi: đọc lỗi trước, đoán nguyên nhân trước, rồi mới hỏi — để rèn tư duy debug độc lập.
