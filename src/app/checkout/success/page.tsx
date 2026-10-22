"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Download, LoaderCircle } from "lucide-react";
import { jsPDF } from "jspdf";
import { supabase } from "@/src/lib/supabase";

type Order = {
  id: number;
  user_id: string;
  total_price: number;
  status: string;
  created_at: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  payment_method: string;
  payment_status: string;
};

type OrderItem = {
  product_id: number;
  quantity: number;
  price: number;
  subtotal: number;
  product: { name: string } | null;
};

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order");

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      if (!orderId || !/^\d+$/.test(orderId)) {
        setError("Mã đơn hàng không hợp lệ.");
        setLoading(false);
        return;
      }

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace("/login");
        return;
      }

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", Number(orderId))
        .eq("user_id", user.id)
        .maybeSingle();

      if (orderError || !orderData) {
        setError("Không tìm thấy đơn hàng hoặc bạn không có quyền xem.");
        setLoading(false);
        return;
      }

      const { data: itemData, error: itemError } = await supabase
        .from("order_items")
        .select(
          `
          product_id,
          quantity,
          price,
          subtotal,
          product:products(name)
        `,
        )
        .eq("order_id", Number(orderId));

      if (itemError) {
        setError("Không thể tải chi tiết sản phẩm trong đơn hàng.");
        setLoading(false);
        return;
      }

      setOrder(orderData as Order);
      setItems((itemData ?? []) as unknown as OrderItem[]);
      setLoading(false);
    }

    loadOrder();
  }, [orderId, router]);

  function exportPDF() {
    if (!order) return;

    const doc = new jsPDF();
    let y = 20;

    // Font mặc định có thể không hiển thị đúng tiếng Việt có dấu.
    // Bước tiếp theo sẽ bổ sung font Unicode cho hóa đơn.
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("QUOC PERFUME", 105, y, { align: "center" });

    y += 10;
    doc.setFontSize(14);
    doc.text("ORDER RECEIPT", 105, y, { align: "center" });

    y += 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Order ID: ${order.id}`, 15, y);
    y += 7;
    doc.text(
      `Date: ${new Date(order.created_at).toLocaleString("vi-VN")}`,
      15,
      y,
    );
    y += 10;

    doc.text(`Customer: ${order.shipping_name}`, 15, y);
    y += 7;
    doc.text(`Phone: ${order.shipping_phone}`, 15, y);
    y += 7;

    const addressLines = doc.splitTextToSize(
      `Address: ${order.shipping_address}`,
      175,
    );
    doc.text(addressLines, 15, y);
    y += addressLines.length * 6 + 5;

    doc.text("Products", 15, y);
    doc.text("Qty", 125, y);
    doc.text("Price", 150, y);
    doc.text("Subtotal", 195, y, { align: "right" });
    y += 7;

    doc.line(15, y, 195, y);
    y += 6;

    items.forEach((item) => {
      const name = item.product?.name ?? `Product #${item.product_id}`;
      const lines = doc.splitTextToSize(name, 100);

      if (y + lines.length * 6 > 270) {
        doc.addPage();
        y = 20;
      }

      doc.text(lines, 15, y);
      doc.text(String(item.quantity), 125, y);
      doc.text(Number(item.price).toLocaleString("en-US"), 150, y);
      doc.text(Number(item.subtotal).toLocaleString("en-US"), 195, y, {
        align: "right",
      });

      y += Math.max(lines.length * 6, 7);
    });

    y += 5;
    if (y > 275) {
      doc.addPage();
      y = 20;
    }

    doc.line(15, y, 195, y);
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text(
      `Total: ${Number(order.total_price).toLocaleString("en-US")} VND`,
      195,
      y,
      { align: "right" },
    );

    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`Payment: ${order.payment_method}`, 15, y);
    y += 7;
    doc.text(`Payment status: ${order.payment_status}`, 15, y);

    doc.save(`QUOC-PERFUME-order-${order.id}.pdf`);
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <LoaderCircle className="animate-spin mr-2" />
        Đang tải thông tin đơn hàng...
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-red-600">{error || "Không tìm thấy đơn hàng."}</p>
        <Link href="/orders" className="text-emerald-800 underline">
          Xem đơn hàng của tôi
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-lg w-full">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />

        <h1 className="mt-5 text-2xl font-bold text-gray-900 text-center">
          Đặt hàng thành công!
        </h1>

        <p className="mt-2 text-gray-500 text-center">
          Cảm ơn bạn đã mua hàng tại QUOC PERFUME.
        </p>

        <div className="mt-6 rounded-xl bg-gray-50 p-4 space-y-2 text-sm">
          <p>
            <strong>Mã đơn hàng:</strong> #{order.id}
          </p>
          <p>
            <strong>Người nhận:</strong> {order.shipping_name}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {order.shipping_phone}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {order.shipping_address}
          </p>
          <p>
            <strong>Tổng tiền:</strong>{" "}
            {Number(order.total_price).toLocaleString("vi-VN")} ₫
          </p>
          <p>
            <strong>Thanh toán:</strong> {order.payment_status}
          </p>
        </div>

        <button
          onClick={exportPDF}
          className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-800 text-white font-medium hover:bg-emerald-900"
        >
          <Download size={18} />
          Xuất hóa đơn PDF
        </button>

        <Link
          href="/products"
          className="mt-3 block w-full text-center py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          Tiếp tục mua hàng
        </Link>

        <Link
          href="/"
          className="mt-3 block text-center text-gray-500 hover:text-gray-800"
        >
          Về trang chủ
        </Link>
      </div>
    </main>
  );
}
