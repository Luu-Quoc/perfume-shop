"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { getUserWishlist } from "@/src/lib/wishlist";
import { Product } from "@/src/lib/types";
import ProductGrid from "@/src/components/ProductGrid";
import ProtectedRoute from "@/src/components/ProtectedRoute";

export default function WishlistPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!user) return;
    getUserWishlist(user.id).then(setProducts);
  }, [user]);

  return (
    <ProtectedRoute>
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-6">Sản phẩm yêu thích</h1>
        <ProductGrid products={products} />
      </main>
    </ProtectedRoute>
  );
}
