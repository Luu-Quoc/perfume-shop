export type Product = {
  id: number;
  name: string;
  description: string;

  // Thông tin sản phẩm
  brand: string | null;
  category: string | null;
  gender: string | null;
  volume: number | null;

  // Thông tin nước hoa
  scent_notes: string;
  occasion: string;

  // Giá và kho
  price: number;
  stock: number;

  // Hình ảnh
  image_url: string;

  // Trạng thái
  is_active: boolean;

  // Thời gian
  created_at: string;
  updated_at: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: number;
  user_id: string;
  total_price: number;

  status: "pending" | "confirmed" | "shipping" | "completed" | "cancelled";

  shipping_name: string | null;
  shipping_phone: string | null;
  shipping_address: string | null;

  payment_method: string | null;
  payment_status: string | null;

  created_at: string;
  updated_at: string;
};
