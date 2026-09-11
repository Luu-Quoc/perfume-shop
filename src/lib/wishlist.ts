import { supabase } from "./supabase";
import { Product } from "./types";

export async function addToWishlist(userId: string, productId: number) {
  const { error } = await supabase
    .from("wishlist")
    .insert({ user_id: userId, product_id: productId });
  if (error) throw new Error(error.message);
}

export async function getUserWishlist(userId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("wishlist")
    .select("product_id, products(*)")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return (data || []).map((row: any) => row.products);
}
