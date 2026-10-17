"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/src/lib/supabase";

type Order = {
  id: number;
  user_id: string;
  total_price: number | string;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  payment_proof_url: string | null;
  payment_proof_submitted_at: string | null;
};

export default function OrderPaymentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const orderId = params.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState("");
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofMessage, setProofMessage] = useState("");
  const [proofMessageIsError, setProofMessageIsError] = useState(false);

  const loadOrder = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace(
          `/login?redirect=${encodeURIComponent(
            `/checkout/payment/${orderId}`,
          )}`,
        );
        return;
      }

      const { data, error: orderError } = await supabase
        .from("orders")
        .select(
          "id, user_id, total_price, status, payment_method, payment_status, created_at, payment_proof_url, payment_proof_submitted_at",
        )
        .eq("id", orderId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (orderError) {
        console.error("Lỗi lấy đơn hàng:", orderError);
        setError("Không thể tải đơn hàng. Vui lòng thử lại.");
        return;
      }

      if (!data) {
        setError(
          "Không tìm thấy đơn hàng hoặc bạn không có quyền xem đơn này.",
        );
        return;
      }

      setOrder(data as Order);
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi tải thông tin đơn hàng.");
    } finally {
      setLoading(false);
    }
  }, [orderId, router]);

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  useEffect(() => {
    return () => {
      if (proofPreview) URL.revokeObjectURL(proofPreview);
    };
  }, [proofPreview]);

  function handleProofChange(file: File | undefined) {
    setProofMessage("");
    setProofMessageIsError(false);

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setProofMessage("Vui lòng chọn ảnh JPG, PNG hoặc WEBP.");
      setProofMessageIsError(true);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProofMessage("Ảnh không được vượt quá 5 MB.");
      setProofMessageIsError(true);
      return;
    }

    setProofFile(file);
    setProofPreview(URL.createObjectURL(file));
  }

  async function handleUploadProof() {
    if (!proofFile || !order) {
      setProofMessage("Vui lòng chọn ảnh minh chứng trước.");
      setProofMessageIsError(true);
      return;
    }

    if (order.payment_proof_url) {
      setProofMessage("Đơn hàng này đã gửi minh chứng.");
      setProofMessageIsError(true);
      return;
    }

    setUploadingProof(true);
    setProofMessage("");
    setProofMessageIsError(false);

    let uploadedFilePath: string | null = null;

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user || user.id !== order.user_id) {
        throw new Error("Vui lòng đăng nhập đúng tài khoản đặt đơn.");
      }

      if (order.payment_method !== "bank_transfer") {
        throw new Error("Đơn hàng này không sử dụng chuyển khoản.");
      }

      if (order.payment_status === "paid") {
        throw new Error("Đơn hàng đã được xác nhận thanh toán.");
      }

      const extensionByType: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
      };

      const extension = extensionByType[proofFile.type];

      if (!extension) {
        throw new Error("Định dạng ảnh không được hỗ trợ.");
      }

      const filePath = `${user.id}/${order.id}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-proofs.")
        .upload(filePath, proofFile, {
          contentType: proofFile.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      uploadedFilePath = filePath;

      const { error: submitError } = await supabase.rpc(
        "submit_payment_proof",
        {
          p_order_id: order.id,
          p_file_path: filePath,
        },
      );

      if (submitError) throw submitError;

      uploadedFilePath = null;

      setProofFile(null);
      setProofPreview("");
      setProofMessage(
        "Gửi minh chứng thành công! Đơn hàng đang chờ admin kiểm tra giao dịch.",
      );

      await loadOrder();
    } catch (err) {
      console.error("Lỗi gửi minh chứng:", err);

      if (uploadedFilePath) {
        const { error: removeError } = await supabase.storage
          .from("payment-proofs")
          .remove([uploadedFilePath]);

        if (removeError) {
          console.error("Không thể dọn ảnh đã tải lên:", removeError);
        }
      }

      setProofMessage(
        err instanceof Error
          ? err.message
          : "Không thể gửi minh chứng. Vui lòng thử lại.",
      );
      setProofMessageIsError(true);
    } finally {
      setUploadingProof(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold">Không tải được đơn hàng</h1>
          <p className="mt-3 break-words text-gray-600">
            {error || "Đơn hàng không tồn tại."}
          </p>

          <button
            type="button"
            onClick={() => void loadOrder()}
            className="mt-5 rounded-xl bg-emerald-800 px-5 py-3 font-semibold text-white"
          >
            Thử tải lại
          </button>

          <div>
            <Link
              href="/products"
              className="mt-4 inline-block text-emerald-800 underline"
            >
              Quay lại sản phẩm
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const amount = Number(order.total_price);
  const isPaid = order.payment_status === "paid";
  const isBankTransfer = order.payment_method === "bank_transfer";
  const hasSubmittedProof = Boolean(order.payment_proof_url);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-xl min-w-0">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-800">
            {isPaid ? "✓" : "₫"}
          </div>

          <h1 className="mt-4 break-words text-2xl font-bold text-gray-900">
            {isPaid
              ? "Đơn hàng đã thanh toán"
              : hasSubmittedProof
                ? "Đã gửi minh chứng thanh toán"
                : "Thanh toán đơn hàng"}
          </h1>

          <p className="mt-2 text-gray-600">
            Mã đơn hàng: <strong>#{order.id}</strong>
          </p>

          <div className="mt-6 rounded-xl border bg-gray-50 p-4 text-left">
            <p className="text-sm text-gray-500">Số tiền đơn hàng</p>
            <p className="mt-1 break-words text-2xl font-bold text-emerald-800">
              {Number.isFinite(amount)
                ? `${amount.toLocaleString("vi-VN")} ₫`
                : "Không xác định"}
            </p>

            <p className="mt-4 text-sm text-gray-500">Phương thức thanh toán</p>
            <p className="mt-1 font-semibold">
              {isBankTransfer
                ? "Chuyển khoản Vietcombank"
                : order.payment_method}
            </p>

            <p className="mt-4 text-sm text-gray-500">Trạng thái thanh toán</p>
            <p className="mt-1 font-semibold">
              {isPaid
                ? "Đã thanh toán"
                : hasSubmittedProof
                  ? "Chờ admin xác nhận"
                  : order.payment_status || "Chưa thanh toán"}
            </p>
          </div>

          {!isPaid && isBankTransfer && !hasSubmittedProof && (
            <>
              <div className="mt-6 rounded-xl border p-4">
                <p className="mb-3 font-semibold">Quét mã QR Vietcombank</p>

                <img
                  src="/image/luuvanquocvcb.jpg"
                  alt="Mã QR chuyển khoản Vietcombank"
                  className="mx-auto w-64 max-w-full rounded-lg border bg-white p-2"
                />

                <p className="mt-4 text-sm text-gray-500">
                  Nội dung chuyển khoản
                </p>

                <p className="mt-1 break-all font-bold">
                  QUOCPERFUME {order.id}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(`QUOCPERFUME ${order.id}`)
                      .then(() => alert("Đã sao chép nội dung chuyển khoản."))
                      .catch(() =>
                        alert(
                          "Không thể sao chép. Vui lòng nhập nội dung thủ công.",
                        ),
                      );
                  }}
                  className="mt-3 rounded-lg border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-100"
                >
                  Sao chép nội dung
                </button>
              </div>

              <section className="mt-6 rounded-xl border p-4 text-left">
                <h2 className="font-semibold">Gửi minh chứng chuyển khoản</h2>

                <p className="mt-2 text-sm text-gray-500">
                  Sau khi chuyển khoản, hãy tải ảnh chụp giao dịch thành công.
                  Admin sẽ kiểm tra trước khi xác nhận thanh toán.
                </p>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handleProofChange(e.target.files?.[0])}
                  className="mt-4 block w-full min-w-0 text-sm"
                  disabled={uploadingProof}
                />

                {proofPreview && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-medium">
                      Ảnh minh chứng đã chọn
                    </p>
                    <img
                      src={proofPreview}
                      alt="Ảnh minh chứng đã chọn"
                      className="mx-auto max-h-72 max-w-full rounded-lg border object-contain"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => void handleUploadProof()}
                  disabled={!proofFile || uploadingProof}
                  className="mt-4 w-full rounded-xl bg-emerald-800 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploadingProof
                    ? "Đang gửi minh chứng..."
                    : "Gửi minh chứng thanh toán"}
                </button>

                {proofMessage && (
                  <p
                    role="status"
                    className={`mt-3 break-words text-sm ${
                      proofMessageIsError ? "text-red-600" : "text-emerald-800"
                    }`}
                  >
                    {proofMessage}
                  </p>
                )}
              </section>

              <p className="mt-5 rounded-xl bg-amber-50 p-4 text-left text-sm text-amber-800">
                Vui lòng chuyển đúng số tiền và nội dung. Gửi ảnh minh chứng
                chưa đồng nghĩa với việc thanh toán đã được xác nhận.
              </p>
            </>
          )}

          {hasSubmittedProof && !isPaid && (
            <div className="mt-6 rounded-xl bg-amber-50 p-4 text-left text-sm text-amber-800">
              <p className="font-semibold">
                Minh chứng đã được gửi thành công.
              </p>
              <p className="mt-2">
                Đơn hàng đang chờ admin kiểm tra giao dịch trong tài khoản
                Vietcombank. Bạn không cần gửi lại ảnh.
              </p>
              {order.payment_proof_submitted_at && (
                <p className="mt-2">
                  Thời gian gửi:{" "}
                  {new Date(order.payment_proof_submitted_at).toLocaleString(
                    "vi-VN",
                  )}
                </p>
              )}
            </div>
          )}

          {isPaid && (
            <p className="mt-5 rounded-xl bg-emerald-50 p-4 text-emerald-800">
              Đơn hàng đã được xác nhận thanh toán.
            </p>
          )}

          <button
            type="button"
            onClick={() => void loadOrder()}
            className="mt-4 w-full rounded-xl border px-5 py-3 font-semibold hover:bg-gray-50"
          >
            Kiểm tra lại trạng thái đơn hàng
          </button>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/products"
              className="rounded-xl bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-900"
            >
              Tiếp tục mua sắm
            </Link>

            <Link
              href="/"
              className="rounded-xl border px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
