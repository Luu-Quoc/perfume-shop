export type Product = {
  id: number;
  name: string;
  description: string;
  scent_notes: string;
  occasion: string;
  price: number;
  image_url: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: number;
  user_id: string;
  total_price: number;
  status: string;
  created_at: string;
};
