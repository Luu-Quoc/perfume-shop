"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { CartItem, Product } from "../lib/types";

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "quoc-perfume-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Đọc giỏ hàng đã lưu khi component được khởi tạo.
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (savedCart) {
        const parsedCart: CartItem[] = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        }
      }
    } catch (error) {
      console.error("Không thể đọc giỏ hàng:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. Lưu giỏ hàng sau khi đã đọc dữ liệu ban đầu.
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Không thể lưu giỏ hàng:", error);
    }
  }, [items, isLoaded]);

  // 3. Thêm sản phẩm vào giỏ.
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
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prev, { product, quantity: 1 }];
    });

    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  }

  // 4. Thay đổi số lượng sản phẩm.
  function updateQuantity(productId: number, quantity: number) {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.product.id !== productId);
      }

      return prev.map((item) => {
        if (item.product.id !== productId) {
          return item;
        }

        if (quantity > item.product.stock) {
          alert(`Chỉ còn ${item.product.stock} sản phẩm trong kho`);

          return {
            ...item,
            quantity: item.product.stock,
          };
        }

        return { ...item, quantity };
      });
    });
  }

  // 5. Xóa một sản phẩm.
  function removeFromCart(productId: number) {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }

  // 6. Xóa toàn bộ giỏ hàng sau khi đặt hàng thành công.
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

// Custom hook.
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart phải được sử dụng bên trong CartProvider");
  }

  return context;
}
