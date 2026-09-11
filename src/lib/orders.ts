import { supabase } from "./supabase";
import { CartItem } from "./types";

export async function createOrder(
  userId: string,
  items: CartItem[],
  totalPrice: number,
) {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({ user_id: userId, total_price: totalPrice, status: "pending" })
    .select()
    .single();

  if (orderError) throw new Error(orderError.message);

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.product.id,
    quantity: item.quantity,
    price: item.product.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);
  if (itemsError) throw new Error(itemsError.message);

  return order;
}

export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}
