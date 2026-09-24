"use client";

import { createContext, useContext, useState, ReactNode } from "react";

import { CartItem, Product } from "../lib/types";

type CartContextType = {
  items: CartItem[];

  // Thêm sản phẩm vào giỏ
  addToCart: (product: Product) => void;

  // Thay đổi số lượng
  updateQuantity: (productId: number, quantity: number) => void;

  // Xóa sản phẩm
  removeFromCart: (productId: number) => void;

  // Xóa toàn bộ giỏ hàng
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // ==========================================
  // THÊM SẢN PHẨM VÀO GIỎ
  // ==========================================
  function addToCart(product: Product) {
    if (product.stock <= 0) {
      alert("Sản phẩm đã hết hàng");
      return;
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);

      if (existing) {
        if (existing.quantity >= product.stock) {
          alert("Số lượng sản phẩm đã đạt giới hạn tồn kho");
          return prev;
        }

        return prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...prev,
        {
          product,
          quantity: 1,
        },
      ];
    });

    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  }

  // ==========================================
  // THAY ĐỔI SỐ LƯỢNG
  // ==========================================
  function updateQuantity(productId: number, quantity: number) {
    setItems((prev) => {
      // Nếu giảm xuống 0 → xóa sản phẩm
      if (quantity <= 0) {
        return prev.filter((item) => item.product.id !== productId);
      }

      return prev.map((item) => {
        // Không phải sản phẩm cần sửa
        if (item.product.id !== productId) {
          return item;
        }

        // Không cho vượt tồn kho
        if (quantity > item.product.stock) {
          alert(`Chỉ còn ${item.product.stock} sản phẩm trong kho`);

          return {
            ...item,
            quantity: item.product.stock,
          };
        }

        // Cập nhật số lượng
        return {
          ...item,
          quantity,
        };
      });
    });
  }

  // ==========================================
  // XÓA 1 SẢN PHẨM
  // ==========================================
  function removeFromCart(productId: number) {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }

  // ==========================================
  // XÓA TOÀN BỘ GIỎ HÀNG
  // ==========================================
  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ==========================================
// CUSTOM HOOK
// ==========================================
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart phải được sử dụng bên trong CartProvider");
  }

  return context;
}
