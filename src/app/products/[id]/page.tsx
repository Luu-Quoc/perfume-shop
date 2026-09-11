import { getProductById } from "@/src/lib/products";
import { notFound } from "next/navigation";

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full rounded-lg"
      />
      <h1 className="text-3xl font-bold mt-4">{product.name}</h1>
      <p className="text-gray-600 mt-2">{product.description}</p>
      <p className="mt-2">
        <strong>Note hương:</strong> {product.scent_notes}
      </p>
      <p className="mt-2">
        <strong>Dịp dùng:</strong> {product.occasion}
      </p>
      <p className="text-2xl font-bold mt-4">
        {product.price.toLocaleString()}đ
      </p>
    </main>
  );
}
