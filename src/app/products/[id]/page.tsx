import Link from "next/link";
import { getProductById } from "@/src/lib/products";
import ProductDetailClient from "./ProductDetailClient";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  const productId = Number(id);

  // ID không hợp lệ
  if (!Number.isInteger(productId)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Sản phẩm không hợp lệ
          </h1>

          <Link
            href="/products"
            className="inline-block mt-4 text-emerald-800 hover:underline"
          >
            ← Quay lại sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  const product = await getProductById(productId);

  // Không tìm thấy sản phẩm
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Không tìm thấy sản phẩm
          </h1>

          <p className="mt-2 text-gray-500">
            Sản phẩm bạn đang tìm kiếm không tồn tại.
          </p>

          <Link
            href="/products"
            className="inline-block mt-4 text-emerald-800 hover:underline"
          >
            ← Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
